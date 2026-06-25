from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.device import Device
from models.patient import Patient
from schemas.patient_schema import DeviceCreate, DeviceOut

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.post("", response_model=DeviceOut)
def create_device(payload: DeviceCreate, db: Session = Depends(get_db)) -> Device:
    existing = db.query(Device).filter(Device.device_id == payload.device_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Device ID already exists")

    if payload.assigned_patient_id and not db.get(Patient, payload.assigned_patient_id):
        raise HTTPException(status_code=404, detail="Assigned patient not found")

    device = Device(**payload.model_dump())
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


@router.get("", response_model=list[DeviceOut])
def list_devices(db: Session = Depends(get_db)) -> list[Device]:
    return db.query(Device).order_by(Device.id).all()


@router.post("/{device_id}/assign/{patient_id}", response_model=DeviceOut)
def assign_device(device_id: str, patient_id: int, db: Session = Depends(get_db)) -> Device:
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    patient = db.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    device.assigned_patient_id = patient.id
    db.commit()
    db.refresh(device)
    return device
