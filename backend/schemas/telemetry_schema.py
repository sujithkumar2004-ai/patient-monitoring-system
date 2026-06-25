from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VitalReadingPayload(BaseModel):
    heart_rate: int = Field(..., ge=0, le=250)
    spo2: int = Field(..., ge=0, le=100)
    temperature: float = Field(..., ge=25, le=45)
    systolic_bp: int = Field(..., ge=40, le=260)
    diastolic_bp: int = Field(..., ge=20, le=180)
    respiratory_rate: int = Field(..., ge=0, le=80)
    ecg_status: str
    fall_detected: bool = False


class TelemetryIn(BaseModel):
    device_id: str
    recorded_at: datetime | None = None
    readings: VitalReadingPayload


class VitalReadingOut(VitalReadingPayload):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int
    device_id: int
    recorded_at: datetime
    created_at: datetime
    alert_level: str = "normal"
    alert_messages: list[str] = []


class RealtimeReading(BaseModel):
    id: int
    patient_id: int
    device_identifier: str
    recorded_at: datetime
    heart_rate: int
    spo2: int
    temperature: float
    systolic_bp: int
    diastolic_bp: int
    respiratory_rate: int
    ecg_status: str
    fall_detected: bool
    alert_level: str
    alert_messages: list[str]
