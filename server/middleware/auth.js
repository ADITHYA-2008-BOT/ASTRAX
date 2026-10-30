import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Initialize Supabase admin client for server-side verification if credentials exist
let supabaseAuthClient = null;
if (config.supabase.isConfigured) {
  supabaseAuthClient = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey || config.supabase.anonKey
  );
}

// Fallback Sandbox identity for local testing when Supabase keys are not yet configured
const SANDBOX_PHYSICIST = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'chief.physicist@aeronull.org',
  role: 'authenticated',
  user_metadata: {
    full_name: 'Dr. Aurelius Vance (Sandbox Mode)',
    institution: 'AeroNull Quantum Propulsion Lab',
  },
};

/**
 * Strict Authentication Middleware
 * Validates Supabase JWT Bearer token from 'Authorization: Bearer <token>'
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for Bearer token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If Supabase is NOT configured and request has demo-mode or dev mode, allow sandbox testing
    if (!config.supabase.isConfigured) {
      req.user = SANDBOX_PHYSICIST;
      req.isSandboxAuth = true;
      return next();
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Missing or malformed Bearer token.',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  // 2. Handle Sandbox token in development / demo mode
  if (token === 'sandbox-guest-token' || (!config.supabase.isConfigured && token === 'demo-token')) {
    req.user = SANDBOX_PHYSICIST;
    req.isSandboxAuth = true;
    return next();
  }

  // 3. Verify against live Supabase Auth
  if (supabaseAuthClient) {
    try {
      const { data: { user }, error } = await supabaseAuthClient.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Cryptographic token verification failed or session expired.',
            details: error?.message,
          },
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role || 'authenticated',
        metadata: user.user_metadata,
      };
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_VERIFICATION_EXCEPTION',
          message: 'Error verifying authorization credentials with authentication provider.',
        },
      });
    }
  }

  // Fallback if neither applied
  req.user = SANDBOX_PHYSICIST;
  next();
};

/**
 * Optional Authentication Middleware
 * Attaches user identity if valid token is provided, otherwise leaves req.user null
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token === 'sandbox-guest-token' || token === 'demo-token') {
    req.user = SANDBOX_PHYSICIST;
    return next();
  }

  if (supabaseAuthClient) {
    try {
      const { data: { user } } = await supabaseAuthClient.auth.getUser(token);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    } catch {
      // Silently ignore for optional auth
      req.user = null;
    }
  }

  next();
};
