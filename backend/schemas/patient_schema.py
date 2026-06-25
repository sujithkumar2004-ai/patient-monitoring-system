from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    ward: str
    bed_number: str
    diagnosis: str


class PatientCreate(PatientBase):
    pass


class PatientOut(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class DeviceBase(BaseModel):
    device_id: str
    device_name: str
    is_active: bool = True


class DeviceCreate(DeviceBase):
    assigned_patient_id: int | None = None


class DeviceOut(DeviceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assigned_patient_id: int | None
    created_at: datetime
