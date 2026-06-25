import asyncio
import random
from datetime import datetime

from sqlalchemy.orm import Session

from database import SessionLocal
from models.device import Device
from schemas.telemetry_schema import TelemetryIn, VitalReadingPayload


class SimulatorService:
    def __init__(self) -> None:
        self.tasks: dict[int, asyncio.Task] = {}

    def is_running(self, patient_id: int) -> bool:
        task = self.tasks.get(patient_id)
        return bool(task and not task.done())

    async def start(self, patient_id: int) -> dict:
        if self.is_running(patient_id):
            return {"patient_id": patient_id, "status": "already_running"}

        task = asyncio.create_task(self._run(patient_id))
        self.tasks[patient_id] = task
        return {"patient_id": patient_id, "status": "started"}

    async def stop(self, patient_id: int) -> dict:
        task = self.tasks.get(patient_id)
        if not task:
            return {"patient_id": patient_id, "status": "not_running"}
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
        self.tasks.pop(patient_id, None)
        return {"patient_id": patient_id, "status": "stopped"}

    async def _run(self, patient_id: int) -> None:
        from routes.telemetry import persist_telemetry

        while True:
            db: Session = SessionLocal()
            try:
                device = (
                    db.query(Device)
                    .filter(Device.assigned_patient_id == patient_id, Device.is_active.is_(True))
                    .order_by(Device.id)
                    .first()
                )
                if device:
                    payload = TelemetryIn(
                        device_id=device.device_id,
                        recorded_at=datetime.utcnow(),
                        readings=self._generate_reading(),
                    )
                    await persist_telemetry(payload, db)
            finally:
                db.close()
            await asyncio.sleep(1)

    def _generate_reading(self) -> VitalReadingPayload:
        heart_rate = int(random.gauss(82, 12))
        spo2 = int(random.gauss(97, 2))
        temperature = round(random.gauss(36.9, 0.45), 1)
        systolic = int(random.gauss(122, 12))
        diastolic = int(random.gauss(78, 8))
        respiratory_rate = int(random.gauss(18, 4))

        heart_rate = min(110, max(60, heart_rate))
        spo2 = min(100, max(92, spo2))
        temperature = min(38.5, max(36.0, temperature))
        systolic = min(150, max(100, systolic))
        diastolic = min(95, max(60, diastolic))
        respiratory_rate = min(28, max(12, respiratory_rate))

        status_roll = random.random()
        if heart_rate > 104 or status_roll < 0.05:
            ecg_status = "tachycardia"
        elif heart_rate < 64 or status_roll < 0.08:
            ecg_status = "bradycardia"
        elif status_roll < 0.13:
            ecg_status = "irregular"
        else:
            ecg_status = "normal"

        return VitalReadingPayload(
            heart_rate=heart_rate,
            spo2=spo2,
            temperature=temperature,
            systolic_bp=systolic,
            diastolic_bp=diastolic,
            respiratory_rate=respiratory_rate,
            ecg_status=ecg_status,
            fall_detected=random.random() < 0.01,
        )


simulator = SimulatorService()
