const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'classnote.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  // User Management
  async createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email });
          }
        }
      );
    });
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  // Note Management
  async createNote(userId, noteData) {
    const { title, originalFilename, transcriptionText, summaryText, fileSize, categoryId } = noteData;
    
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO notes (user_id, category_id, title, original_filename, transcription_text, summary_text, file_size) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, categoryId, title, originalFilename, transcriptionText, summaryText, fileSize],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  async getNotesByUserId(userId, limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT n.*, c.name as category_name, c.color as category_color 
         FROM notes n 
         LEFT JOIN categories c ON n.category_id = c.id 
         WHERE n.user_id = ? 
         ORDER BY n.created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getNoteById(noteId, userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT n.*, c.name as category_name, c.color as category_color 
         FROM notes n 
         LEFT JOIN categories c ON n.category_id = c.id 
         WHERE n.id = ? AND n.user_id = ?`,
        [noteId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async updateNote(noteId, userId, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE notes SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
        [...values, noteId, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  async deleteNote(noteId, userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM notes WHERE id = ? AND user_id = ?',
        [noteId, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  async searchNotes(userId, searchTerm) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT n.*, c.name as category_name, c.color as category_color 
         FROM notes n 
         LEFT JOIN categories c ON n.category_id = c.id 
         WHERE n.user_id = ? AND (
           n.title LIKE ? OR 
           n.transcription_text LIKE ? OR 
           n.summary_text LIKE ?
         )
         ORDER BY n.created_at DESC`,
        [userId, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // Category Management
  async getCategoriesByUserId(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async createCategory(userId, name, color = '#007bff') {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)',
        [userId, name, color],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, color });
        }
      );
    });
  }

  // Statistics
  async getUserStats(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
           COUNT(*) as total_notes,
           SUM(file_size) as total_size,
           COUNT(DISTINCT category_id) as categories_used,
           MAX(created_at) as last_note_date
         FROM notes 
         WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Storage Management
  async getUserStorageInfo(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
           u.storage_limit_bytes,
           COALESCE(SUM(n.file_size), 0) as used_storage,
           u.storage_limit_bytes - COALESCE(SUM(n.file_size), 0) as remaining_storage
         FROM users u
         LEFT JOIN notes n ON u.id = n.user_id
         WHERE u.id = ?
         GROUP BY u.id, u.storage_limit_bytes`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async checkStorageLimit(userId, fileSize) {
    const storageInfo = await this.getUserStorageInfo(userId);
    if (!storageInfo) {
      throw new Error('User not found');
    }
    
    const { used_storage, remaining_storage } = storageInfo;
    const newTotalSize = used_storage + fileSize;
    
    return {
      canUpload: newTotalSize <= storageInfo.storage_limit_bytes,
      currentUsage: used_storage,
      newTotalSize,
      limit: storageInfo.storage_limit_bytes,
      remaining: remaining_storage
    };
  }

  async updateUserStorageLimit(userId, newLimitBytes) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET storage_limit_bytes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newLimitBytes, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database; 