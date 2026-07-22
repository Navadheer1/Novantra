import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config, validateEnv, isAllowedOrigin, allowedOrigins } from './utils/config';
import { prisma, connectDb, disconnectDb } from './utils/db';
import { errorHandler } from './middleware/errorHandler';

// Re-export prisma for route compatibility
export { prisma };

// Validate required environment variables on startup
validateEnv();

const app = express();
const httpServer = createServer(app);

// Configure Socket.IO with production CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[Socket.IO CORS Blocked] Origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Configure Express CORS middleware & OPTIONS preflight
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`[Express CORS Blocked] Origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Import all API routes
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
import discoveryRouter from './routes/discovery';
import marketplaceRouter from './routes/marketplace';

// Mount API routes
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
app.use('/api/discovery', discoveryRouter);
app.use('/api/marketplace', marketplaceRouter);

// Health check endpoints for production & frontend status pinging
const getHealthStatus = () => ({
  status: 'ok',
  environment: config.nodeEnv,
  uptime: Math.floor(process.uptime()),
  timestamp: new Date().toISOString(),
});

app.get('/health', (_req, res) => {
  res.status(200).json(getHealthStatus());
});

app.get('/api/health', (_req, res) => {
  res.status(200).json(getHealthStatus());
});

// Register Socket.IO handlers
import { registerMeetingHandlers } from './socket/meetingHandler';
import { registerMessageHandlers } from './socket/messageHandler';

io.on('connection', (socket) => {
  console.log(`[Socket.IO] User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] User disconnected: ${socket.id}`);
  });
});

registerMeetingHandlers(io);
registerMessageHandlers(io);

// Global Error Handler Middleware
app.use(errorHandler);

// Production Port Binding
const PORT = config.port;

// Start Server and connect Database
const startServer = async () => {
  await connectDb();

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`
==================================================
  🚀 Noventra Backend Engine Running
--------------------------------------------------
  Environment : ${config.nodeEnv}
  Port        : ${PORT}
  Database    : Connected via Prisma Client
  Socket.IO   : Ready for WebRTC Signaling
  Allowed     : ${allowedOrigins.join(', ')}
==================================================
`);
  });
};

startServer();

// Graceful Shutdown handling (SIGINT, SIGTERM)
let isShuttingDown = false;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[Shutdown] Received ${signal}. Starting graceful shutdown...`);

  try {
    io.close(() => {
      console.log('[Shutdown] Socket.IO server connections closed');
    });

    httpServer.close(async () => {
      console.log('[Shutdown] HTTP server closed');
      await disconnectDb();
      console.log('[Shutdown] Graceful shutdown complete. Exiting process.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('[Shutdown] Forcefully terminating process after timeout');
      process.exit(1);
    }, 10000);
  } catch (err) {
    console.error('[Shutdown] Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
