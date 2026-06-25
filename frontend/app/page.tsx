import Link from "next/link";
import { Activity, ArrowRight, Database, RadioTower } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#164e63_0,#030712_38%,#020617_100%)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-200">
            <Activity size={18} />
            Live ICU telemetry simulator
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">PulseWard Monitor</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A hospital-grade patient monitor dashboard for simulated vitals today and real IoT telemetry tomorrow.
          </p>
          <Link
            href="/patients"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-monitor-green px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Open Patients
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { icon: RadioTower, title: "Realtime", body: "WebSocket first with SSE fallback." },
            { icon: Database, title: "SQL Ready", body: "SQLAlchemy models for PostgreSQL deployments." },
            { icon: Activity, title: "ICU Display", body: "Live vitals, waveforms, trends, and alerts." },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
              <item.icon className="text-cyan-300" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
