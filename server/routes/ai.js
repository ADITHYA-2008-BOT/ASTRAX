import express from 'express';
import { validate } from '../middleware/validate.js';
import { aiSummarizeLimiter } from '../middleware/rateLimiter.js';
import { summarizeTheorySchema } from '../schemas/theorySchema.js';
import { summarizePhysicsTheory } from '../services/geminiService.js';
import { supabaseService } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/theories/summarize
 * AI Analysis and Structured Summarization of Complex Physics Theories
 */
router.post(
  '/summarize',
  aiSummarizeLimiter,
  validate(summarizeTheorySchema, 'body'),
  async (req, res, next) => {
    try {
      let { theoryId, title, abstract, theoretical_framework, formula_latex } = req.body;

      // If theoryId is provided, enrich with stored theory data if missing fields
      if (theoryId && (!title || !abstract)) {
        const storedTheory = await supabaseService.getTheoryById(theoryId);
        if (storedTheory) {
          title = title || storedTheory.title;
          abstract = abstract || storedTheory.abstract;
          theoretical_framework = theoretical_framework || storedTheory.theoretical_framework;
          formula_latex = formula_latex || storedTheory.formula_latex;
        }
      }

      // Generate structured summary via Gemini Physics AI
      const aiResult = await summarizePhysicsTheory({
        title,
        abstract,
        theoretical_framework,
        formula_latex,
      });

      // If tied to an existing theory, persist the generated summary
      if (theoryId) {
        await supabaseService.updateAiSummary(theoryId, aiResult.summary);
      }

      res.status(200).json({
        success: true,
        data: {
          theoryId: theoryId || null,
          title,
          summary: aiResult.summary,
          provider: aiResult.provider,
          model: aiResult.model,
          isLiveAi: aiResult.isLiveAi,
          notice: aiResult.notice || null,
          generatedAt: aiResult.generatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
