import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PatientCard } from "@/components/PatientCard";
import { getPatients } from "@/lib/api";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ChevronLeft size={18} />
          Home
        </Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">ICU Patients</p>
            <h1 className="mt-2 text-4xl font-bold">Live Monitor Assignments</h1>
          </div>
          <p className="text-sm text-slate-400">{patients.length} active patients</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
    </main>
  );
}
