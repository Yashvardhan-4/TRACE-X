from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.ddl import Case
from app.scenarios.generator import seed_complete_synthetic_twin
from app.api import cases, graph, counterfactual, scenarios, copilot, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed if database is empty
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        case_count = db.query(Case).count()
        if case_count == 0:
            print("[Startup] Database is empty. Seeding synthetic digital twin universe...")
            seed_complete_synthetic_twin(db)
        else:
            print(f"[Startup] Found {case_count} existing cases. Ready.")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="TRACE-X: Temporal Risk & Activity Correlation Engine API",
    lifespan=lifespan
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(counterfactual.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.PROJECT_VERSION
    }
