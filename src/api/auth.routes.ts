// src/api/auth.routes.ts

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma-client';
import config from '../config';
import { validateRequest } from '../middleware/validation.middleware';
import { ApiError } from '../utils/errors';
import { AuthInput, AuthLoginResponse, AuthSchema } from '../utils/api-types';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

const router = Router();

// --- Routes ---


// POST /api/auth/register
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Username already exists
 */
router.post('/register', validateRequest(z.object({ body: AuthSchema })), async (req, res) => {
  const { username, password } : AuthInput  = req.body;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new ApiError(409, 'Tên người dùng đã tồn tại.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, passwordHash },
    select: { id: true, username: true, createdAt: true }, // Không trả về passwordHash
  });

  res.status(201).json(user);
});

// POST /api/auth/login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(z.object({ body: AuthSchema })), async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new ApiError(401, 'Tên người dùng hoặc mật khẩu không chính xác.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Tên người dùng hoặc mật khẩu không chính xác.');
  }

  const payload = { userId: user.id };

  const options: jwt.SignOptions = {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, config.jwt.secret, options);

  const responseData: AuthLoginResponse = {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  }

  res.status(200).json(responseData);
});

export const authRouter = router;