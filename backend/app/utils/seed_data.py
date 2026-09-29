from app.core.database import engine, Base, SessionLocal
from app.scenarios.generator import seed_complete_synthetic_twin

def init_and_seed_db():
    print("[DB Init] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_complete_synthetic_twin(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_db()
