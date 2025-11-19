import { Router, Request, Response } from 'express';
import { BlacklistStore } from '../data/blacklistStore';

const router = Router();
const blacklistStore = BlacklistStore.getInstance();

/**
 * @swagger
 * components:
 *   schemas:
 *     BlacklistEntry:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The blacklisted name
 *         reason:
 *           type: string
 *           description: Reason for blacklisting
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: When the entry was added
 *         addedBy:
 *           type: string
 *           description: Who added the entry
 *         category:
 *           type: string
 *           enum: [security, compliance, policy, other]
 *           description: Category of the blacklist entry
 */

/**
 * @swagger
 * /api/blacklist:
 *   get:
 *     summary: Get all blacklisted entries
 *     tags: [Blacklist]
 *     responses:
 *       200:
 *         description: List of all blacklisted entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlacklistEntry'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     categories:
 *                       type: object
 *                     lastUpdated:
 *                       type: number
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const blacklistedEntries = blacklistStore.getAllBlacklisted();
    const stats = blacklistStore.getBlacklistStats();

    res.json({
      success: true,
      data: blacklistedEntries,
      metadata: {
        total: stats.total,
        categories: stats.categories,
        lastUpdated: stats.lastUpdated,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve blacklist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/blacklist/check/{name}:
 *   get:
 *     summary: Check if a specific name is blacklisted
 *     tags: [Blacklist]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name to check against blacklist
 *     responses:
 *       200:
 *         description: Blacklist check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 name:
 *                   type: string
 *                 isBlacklisted:
 *                   type: boolean
 *                 entry:
 *                   $ref: '#/components/schemas/BlacklistEntry'
 *                 checkedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid name parameter
 */
router.get('/check/:name', (req: Request, res: Response): void => {
  try {
    const { name } = req.params;

    // Validate name parameter
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid name parameter',
        message: 'Name must be a non-empty string',
      });
      return;
    }

    const trimmedName = name.trim();
    const isBlacklisted = blacklistStore.isBlacklisted(trimmedName);
    const entry = isBlacklisted ? blacklistStore.getBlacklistEntry(trimmedName) : null;

    res.json({
      success: true,
      name: trimmedName,
      isBlacklisted,
      ...(entry && { entry }),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check blacklist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/blacklist/stats:
 *   get:
 *     summary: Get blacklist statistics
 *     tags: [Blacklist]
 *     responses:
 *       200:
 *         description: Blacklist statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     categories:
 *                       type: object
 *                     lastUpdated:
 *                       type: number
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = blacklistStore.getBlacklistStats();

    res.json({
      success: true,
      stats: {
        ...stats,
        retrievedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve blacklist statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/blacklist:
 *   post:
 *     summary: Add a new entry to the blacklist
 *     tags: [Blacklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               reason:
 *                 type: string
 *               addedBy:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [security, compliance, policy, other]
 *     responses:
 *       201:
 *         description: Entry added successfully
 *       400:
 *         description: Invalid request data
 *       409:
 *         description: Entry already exists
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, reason, addedBy, category } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid name',
        message: 'Name is required and must be a non-empty string',
      });
      return;
    }

    const trimmedName = name.trim();

    // Check if entry already exists
    if (blacklistStore.isBlacklisted(trimmedName)) {
      res.status(409).json({
        success: false,
        error: 'Entry already exists',
        message: `Name '${trimmedName}' is already blacklisted`,
      });
      return;
    }

    // Add to blacklist
    const newEntry = blacklistStore.addToBlacklist({
      name: trimmedName,
      reason: reason || 'No reason provided',
      addedBy: addedBy || 'api',
      category: category || 'other',
    });

    res.status(201).json({
      success: true,
      message: 'Entry added to blacklist successfully',
      entry: newEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add entry to blacklist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/blacklist/{name}:
 *   delete:
 *     summary: Remove an entry from the blacklist
 *     tags: [Blacklist]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name to remove from blacklist
 *     responses:
 *       200:
 *         description: Entry removed successfully
 *       404:
 *         description: Entry not found
 *       400:
 *         description: Invalid name parameter
 */
router.delete('/:name', (req: Request, res: Response): void => {
  try {
    const { name } = req.params;

    // Validate name parameter
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid name parameter',
        message: 'Name must be a non-empty string',
      });
      return;
    }

    const trimmedName = name.trim();

    // Check if entry exists before trying to remove
    if (!blacklistStore.isBlacklisted(trimmedName)) {
      res.status(404).json({
        success: false,
        error: 'Entry not found',
        message: `Name '${trimmedName}' is not in the blacklist`,
      });
      return;
    }

    // Remove from blacklist
    const removed = blacklistStore.removeFromBlacklist(trimmedName);

    if (removed) {
      res.json({
        success: true,
        message: `Entry '${trimmedName}' removed from blacklist successfully`,
        removedAt: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to remove entry',
        message: 'Unexpected error occurred during removal',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to remove entry from blacklist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
