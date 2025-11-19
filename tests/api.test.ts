import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRouter from '../src/routes/health';
import blacklistRouter from '../src/routes/blacklist';

// Create test app instance
const createTestApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api/health', healthRouter);
  app.use('/api/blacklist', blacklistRouter);

  return app;
};

describe('API Server Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Health Endpoints', () => {
    test('GET /api/health should return basic health info', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });

    test('GET /api/health/detailed should return detailed health info', async () => {
      const response = await request(app).get('/api/health/detailed').expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Object),
        memory: expect.any(Object),
        system: expect.any(Object),
      });

      expect(response.body.memory).toHaveProperty('heapUsed');
      expect(response.body.memory).toHaveProperty('heapTotal');
      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('nodeVersion');
      expect(response.body.uptime).toHaveProperty('seconds');
      expect(response.body.uptime).toHaveProperty('human');
    });
  });

  describe('Blacklist Endpoints', () => {
    test('GET /api/blacklist should return all blacklisted entries', async () => {
      const response = await request(app).get('/api/blacklist').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        metadata: expect.any(Object),
      });

      expect(response.body.metadata).toHaveProperty('total');
      expect(response.body.metadata).toHaveProperty('categories');
      expect(response.body.metadata).toHaveProperty('lastUpdated');
    });

    test('GET /api/blacklist/check/:name should check if name is blacklisted', async () => {
      // Test with a known blacklisted name
      const blacklistedResponse = await request(app)
        .get('/api/blacklist/check/malicious_user')
        .expect(200);

      expect(blacklistedResponse.body).toMatchObject({
        success: true,
        name: 'malicious_user',
        isBlacklisted: true,
        entry: expect.any(Object),
        checkedAt: expect.any(String),
      });

      // Test with a non-blacklisted name
      const notBlacklistedResponse = await request(app)
        .get('/api/blacklist/check/clean_user')
        .expect(200);

      expect(notBlacklistedResponse.body).toMatchObject({
        success: true,
        name: 'clean_user',
        isBlacklisted: false,
        checkedAt: expect.any(String),
      });
    });

    test('GET /api/blacklist/check/:name should handle invalid names', async () => {
      const response = await request(app)
        .get('/api/blacklist/check/%20') // URL encoded space
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid name parameter',
      });
    });

    test('GET /api/blacklist/stats should return blacklist statistics', async () => {
      const response = await request(app).get('/api/blacklist/stats').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        stats: {
          total: expect.any(Number),
          categories: expect.any(Object),
          lastUpdated: expect.any(Number),
          retrievedAt: expect.any(String),
        },
      });
    });

    test('POST /api/blacklist should add new entry', async () => {
      const newEntry = {
        name: 'test_new_user',
        reason: 'Test entry for API testing',
        addedBy: 'test_suite',
        category: 'other',
      };

      const response = await request(app).post('/api/blacklist').send(newEntry).expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('added to blacklist'),
        entry: expect.objectContaining({
          name: 'test_new_user',
          reason: 'Test entry for API testing',
          addedBy: 'test_suite',
          category: 'other',
          addedAt: expect.any(String),
        }),
      });
    });

    test('POST /api/blacklist should handle duplicate entries', async () => {
      const duplicateEntry = {
        name: 'malicious_user', // This already exists in sample data
        reason: 'Duplicate test',
        addedBy: 'test_suite',
      };

      const response = await request(app).post('/api/blacklist').send(duplicateEntry).expect(409);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Entry already exists',
      });
    });

    test('POST /api/blacklist should handle invalid data', async () => {
      const invalidEntry = {
        reason: 'Missing name field',
      };

      const response = await request(app).post('/api/blacklist').send(invalidEntry).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid name',
      });
    });

    test('DELETE /api/blacklist/:name should remove existing entry', async () => {
      // First add an entry
      const newEntry = {
        name: 'test_delete_user',
        reason: 'To be deleted',
        addedBy: 'test_suite',
      };

      await request(app).post('/api/blacklist').send(newEntry).expect(201);

      // Then delete it
      const response = await request(app).delete('/api/blacklist/test_delete_user').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('removed from blacklist'),
        removedAt: expect.any(String),
      });
    });

    test('DELETE /api/blacklist/:name should handle non-existent entries', async () => {
      const response = await request(app).delete('/api/blacklist/non_existent_user').expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Entry not found',
      });
    });
  });

  describe('Error Handling', () => {
    test('Unknown endpoints should return 404', async () => {
      const response = await request(app).get('/api/unknown').expect(404);

      // Just verify it returns 404, the exact message format may vary
      expect(response.status).toBe(404);
    });
  });
});
