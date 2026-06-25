export type AlertLevel = "normal" | "warning" | "critical";

export type TelemetryReading = {
  id: number;
  patient_id: number;
  device_id?: number;
  device_identifier: string;
  heart_rate: number;
  spo2: number;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  respiratory_rate: number;
  ecg_status: string;
  fall_detected: boolean;
  recorded_at: string;
  created_at?: string;
  alert_level: AlertLevel;
  alert_messages: string[];
};

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "offline";
