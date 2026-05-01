from time import perf_counter
from app.agents.types import AgentContext


class ObservabilityAgent:
    name = "observability_agent"

    async def timed(self, ctx: AgentContext, agent_name: str, stage_name: str, fn):
        start = perf_counter()
        result = await fn(ctx)
        latency_ms = int((perf_counter() - start) * 1000)
        ctx.traces.append(
            {
                "agent_name": agent_name,
                "step_name": stage_name,
                "latency_ms": latency_ms,
                "reasoning": {"output_keys": list(result.keys()) if isinstance(result, dict) else []},
            }
        )
        return result
