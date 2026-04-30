import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'vishal',
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'SchoolDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

export default pool;




