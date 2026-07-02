import type { Company } from '../../types';
import { HiringScore } from '../CompanyFeed/HiringScore';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
}

export function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  if (!company) return null;
  const { latest_funding_round: funding, hiring_confidence: hiring } = company;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={company.logo_url} alt="" className="h-14 w-14 rounded-xl bg-gray-100" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-500">{company.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600">{company.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">Funding</p>
            <p className="font-medium text-gray-800">
              {funding.currency === 'USD' ? '$' : funding.currency} {(funding.amount / 1_000_000).toFixed(1)}M ·{' '}
              {funding.stage}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Location</p>
            <p className="font-medium text-gray-800">{company.city}</p>
          </div>
          <div>
            <p className="text-gray-400">Investors</p>
            <p className="font-medium text-gray-800">{funding.investors.join(', ') || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400">Team Size</p>
            <p className="font-medium text-gray-800">{company.team_size}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <HiringScore percent={hiring.percent} />
          <p className="mt-2 text-sm text-gray-600">{hiring.reasoning}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hiring.signals.positive.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-600">Positive signals</p>
                <ul className="mt-1 space-y-1 text-sm text-gray-600">
                  {hiring.signals.positive.map((s) => (
                    <li key={s}>✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}
            {hiring.signals.negative.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-red-600">Concerns</p>
                <ul className="mt-1 space-y-1 text-sm text-gray-600">
                  {hiring.signals.negative.map((s) => (
                    <li key={s}>✗ {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {company.job_postings.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-800">Open Roles</p>
            <ul className="mt-2 space-y-2">
              {company.job_postings.map((job) => (
                <li key={job.title} className="flex items-center justify-between text-sm text-gray-600">
                  <span>{job.title}</span>
                  <span className="text-xs text-gray-400">{job.platform}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-800">Recent News</p>
          <ul className="mt-2 space-y-2">
            {company.recent_news.map((news) => (
              <li key={news.title} className="rounded-lg border border-gray-100 p-3 text-sm">
                <a href={news.url} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">
                  {news.title}
                </a>
                <p className="mt-1 text-gray-500">{news.snippet}</p>
                <p className="mt-1 text-xs text-gray-400">via {news.source}</p>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
}
