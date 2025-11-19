import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import blacklistRouter from './routes/blacklist';
import healthRouter from './routes/health';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/health', healthRouter);
app.use('/api/blacklist', blacklistRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Playwright E2E Mock API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      healthDetailed: '/api/health/detailed',
      blacklist: '/api/blacklist',
      blacklistCheck: '/api/blacklist/check/:name',
      blacklistStats: '/api/blacklist/stats',
    },
    documentation: 'https://github.com/yuzhangoscar/playwright-e2e-fpmarket-demo',
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/health/detailed',
      '/api/blacklist',
      '/api/blacklist/check/:name',
      '/api/blacklist/stats',
    ],
  });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Blacklist API: http://localhost:${PORT}/api/blacklist`);
  console.log(`🔍 Check name: http://localhost:${PORT}/api/blacklist/check/{name}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
