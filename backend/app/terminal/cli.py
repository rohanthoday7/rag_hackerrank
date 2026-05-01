import json
import asyncio
from pathlib import Path
import pandas as pd
import typer
from rich.console import Console
from rich.table import Table
from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.schemas import TicketCreate
from app.models.db_models import Ticket, ResponseRecord, ConfidenceScore, EscalationHistory
from app.state import orchestrator

app = typer.Typer(help="SentinelSupport cinematic terminal controls")
console = Console()


@app.command()
def simulate(ticket_file: str):
    async def _run():
        tickets = json.loads(Path(ticket_file).read_text(encoding="utf-8"))
        async with SessionLocal() as db:
            for ticket in tickets:
                payload = TicketCreate(**ticket)
                result = await orchestrator.process_ticket(db, payload)
                console.print(f"[bold cyan]Ticket[/bold cyan] #{result.ticket_id} escalated={result.escalated} confidence={result.confidence['final_confidence']}")
    asyncio.run(_run())


@app.command("live-stream")
def live_stream():
    console.print("[green]Live pipeline monitor[/green] - use API calls to generate events.")


@app.command("export-csv")
def export_csv(output: str = "outputs/tickets.csv"):
    async def _run():
        async with SessionLocal() as db:
            rows = (
                await db.execute(
                    select(
                        Ticket.id,
                        Ticket.source,
                        Ticket.subject,
                        EscalationHistory.escalated,
                        EscalationHistory.risk_score,
                        ConfidenceScore.final_confidence,
                        ResponseRecord.response_text,
                    )
                    .join(EscalationHistory, EscalationHistory.ticket_id == Ticket.id)
                    .join(ConfidenceScore, ConfidenceScore.ticket_id == Ticket.id)
                    .join(ResponseRecord, ResponseRecord.ticket_id == Ticket.id)
                )
            ).all()
        df = pd.DataFrame(rows, columns=["ticket_id", "source", "subject", "escalated", "risk_score", "final_confidence", "response_text"])
        Path(output).parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(output, index=False)
        table = Table(title="Export complete")
        table.add_column("Path")
        table.add_row(output)
        console.print(table)
    asyncio.run(_run())


if __name__ == "__main__":
    app()
