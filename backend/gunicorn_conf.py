import multiprocessing
import os

# Gunicorn config variables
loglevel = os.getenv("LOG_LEVEL", "info")
workers = max(int(os.getenv("WEB_CONCURRENCY", 1)), 1)
bind = os.getenv("BIND", "0.0.0.0:8001")
errorlog = "-"
accesslog = "-"
graceful_timeout = int(os.getenv("GRACEFUL_TIMEOUT", "120"))
timeout = int(os.getenv("TIMEOUT", "120"))
keepalive = int(os.getenv("KEEP_ALIVE", "5"))

# Use Uvicorn's worker class
worker_class = "uvicorn.workers.UvicornWorker"
