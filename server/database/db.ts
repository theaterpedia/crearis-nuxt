import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database path - in the packages/ui directory
const dbPath = join(__dirname, '../../demo-data.db')

// Initialize database
const db = new Database(dbPath)

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL')

// Create tables matching CSV structure
export function initDatabase() {
  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date_begin TEXT,
      date_end TEXT,
      address_id TEXT,
      user_id TEXT,
      seats_max INTEGER,
      cimg TEXT,
      header_type TEXT,
      rectitle TEXT,
      teaser TEXT
    )
  `)

  // Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      teaser TEXT,
      author_id TEXT,
      blog_id TEXT,
      tag_ids TEXT,
      website_published TEXT,
      is_published TEXT,
      post_date TEXT,
      cover_properties TEXT,
      event_id TEXT,
      cimg TEXT
    )
  `)

  // Locations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      city TEXT,
      zip TEXT,
      street TEXT,
      country_id TEXT,
      is_company TEXT,
      category_id TEXT,
      cimg TEXT,
      header_type TEXT,
      header_size TEXT,
      md TEXT,
      is_location_provider TEXT,
      event_id TEXT
    )
  `)

  // Instructors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS instructors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      city TEXT,
      country_id TEXT,
      cimg TEXT,
      description TEXT,
      event_id TEXT
    )
  `)

  // Participants table (combined children, teens, adults)
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      city TEXT,
      country_id TEXT,
      cimg TEXT,
      description TEXT,
      event_id TEXT,
      type TEXT
    )
  `)

  // Hero overrides table (for non-event heroes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_overrides (
      id TEXT PRIMARY KEY,
      cimg TEXT,
      heading TEXT,
      description TEXT,
      event_ids TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// Initialize on module load
initDatabase()

export default db
