from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.patient import Patient
from services.simulator_service import simulator

router = APIRouter(prefix="/api/simulator", tags=["simulator"])


@router.post("/start/{patient_id}")
async def start_simulator(patient_id: int, db: Session = Depends(get_db)) -> dict:
    if not db.get(Patient, patient_id):
        raise HTTPException(status_code=404, detail="Patient not found")
    return await simulator.start(patient_id)


@router.post("/stop/{patient_id}")
async def stop_simulator(patient_id: int) -> dict:
    return await simulator.stop(patient_id)
