# SentinelSupport Backend Structure

```text
backend/
  app/
    agents/
    core/
    models/
    pipelines/
    retrieval/
    terminal/
  analytics/
  configs/
  datasets/
  docs/
  embeddings/
  escalation/
  logging/
  monitoring/
  outputs/
  prompts/
  safety/
  tests/
  utils/
  vectorstore/
```

This layout separates runtime orchestration from governance planes (safety, observability, analytics) and keeps terminal operations first-class.
