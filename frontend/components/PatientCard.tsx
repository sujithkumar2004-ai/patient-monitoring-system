import Link from "next/link";
import { Activity, Bed, ChevronRight } from "lucide-react";

import type { Patient } from "@/types/patient";

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/80 p-5 shadow-cyan">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-cyan-300">
            <Bed size={16} />
            {patient.ward} · {patient.bed_number}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">{patient.name}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {patient.age} yrs · {patient.gender}
          </p>
        </div>
        <Activity className="text-monitor-green" />
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-300">{patient.diagnosis}</p>
      <Link
        href={`/monitor/${patient.id}`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Open Monitor
        <ChevronRight size={18} />
      </Link>
    </article>
  );
}
