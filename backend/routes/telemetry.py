from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.device import Device
from models.vital_reading import VitalReading
from routes.realtime import manager
from schemas.telemetry_schema import TelemetryIn
from services.alert_service import reading_to_payload

router = APIRouter(prefix="/api/telemetry", tags=["telemetry"])


async def persist_telemetry(payload: TelemetryIn, db: Session) -> dict:
    device = (
        db.query(Device)
        .filter(Device.device_id == payload.device_id, Device.is_active.is_(True))
        .first()
    )
    if not device:
        raise HTTPException(status_code=404, detail="Active device not found")
    if not device.assigned_patient_id:
        raise HTTPException(status_code=400, detail="Device is not assigned to a patient")

    reading = VitalReading(
        patient_id=device.assigned_patient_id,
        device_id=device.id,
        recorded_at=payload.recorded_at or datetime.utcnow(),
        **payload.readings.model_dump(),
    )
    db.add(reading)
    db.commit()
    reading = (
        db.query(VitalReading)
        .options(joinedload(VitalReading.device))
        .filter(VitalReading.id == reading.id)
        .one()
    )
    response = reading_to_payload(reading)
    await manager.broadcast(reading.patient_id, response)
    return response


@router.post("")
async def receive_telemetry(payload: TelemetryIn, db: Session = Depends(get_db)) -> dict:
    return await persist_telemetry(payload, db)
