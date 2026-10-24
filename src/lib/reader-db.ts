import { mkdirSync } from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

// The reader's SQLite file. Opened lazily on the first query (never at module
// load) so `pnpm build` runs without a data dir. The schema below is applied
// idempotently on that first open. Only the data modules (reading-position,
// later highlights) import this; nothing else writes SQL.

const LOG_PREFIX = '[reader-db]'
const DB_FILE = 'leitor.db'

// Each entry upgrades the schema by one version (PRAGMA user_version). Append
// new steps; never edit a released one.
const MIGRATIONS: readonly string[] = [
  `
  CREATE TABLE IF NOT EXISTS reading_positions (
    owner TEXT NOT NULL,
    book_id TEXT NOT NULL,
    current_page INTEGER,
    total_pages INTEGER,
    updated_at TEXT,
    PRIMARY KEY (owner, book_id)
  );
  CREATE TABLE IF NOT EXISTS highlights (
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    book_id TEXT NOT NULL,
    page INTEGER NOT NULL,
    color TEXT NOT NULL,
    text TEXT NOT NULL,
    note TEXT,
    rects TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS highlights_owner_book_page
    ON highlights (owner, book_id, page);
  `,
]

let connection: Database.Database | undefined

// DATA_DIR is /app/reader-data (the named volume) in the image; locally it falls
// back to ./data-local, which is gitignored.
export function getDataDir(): string {
  const configured = process.env.DATA_DIR?.trim()
  return configured ? configured : path.join(process.cwd(), 'data-local')
}

function migrate(db: Database.Database) {
  const current = db.pragma('user_version', { simple: true }) as number
  if (current >= MIGRATIONS.length) {
    return
  }
  db.transaction(() => {
    for (const [index, sql] of MIGRATIONS.entries()) {
      if (index >= current) {
        db.exec(sql)
      }
    }
    db.pragma(`user_version = ${MIGRATIONS.length}`)
  })()
}

function open(): Database.Database {
  const dir = getDataDir()
  mkdirSync(dir, { recursive: true })
  const db = new Database(path.join(dir, DB_FILE))
  // Default rollback journal (no -wal/-shm files): one writer, and a plain
  // copy of leitor.db is a complete backup.
  db.pragma('journal_mode = DELETE')
  db.pragma('busy_timeout = 5000')
  migrate(db)
  return db
}

export function getDb(): Database.Database {
  connection ??= open()
  return connection
}

export function logReaderDbFailure(operation: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error)
  console.warn(
    `${LOG_PREFIX} ${new Date().toISOString()} operacao=${operation} erro=${detail}`
  )
}
