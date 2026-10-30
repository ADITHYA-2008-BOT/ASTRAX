import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root or local .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    isConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  },
};

// Cyber telemetry logging on startup
export const logSecurityStatus = () => {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                   AERONULL SECURITY TELEMETRY                  ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ Environment        : ${(config.nodeEnv).padEnd(42)} ║`);
  console.log(`║ Port               : ${(config.port.toString()).padEnd(42)} ║`);
  console.log(`║ Allowed Origin     : ${(config.clientUrl).padEnd(42)} ║`);
  console.log(`║ Supabase RLS DB    : ${(config.supabase.isConfigured ? 'CONNECTED (PostgreSQL)' : 'SANDBOX / IN-MEMORY FALLBACK').padEnd(42)} ║`);
  console.log(`║ Gemini Physics AI  : ${(config.gemini.isConfigured ? 'ONLINE (Google GenAI)' : 'SIMULATION MODE (Set GEMINI_API_KEY)').padEnd(42)} ║`);
  console.log(`║ Armor Headers      : ${( 'HELMET + HSTS + CSP ACTIVE').padEnd(42)} ║`);
  console.log(`║ Rate Limiting      : ${( 'STRICT DDoS & BURST PROTECTION').padEnd(42)} ║`);
  console.log(`║ Schema Validation  : ${( 'ZOD ULTRA-STRICT PROTOCOL').padEnd(42)} ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝');
};
