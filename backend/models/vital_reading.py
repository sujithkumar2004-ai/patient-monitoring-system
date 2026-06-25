from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class VitalReading(Base):
    __tablename__ = "vital_readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), index=True, nullable=False)
    device_id: Mapped[int] = mapped_column(ForeignKey("iot_devices.id"), index=True, nullable=False)
    heart_rate: Mapped[int] = mapped_column(Integer, nullable=False)
    spo2: Mapped[int] = mapped_column(Integer, nullable=False)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    systolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    diastolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    respiratory_rate: Mapped[int] = mapped_column(Integer, nullable=False)
    ecg_status: Mapped[str] = mapped_column(String(40), nullable=False)
    fall_detected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("Patient", back_populates="readings")
    device = relationship("Device", back_populates="readings")
