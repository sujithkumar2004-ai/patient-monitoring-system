import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, SessionLocal, engine
from models.device import Device
from models.patient import Patient
from routes import devices, patients, realtime, simulator, telemetry

app = FastAPI(title="Patient Monitor API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(cors_origins)),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router)
app.include_router(devices.router)
app.include_router(telemetry.router)
app.include_router(realtime.router)
app.include_router(simulator.router)


def seed_data() -> None:
    db = SessionLocal()
    try:
        if db.query(Patient).count() == 0:
            raj = Patient(
                name="Raj Kumar",
                age=54,
                gender="Male",
                ward="ICU",
                bed_number="Bed 01",
                diagnosis="Post-operative cardiac observation",
            )
            meena = Patient(
                name="Meena Devi",
                age=63,
                gender="Female",
                ward="ICU",
                bed_number="Bed 02",
                diagnosis="Acute respiratory monitoring",
            )
            db.add_all([raj, meena])
            db.flush()
            db.add_all(
                [
                    Device(device_id="ESP32-001", device_name="ESP32 Bedside Monitor 01", assigned_patient_id=raj.id),
                    Device(device_id="ESP32-002", device_name="ESP32 Bedside Monitor 02", assigned_patient_id=meena.id),
                ]
            )
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    if os.getenv("SEED_ON_STARTUP", "true").lower() == "true":
        seed_data()


@app.get("/")
def health_check() -> dict:
    return {"status": "ok", "service": "patient-monitor-api"}
