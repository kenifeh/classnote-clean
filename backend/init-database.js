const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Create database file in the backend directory
const dbPath = path.join(__dirname, 'classnote.db');
const db = new sqlite3.Database(dbPath);

console.log('🗄️ Initializing ClassNote AI Database...');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    storage_limit_bytes INTEGER DEFAULT 262144000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add storage_limit_bytes column to existing users table if it doesn't exist
  db.run(`ALTER TABLE users ADD COLUMN storage_limit_bytes INTEGER DEFAULT 262144000`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding storage_limit_bytes column:', err.message);
    }
  });

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#007bff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`);

  // Notes table
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    title TEXT NOT NULL,
    original_filename TEXT,
    transcription_text TEXT,
    summary_text TEXT,
    summary_tags TEXT,
    summary_word_count INTEGER,
    original_word_count INTEGER,
    file_size INTEGER,
    duration_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
  )`);

  // Add new columns to existing notes table if they don't exist
  db.run(`ALTER TABLE notes ADD COLUMN summary_tags TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding summary_tags column:', err.message);
    }
  });

  db.run(`ALTER TABLE notes ADD COLUMN summary_word_count INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding summary_word_count column:', err.message);
    }
  });

  db.run(`ALTER TABLE notes ADD COLUMN original_word_count INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding original_word_count column:', err.message);
    }
  });

  // Create indexes for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_notes_category_id ON notes(category_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)');

  // Insert default categories for new users
  db.run(`INSERT OR IGNORE INTO categories (id, name, color) VALUES 
    (1, 'General', '#007bff'),
    (2, 'Lectures', '#28a745'),
    (3, 'Meetings', '#ffc107'),
    (4, 'Presentations', '#dc3545'),
    (5, 'Study Notes', '#6f42c1')`, (err) => {
    if (err) {
      console.error('Error inserting default categories:', err.message);
    }
  });

  console.log('✅ Database tables created successfully');
});

// Close database connection
db.close((err) => {
  if (err) {
    console.error('❌ Error closing database:', err.message);
  } else {
    console.log('✅ Database initialization complete');
    console.log('📁 Database file created at:', dbPath);
  }
});