from models.vital_reading import VitalReading


def evaluate_alert(reading: VitalReading) -> tuple[str, list[str]]:
    messages: list[str] = []
    critical = False
    warning = False

    if reading.spo2 < 90:
        critical = True
        messages.append("SpO2 critically low")
    elif reading.spo2 < 94:
        warning = True
        messages.append("SpO2 below target")

    if reading.heart_rate < 50 or reading.heart_rate > 120:
        critical = True
        messages.append("Heart rate critical")

    if reading.temperature > 38:
        warning = True
        messages.append("Temperature elevated")

    if reading.respiratory_rate > 24:
        warning = True
        messages.append("Respiratory rate elevated")

    if reading.fall_detected:
        critical = True
        messages.append("Fall detected")

    if critical:
        return "critical", messages
    if warning:
        return "warning", messages
    return "normal", ["Vitals stable"]


def reading_to_payload(reading: VitalReading) -> dict:
    alert_level, alert_messages = evaluate_alert(reading)
    return {
        "id": reading.id,
        "patient_id": reading.patient_id,
        "device_id": reading.device_id,
        "device_identifier": reading.device.device_id if reading.device else str(reading.device_id),
        "recorded_at": reading.recorded_at.isoformat(),
        "created_at": reading.created_at.isoformat(),
        "heart_rate": reading.heart_rate,
        "spo2": reading.spo2,
        "temperature": reading.temperature,
        "systolic_bp": reading.systolic_bp,
        "diastolic_bp": reading.diastolic_bp,
        "respiratory_rate": reading.respiratory_rate,
        "ecg_status": reading.ecg_status,
        "fall_detected": reading.fall_detected,
        "alert_level": alert_level,
        "alert_messages": alert_messages,
    }
