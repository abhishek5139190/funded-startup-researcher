import type { Company, SearchFilters, SearchResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }
  return body.data as T;
}

export async function search(filters: SearchFilters): Promise<SearchResult> {
  return request<SearchResult>('/search', { method: 'POST', body: JSON.stringify(filters) });
}

export async function getCompanyById(id: string): Promise<Company> {
  return request<Company>(`/companies/${id}`);
}
