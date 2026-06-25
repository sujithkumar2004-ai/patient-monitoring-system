import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type VitalCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  color: "green" | "cyan" | "amber" | "red" | "blue";
  icon: LucideIcon;
  detail?: string;
};

const colorMap = {
  green: "text-monitor-green border-monitor-green/30 bg-monitor-green/5",
  cyan: "text-monitor-cyan border-monitor-cyan/30 bg-monitor-cyan/5",
  amber: "text-monitor-amber border-monitor-amber/30 bg-monitor-amber/5",
  red: "text-monitor-red border-monitor-red/30 bg-monitor-red/5",
  blue: "text-monitor-blue border-monitor-blue/30 bg-monitor-blue/5",
};

export function VitalCard({ label, value, unit, color, icon: Icon, detail }: VitalCardProps) {
  return (
    <section className={clsx("rounded-lg border p-4", colorMap[color])}>
      <div className="flex items-center justify-between gap-3 text-sm uppercase tracking-wide opacity-80">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-mono text-4xl font-bold leading-none md:text-5xl">{value}</span>
        {unit ? <span className="pb-1 text-sm font-semibold opacity-80">{unit}</span> : null}
      </div>
      {detail ? <p className="mt-2 truncate text-xs text-slate-400">{detail}</p> : null}
    </section>
  );
}
