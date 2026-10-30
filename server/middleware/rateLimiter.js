import rateLimit from 'express-rate-limit';

/**
 * Standardized rate limit breach handler
 */
const rateLimitHandler = (message, retryAfterMinutes) => (req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message,
      retryAfterMinutes,
      timestamp: new Date().toISOString(),
      clientIp: req.ip,
    },
  });
};

/**
 * General API Rate Limiter
 * 120 requests per 15 minutes per IP
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    'Defense Shield Active: Too many requests from this IP. Please wait before retrying.',
    15
  ),
});

/**
 * Theory Submission Rate Limiter
 * 30 submissions per hour to prevent spamming the database
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    'Research Quarantine: Submission threshold reached for this IP. Maximum 30 theories per hour allowed.',
    60
  ),
});

/**
 * Gemini AI Summarization Rate Limiter
 * 15 AI summaries per 10 minutes to protect Google GenAI quota and prevent token exhaustion
 */
export const aiSummarizeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    'Quantum Neural Core Throttling: Gemini summarizer rate limit reached. Please wait 10 minutes before requesting further AI analyses.',
    10
  ),
});
