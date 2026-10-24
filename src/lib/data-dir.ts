import path from 'node:path'

// Everything the reader keeps on disk lives under one folder: the SQLite file
// (reader-db) and the downloaded book PDFs (book-file). In the image it is the
// named volume, so both survive a rebuild.
// DATA_DIR is /app/reader-data (the named volume) in the image; locally it falls
// back to ./data-local, which is gitignored.
export function getDataDir(): string {
  const configured = process.env.DATA_DIR?.trim()
  return configured ? configured : path.join(process.cwd(), 'data-local')
}
