import dotenv from 'dotenv';
import path from 'path';

// Tải file .env từ thư mục gốc của project
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string | number,
  },
  databaseUrl: process.env.DATABASE_URL as string,
  geminiApiKey: process.env.GEMINI_API_KEY as string,
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  node_env: process.env.NODE_ENV || 'development',
};

// Kiểm tra các biến môi trường quan trọng
if (!config.jwt.secret || !config.databaseUrl || !config.geminiApiKey) {
  console.error('FATAL ERROR: Missing required environment variables.');
  process.exit(1);
}

export default config;