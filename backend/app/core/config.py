from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SENTINEL_", env_file=".env", extra="ignore")

    app_name: str = "SentinelSupport"
    app_env: str = "dev"
    database_url: str = "sqlite+aiosqlite:///./sentinel_support.db"
    api_key: str = "sentinel-dev-key"
    require_api_key: bool = True
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    retrieval_top_k: int = 6
    retrieval_min_score: float = 0.35
    retrieval_hybrid_alpha: float = 0.75
    escalation_threshold: float = 0.65
    max_context_chars: int = 3500
    api_rate_limit_per_minute: int = 120
    embedding_fallback_to_hash: bool = True
    max_request_bytes: int = 32768
    auto_create_schema: bool = True


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
