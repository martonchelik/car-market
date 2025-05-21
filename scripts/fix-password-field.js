// Script to fix password field in database
// Run with: node scripts/fix-password-field.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('Starting database field repair...');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'cbby'
  });

  try {
    console.log('Successfully connected to MySQL database');

    // Check current field type
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM users WHERE Field = 'password'
    `);

    if (columns.length > 0) {
      console.log('Current password field type:', columns[0].Type);

      // If field exists but is too short
      if (columns[0].Type.includes('varchar') && !columns[0].Type.includes('varchar(255)')) {
        console.log('Password field needs to be altered to support longer hashes');

        // Alter the field
        await connection.execute(`
          ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL
        `);

        console.log('Password field has been updated to VARCHAR(255)');
      } else if (columns[0].Type.includes('varchar(255)')) {
        console.log('Password field is already correctly set up (VARCHAR(255))');
      } else {
        console.log('Password field exists but has an unexpected type:', columns[0].Type);
      }
    } else {
      console.error('Password field not found in users table');
    }

    console.log('Repair operation completed successfully');
  } catch (error) {
    console.error('Error during repair operation:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
