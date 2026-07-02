import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, '..', '..', 'data.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    tagline TEXT,
    website TEXT,
    description TEXT,
    funding_amount INTEGER,
    funding_date TEXT,
    stage TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    industry TEXT,
    team_size INTEGER,
    hiring_confidence INTEGER,
    hiring_reasoning TEXT,
    data_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id TEXT PRIMARY KEY,
    filters TEXT NOT NULL,
    results_count INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    is_saved INTEGER NOT NULL DEFAULT 0,
    saved_name TEXT
  );

  CREATE TABLE IF NOT EXISTS hiring_cache (
    company_id TEXT PRIMARY KEY,
    data_json TEXT NOT NULL,
    cached_at TEXT NOT NULL
  );
`);
