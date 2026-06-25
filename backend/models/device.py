from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Device(Base):
    __tablename__ = "iot_devices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    device_id: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    device_name: Mapped[str] = mapped_column(String(120), nullable=False)
    assigned_patient_id: Mapped[int | None] = mapped_column(ForeignKey("patients.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    assigned_patient = relationship("Patient", back_populates="devices")
    readings = relationship("VitalReading", back_populates="device")
