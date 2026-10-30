import { config } from '../config/env.js';

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist on AeroNull API gateway.`,
    },
  });
};

/**
 * Centralized Cyber Defense Error Handler
 * Ensures no stack traces or sensitive internal paths leak to client
 */
export const errorHandler = (err, req, res, next) => {
  const isDev = config.nodeEnv === 'development';

  // Log error securely server-side
  console.error(`[AERONULL_SEC_ERROR] [${new Date().toISOString()}] ${req.method} ${req.url} ->`, err.message);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON payload structure received by the server.',
      },
    });
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS Security Alert')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_FORBIDDEN',
        message: err.message,
      },
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: statusCode === 500 && !isDev
        ? 'An internal security anomaly occurred. Our quantum telemetry team has been alerted.'
        : err.message || 'Unexpected server error.',
      ...(isDev && { stack: err.stack }),
    },
  });
};
