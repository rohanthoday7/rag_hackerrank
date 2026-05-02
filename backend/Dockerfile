FROM python:3.11-slim

# Set environment variables for Python and Docker
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SENTINEL_DATABASE_URL="sqlite+aiosqlite:///./data/sentinel_support.db"

WORKDIR /app

# Install system dependencies if required (e.g. for building some C extensions, although faiss-cpu usually has wheels)
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app
COPY datasets ./datasets
COPY gunicorn_conf.py ./gunicorn_conf.py

# Create a directory for the persistent database/data
RUN mkdir -p /app/data

# Run as a non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8001

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/api/v1/healthz || exit 1

# Start the application using Gunicorn and Uvicorn workers
CMD ["gunicorn", "-c", "gunicorn_conf.py", "app.main:app"]
