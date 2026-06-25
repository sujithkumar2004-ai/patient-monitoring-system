"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TelemetryReading } from "@/types/telemetry";

type Series = {
  key: keyof TelemetryReading;
  color: string;
  name: string;
};

export function RealtimeChart({
  title,
  data,
  series,
  domain,
}: {
  title: string;
  data: TelemetryReading[];
  series: Series[];
  domain?: [number, number];
}) {
  const chartData = data.map((item) => ({
    ...item,
    time: new Date(item.recorded_at).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
  }));

  return (
    <section className="h-52 rounded-lg border border-slate-800 bg-slate-950/85 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
        <span className="font-mono text-xs text-slate-500">{data.length}/60</span>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis domain={domain ?? ["auto", "auto"]} width={32} tick={{ fill: "#64748b", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 6 }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          {series.map((line) => (
            <Line
              key={String(line.key)}
              dataKey={line.key}
              name={line.name}
              dot={false}
              stroke={line.color}
              strokeWidth={2}
              type="monotone"
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
