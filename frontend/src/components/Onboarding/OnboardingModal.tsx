import { useState } from 'react';
import type { FormEvent } from 'react';
import { validateAbout, validateEmail, validateName } from '../../utils/validators';

interface OnboardingModalProps {
  onComplete: (data: { name: string; email: string; about: string }) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; about?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!validateName(name)) nextErrors.name = 'Name must be at least 2 characters.';
    if (!validateEmail(email)) nextErrors.email = 'Enter a valid email address.';
    if (!validateAbout(about)) nextErrors.about = 'About must be 200 characters or fewer.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onComplete({ name, email, about });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900">Welcome to Funded Companies Agent</h1>
        <p className="mt-1 text-sm text-gray-500">👤 Tell us about yourself</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="jane@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              About You / Your Goals
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={200}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Senior Python engineer looking for AI/ML roles in Europe"
            />
            <p className="mt-1 text-right text-xs text-gray-400">{about.length}/200</p>
            {errors.about && <p className="mt-1 text-xs text-red-600">{errors.about}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Get Started →
          </button>
        </form>
      </div>
    </div>
  );
}
