from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.patient import Patient
from models.vital_reading import VitalReading
from schemas.patient_schema import PatientCreate, PatientOut
from services.alert_service import reading_to_payload

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.post("", response_model=PatientOut)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)) -> Patient:
    patient = Patient(**payload.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("", response_model=list[PatientOut])
def list_patients(db: Session = Depends(get_db)) -> list[Patient]:
    return db.query(Patient).order_by(Patient.id).all()


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)) -> Patient:
    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/{patient_id}/readings/latest")
def latest_reading(patient_id: int, db: Session = Depends(get_db)) -> dict:
    reading = (
        db.query(VitalReading)
        .options(joinedload(VitalReading.device))
        .filter(VitalReading.patient_id == patient_id)
        .order_by(desc(VitalReading.recorded_at), desc(VitalReading.id))
        .first()
    )
    if not reading:
        raise HTTPException(status_code=404, detail="No readings found for patient")
    return reading_to_payload(reading)


@router.get("/{patient_id}/readings")
def patient_readings(patient_id: int, limit: int = 100, db: Session = Depends(get_db)) -> list[dict]:
    limit = max(1, min(limit, 500))
    readings = (
        db.query(VitalReading)
        .options(joinedload(VitalReading.device))
        .filter(VitalReading.patient_id == patient_id)
        .order_by(desc(VitalReading.recorded_at), desc(VitalReading.id))
        .limit(limit)
        .all()
    )
    return [reading_to_payload(reading) for reading in reversed(readings)]
