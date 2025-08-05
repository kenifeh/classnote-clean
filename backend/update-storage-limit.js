const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'classnote.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Updating storage limits to 250MB...');

// Update all existing users to have 250MB storage limit
db.run(
  'UPDATE users SET storage_limit_bytes = 262144000 WHERE storage_limit_bytes < 262144000',
  function(err) {
    if (err) {
      console.error('❌ Error updating storage limits:', err.message);
    } else {
      console.log(`✅ Updated ${this.changes} users to 250MB storage limit`);
    }
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Storage limit update complete');
      }
    });
  }
); 