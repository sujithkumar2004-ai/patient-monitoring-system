import type { Patient } from "@/types/patient";
import type { TelemetryReading } from "@/types/telemetry";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api";

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, "") ?? "ws://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getPatients() {
  return request<Patient[]>("/patients");
}

export function getPatient(patientId: string | number) {
  return request<Patient>(`/patients/${patientId}`);
}

export function getPatientReadings(patientId: string | number, limit = 60) {
  return request<TelemetryReading[]>(`/patients/${patientId}/readings?limit=${limit}`);
}

export function startSimulator(patientId: string | number) {
  return request<{ status: string }>(`/simulator/start/${patientId}`, { method: "POST" });
}

export function stopSimulator(patientId: string | number) {
  return request<{ status: string }>(`/simulator/stop/${patientId}`, { method: "POST" });
}
