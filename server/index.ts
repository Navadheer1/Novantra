import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

dotenv.config();

// Validate Environment Variables
const requiredEnvs = [
  'DATABASE_URL',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLOUDINARY_URL',
  'GROQ_API_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`[FATAL] Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return false;
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

export const prisma = new PrismaClient();

import usersRouter from './routes/users';
import startupsRouter from './routes/startups';
import requestsRouter from './routes/requests';
import meetingsRouter from './routes/meetings';
import uploadRouter from './routes/upload';
import aiRouter from './routes/ai';
import postsRouter from './routes/posts';
import messagesRouter from './routes/messages';
import searchRouter from './routes/search';
import exploreRouter from './routes/explore';

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/startups', startupsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/ai', aiRouter);
app.use('/api/posts', postsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/search', searchRouter);
app.use('/api/explore', exploreRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

import { registerMeetingHandlers } from './socket/meetingHandler';

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // TODO: Add specific socket event listeners for notifications
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

registerMeetingHandlers(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} (0.0.0.0)`);
});
