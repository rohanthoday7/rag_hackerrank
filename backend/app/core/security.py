from fastapi import Header, HTTPException
from app.core.config import get_settings


settings = get_settings()


async def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if not settings.require_api_key:
        return
    if not x_api_key or x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="unauthorized")
