from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(32), nullable=False)
    ward: Mapped[str] = mapped_column(String(80), nullable=False)
    bed_number: Mapped[str] = mapped_column(String(32), nullable=False)
    diagnosis: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    devices = relationship("Device", back_populates="assigned_patient")
    readings = relationship("VitalReading", back_populates="patient", cascade="all, delete-orphan")
