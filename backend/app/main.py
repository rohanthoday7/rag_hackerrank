from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from collections import defaultdict, deque
from time import time
from contextlib import asynccontextmanager
from app.core.logging import configure_logging, get_logger
from app.core.database import engine, Base
from app.core.config import get_settings
from app.api import router

configure_logging()
logger = get_logger("sentinel_support")
settings = get_settings()
_rate_buckets: dict[str, deque] = defaultdict(deque)


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("startup_complete")
    yield


app = FastAPI(title="SentinelSupport API", version="1.0.0", lifespan=lifespan)
app.include_router(router)


@app.middleware("http")
async def request_log_middleware(request: Request, call_next):
    client_key = request.client.host if request.client else "unknown"
    now = time()
    bucket = _rate_buckets[client_key]
    while bucket and (now - bucket[0]) > 60:
        bucket.popleft()
    if len(bucket) >= settings.api_rate_limit_per_minute:
        return JSONResponse(status_code=429, content={"detail": "rate_limited"})
    bucket.append(now)
    logger.info("request_received", method=request.method, path=str(request.url.path))
    response = await call_next(request)
    logger.info("request_completed", method=request.method, path=str(request.url.path), status=response.status_code)
    return response


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc))
    return JSONResponse(status_code=500, content={"detail": "internal_error", "message": str(exc)})


