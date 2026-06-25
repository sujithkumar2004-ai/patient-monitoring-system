"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, HeartPulse, Wind, Thermometer, Droplets, Gauge, PersonStanding, ChevronLeft } from "lucide-react";

import { AlertPanel } from "@/components/AlertPanel";
import { EcgWave } from "@/components/EcgWave";
import { MonitorHeader } from "@/components/MonitorHeader";
import { RealtimeChart } from "@/components/RealtimeChart";
import { VitalCard } from "@/components/VitalCard";
import { getPatient, startSimulator, stopSimulator } from "@/lib/api";
import { usePatientStream } from "@/lib/usePatientStream";
import type { Patient } from "@/types/patient";

export default function MonitorPage({ params }: { params: { patientId: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [simulatorStatus, setSimulatorStatus] = useState("idle");
  const { readings, latest, status } = usePatientStream(params.patientId);

  useEffect(() => {
    getPatient(params.patientId).then(setPatient).catch(() => setPatient(null));
  }, [params.patientId]);

  const handleStart = async () => {
    const response = await startSimulator(params.patientId);
    setSimulatorStatus(response.status);
  };

  const handleStop = async () => {
    const response = await stopSimulator(params.patientId);
    setSimulatorStatus(response.status);
  };

  return (
    <main className="min-h-screen bg-monitor-bg text-slate-100">
      <MonitorHeader patient={patient} status={status} />
      <div className="grid gap-4 p-4 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
            <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
              <ChevronLeft size={18} />
              Patients
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStart}
                className="rounded-md bg-monitor-green px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Start Simulator
              </button>
              <button
                onClick={handleStop}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Stop
              </button>
              <span className="font-mono text-xs uppercase text-slate-500">{simulatorStatus}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <VitalCard label="Heart Rate" value={latest?.heart_rate ?? "--"} unit="bpm" color="green" icon={HeartPulse} detail="ECG lead II" />
            <VitalCard label="SpO2" value={latest?.spo2 ?? "--"} unit="%" color="cyan" icon={Droplets} detail="Pulse oximeter" />
            <VitalCard label="Temperature" value={latest?.temperature ?? "--"} unit="°C" color="blue" icon={Thermometer} detail="Core estimate" />
            <VitalCard label="Blood Pressure" value={latest ? `${latest.systolic_bp}/${latest.diastolic_bp}` : "--"} unit="mmHg" color="amber" icon={Gauge} detail="Non-invasive cuff" />
          </div>

          <EcgWave status={latest?.ecg_status ?? "waiting"} />

          <div className="grid gap-4 lg:grid-cols-2">
            <RealtimeChart title="Heart Rate" data={readings} domain={[45, 130]} series={[{ key: "heart_rate", name: "HR", color: "#39ff88" }]} />
            <RealtimeChart title="SpO2" data={readings} domain={[85, 100]} series={[{ key: "spo2", name: "SpO2", color: "#22d3ee" }]} />
            <RealtimeChart title="Temperature" data={readings} domain={[35, 40]} series={[{ key: "temperature", name: "Temp", color: "#60a5fa" }]} />
            <RealtimeChart
              title="Blood Pressure"
              data={readings}
              domain={[50, 160]}
              series={[
                { key: "systolic_bp", name: "Systolic", color: "#facc15" },
                { key: "diastolic_bp", name: "Diastolic", color: "#fb923c" },
              ]}
            />
            <RealtimeChart title="Respiratory Rate" data={readings} domain={[8, 32]} series={[{ key: "respiratory_rate", name: "RR", color: "#a78bfa" }]} />
            <section className="rounded-lg border border-slate-800 bg-slate-950/85 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Device Feed</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <VitalCard label="Respiration" value={latest?.respiratory_rate ?? "--"} unit="/min" color="blue" icon={Wind} detail="Thoracic band" />
                <VitalCard
                  label="Fall"
                  value={latest?.fall_detected ? "YES" : "NO"}
                  color={latest?.fall_detected ? "red" : "green"}
                  icon={PersonStanding}
                  detail={latest?.device_identifier ?? "No device packet yet"}
                />
              </div>
            </section>
          </div>
        </section>

        <aside className="space-y-4">
          <AlertPanel reading={latest} />
          <section className="rounded-lg border border-slate-800 bg-slate-950/85 p-4">
            <div className="flex items-center gap-2 text-monitor-green">
              <Activity size={18} />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Live Snapshot</h3>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <dt className="text-slate-500">Device</dt>
                <dd className="font-mono text-slate-200">{latest?.device_identifier ?? "--"}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <dt className="text-slate-500">ECG</dt>
                <dd className="font-mono uppercase text-slate-200">{latest?.ecg_status ?? "--"}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <dt className="text-slate-500">Recorded</dt>
                <dd className="font-mono text-slate-200">
                  {latest ? new Date(latest.recorded_at).toLocaleTimeString() : "--"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Trend Points</dt>
                <dd className="font-mono text-slate-200">{readings.length}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}
