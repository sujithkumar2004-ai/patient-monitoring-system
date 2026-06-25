export function EcgWave({ status = "normal" }: { status?: string }) {
  const stroke = status === "normal" ? "#39ff88" : status === "irregular" ? "#facc15" : "#fb3b52";

  return (
    <section className="monitor-grid h-44 overflow-hidden rounded-lg border border-monitor-green/25 bg-black p-3 shadow-glow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-monitor-green">ECG Waveform</h3>
        <span className="font-mono text-xs uppercase text-slate-400">{status}</span>
      </div>
      <svg viewBox="0 0 900 150" className="h-[120px] w-full" preserveAspectRatio="none">
        <polyline
          className="ecg-trace"
          points="0,86 45,86 56,82 65,90 76,86 130,86 145,85 154,35 164,118 176,86 230,86 245,83 254,91 266,86 325,86 340,86 350,44 360,112 372,86 430,86 445,82 455,90 466,86 530,86 545,85 555,28 566,123 578,86 635,86 650,83 660,91 672,86 735,86 750,85 760,42 771,114 783,86 840,86 855,82 865,90 900,86"
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </section>
  );
}
