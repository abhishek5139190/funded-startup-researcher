interface HiringScoreProps {
  percent: number;
}

function colorFor(percent: number) {
  if (percent >= 70) return { dot: '🟢', ring: 'stroke-emerald-500', text: 'text-emerald-600' };
  if (percent >= 45) return { dot: '🟡', ring: 'stroke-amber-500', text: 'text-amber-600' };
  return { dot: '🔴', ring: 'stroke-red-500', text: 'text-red-600' };
}

export function HiringScore({ percent }: HiringScoreProps) {
  const { dot, text } = colorFor(percent);
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${text}`}>
      {dot} Hiring Confidence: {percent}%
    </span>
  );
}
