import { Router, Request, Response } from 'express';

const router = Router();

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  memory: {
    used: string;
    total: string;
    percentage: string;
  };
  pid: number;
}

router.get('/', (req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal;
  const usedMemory = memUsage.heapUsed;
  const memoryPercentage = ((usedMemory / totalMemory) * 100).toFixed(2);

  const healthData: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
      total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
      percentage: `${memoryPercentage}%`,
    },
    pid: process.pid,
  };

  res.status(200).json(healthData);
});

// Detailed health check
router.get('/detailed', (req: Request, res: Response) => {
  const memUsage = process.memoryUsage();

  const detailedHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: process.uptime(),
      human: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`,
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      ppid: process.ppid,
    },
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      percentage: `${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2)}%`,
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };

  res.status(200).json(detailedHealth);
});

export default router;
