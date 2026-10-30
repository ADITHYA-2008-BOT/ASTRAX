import express from 'express';
import { config, logSecurityStatus } from './config/env.js';
import { helmetMiddleware, corsMiddleware, sanitizeRequestMiddleware } from './middleware/security.js';
import { generalApiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.js';
import theoriesRoutes from './routes/theories.js';
import aiRoutes from './routes/ai.js';

const app = express();

// 1. Trust proxy for accurate client IP resolution behind reverse proxies (Cloudflare, Replit, Nginx)
app.set('trust proxy', 1);

// 2. Cyber Defense HTTP Headers via Helmet
app.use(helmetMiddleware);

// 3. Strict CORS configuration
app.use(corsMiddleware);

// 4. Rate Limiting to prevent brute-force and DDoS flooding
app.use(generalApiLimiter);

// 5. Body Parsers with Strict Memory Bomb Safeguards (Max 500kb per payload)
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// 6. Request Sanitization (strips null-bytes and hostile control sequences)
app.use(sanitizeRequestMiddleware);

// 7. Core RESTful API Routes
app.use('/api/health', healthRoutes);
app.use('/api/theories', theoriesRoutes);
app.use('/api/theories', aiRoutes); // Mounts /api/theories/summarize

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    application: 'AeroNull Antigravity Research API Gateway',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'ONLINE',
  });
});

// 8. 404 Handler for undefined routes
app.use(notFoundHandler);

// 9. Centralized Error Handler (Zero stack leaks)
app.use(errorHandler);

// 10. Boot server
const server = app.listen(config.port, () => {
  logSecurityStatus();
  console.log(`[AERONULL_GATEWAY] Server active on port ${config.port} | Mode: ${config.nodeEnv}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[AERONULL_GATEWAY] SIGTERM received. Initiating graceful shutdown...');
  server.close(() => {
    console.log('[AERONULL_GATEWAY] Process terminated cleanly.');
  });
});

export default app;
