import express from 'express';
import { supabaseService } from '../services/supabaseService.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import { createTheorySchema, queryTheorySchema } from '../schemas/theorySchema.js';

const router = express.Router();

/**
 * GET /api/theories
 * Retrieve paginated and filtered physics theories
 */
router.get('/', validate(queryTheorySchema, 'query'), async (req, res, next) => {
  try {
    const filters = req.validatedQuery || req.query;
    const result = await supabaseService.getTheories(filters);

    res.status(200).json({
      success: true,
      data: result.theories,
      meta: {
        total: result.total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        totalPages: Math.ceil(result.total / (filters.limit || 20)),
        isSandbox: result.isSandbox || false,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/theories/:id
 * Retrieve a single physics theory by UUID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const theory = await supabaseService.getTheoryById(id);

    if (!theory) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'THEORY_NOT_FOUND',
          message: `Theory with UUID '${id}' was not found in research repository.`,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: theory,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/theories
 * Submit a new physics theory (Requires Authentication & Zod Schema Validation)
 */
router.post(
  '/',
  submissionLimiter,
  requireAuth,
  validate(createTheorySchema, 'body'),
  async (req, res, next) => {
    try {
      const validatedPayload = req.body;
      const user = req.user;

      const createdTheory = await supabaseService.createTheory(validatedPayload, user);

      res.status(201).json({
        success: true,
        message: 'Research theory successfully verified, encrypted, and registered.',
        data: createdTheory,
        securityContext: {
          authenticatedUserId: user.id,
          rlsEnforced: true,
          mode: req.isSandboxAuth ? 'Sandbox Guest Identity' : 'Supabase Authenticated JWT',
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/theories/:id/upvote
 * Cast a peer review endorsement / upvote
 */
router.post('/:id/upvote', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await supabaseService.upvoteTheory(id);

    res.status(200).json({
      success: true,
      message: 'Peer endorsement registered.',
      data: { id: updated.id, upvotes: updated.upvotes },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
