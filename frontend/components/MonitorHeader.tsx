import { Activity, Radio } from "lucide-react";
import clsx from "clsx";

import type { Patient } from "@/types/patient";
import type { ConnectionStatus } from "@/types/telemetry";

export function MonitorHeader({
  patient,
  status,
}: {
  patient: Patient | null;
  status: ConnectionStatus;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-monitor-green/40 bg-monitor-green/10 text-monitor-green">
          <Activity />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PulseWard ICU Monitor</p>
          <h1 className="text-xl font-semibold text-white">
            {patient ? `${patient.name} · ${patient.ward} ${patient.bed_number}` : "Loading patient"}
          </h1>
        </div>
      </div>
      <div
        className={clsx(
          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
          status === "connected" && "border-monitor-green/40 bg-monitor-green/10 text-monitor-green",
          status === "reconnecting" && "border-monitor-amber/40 bg-monitor-amber/10 text-monitor-amber",
          status === "connecting" && "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
          status === "offline" && "border-monitor-red/40 bg-monitor-red/10 text-monitor-red",
        )}
      >
        <Radio size={16} />
        {status === "connected" ? "Connected" : status === "offline" ? "Offline" : status === "connecting" ? "Connecting" : "Reconnecting"}
      </div>
    </header>
  );
}
