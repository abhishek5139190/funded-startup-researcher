import type { Company } from '../../types';
import { HiringScore } from './HiringScore';
import { CacheIndicator } from './CacheIndicator';

interface CompanyCardProps {
  company: Company;
  onViewDetails: (id: string) => void;
  onSave: (id: string) => void;
  saved?: boolean;
  cached?: boolean;
  cachedAt?: string;
}

function formatAmount(amount: number, currency: string) {
  const millions = amount / 1_000_000;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  return `${symbol}${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export function CompanyCard({ company, onViewDetails, onSave, saved, cached, cachedAt }: CompanyCardProps) {
  const { latest_funding_round: funding, hiring_confidence: hiring } = company;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <img src={company.logo_url} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-100" loading="lazy" />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900">{company.name}</h3>
          <p className="truncate text-sm text-gray-500">{company.tagline}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p>
          📊 {formatAmount(funding.amount, funding.currency)} {funding.stage} · {formatDate(funding.date)}
        </p>
        <p>📍 {company.city}</p>
        <p>🎯 {company.industry.join(', ')}</p>
      </div>

      {company.recent_news[0] && (
        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
          <p className="font-medium text-gray-800">📰 {company.recent_news[0].title}</p>
          <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {company.recent_news[0].source}
          </span>
        </div>
      )}

      <div className="mt-3 space-y-1">
        <HiringScore percent={hiring.percent} />
        <ul className="ml-1 space-y-0.5 text-xs text-gray-500">
          {hiring.signals.positive.slice(0, 3).map((signal) => (
            <li key={signal}>├─ {signal}</li>
          ))}
        </ul>
      </div>

      {cached && <div className="mt-3"><CacheIndicator cachedAt={cachedAt} /></div>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onViewDetails(company.id)}
          className="min-h-[44px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          View Details
        </button>
        <button
          onClick={() => onSave(company.id)}
          className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            saved
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
