import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'vishal',
  password: process.env.DB_PASSWORD || process.env.dbpwd || '',
  database: process.env.DB_NAME || 'SchoolDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  ssl: {
    ca: fs.readFileSync('C:\\Users\\HP\\Downloads\\ca.pem', 'utf8'),
    rejectUnauthorized: false
  }
});

export default pool;


