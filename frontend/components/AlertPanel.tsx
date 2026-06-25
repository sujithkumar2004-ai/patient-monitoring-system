import { AlertTriangle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

import type { TelemetryReading } from "@/types/telemetry";

export function AlertPanel({ reading }: { reading: TelemetryReading | null }) {
  const level = reading?.alert_level ?? "normal";
  const messages = reading?.alert_messages?.length ? reading.alert_messages : ["Waiting for live vitals"];

  return (
    <section
      className={clsx(
        "rounded-lg border p-4",
        level === "critical" && "border-monitor-red/50 bg-monitor-red/10",
        level === "warning" && "border-monitor-amber/50 bg-monitor-amber/10",
        level === "normal" && "border-monitor-green/30 bg-monitor-green/5",
      )}
    >
      <div className="flex items-center gap-2">
        {level === "normal" ? <CheckCircle2 className="text-monitor-green" /> : <AlertTriangle className={level === "critical" ? "text-monitor-red" : "text-monitor-amber"} />}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Alerts</h3>
      </div>
      <div className="mt-4 space-y-2">
        {messages.map((message) => (
          <div key={message} className="rounded-md border border-slate-800 bg-black/40 px-3 py-2 text-sm text-slate-200">
            {message}
          </div>
        ))}
      </div>
    </section>
  );
}
