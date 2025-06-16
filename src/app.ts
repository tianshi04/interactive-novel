import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

import { authRouter } from './api/auth.routes';
import { sessionsRouter } from './api/sessions.routes';
import { optionsRouter } from './api/options.routes';
import { ApiError } from './utils/errors';

const app = express();

app.use(cors());
app.use(express.json());

// --- Swagger Docs Endpoint ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/options', optionsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Web Novel API!');
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log lỗi ra console để debug

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Xử lý các lỗi khác từ Prisma (ví dụ: không tìm thấy record)
  // if (err instanceof Prisma.PrismaClientKnownRequestError) { ... }

  return res.status(500).json({ message: 'Đã có lỗi xảy ra ở phía server.' });
});

export default app;