import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Загружаем переменные окружения из .env файла
config();

// Параметры подключения к MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'cbby',
};

// Создаем пул соединений
const pool = mysql.createPool(dbConfig);

// Функция для выполнения SQL-запросов
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Получаем соединение из пула
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export default pool;
