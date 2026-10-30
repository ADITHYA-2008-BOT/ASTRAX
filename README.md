# 🌌 AeroNull — Antigravity Physics & Spacetime Metric Engineering Repository

[![Full-Stack React + Node](https://img.shields.io/badge/Stack-React_18_%2B_Express_4-00f5ff?style=flat-square)](https://github.com)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL_with_RLS-3ecf8e?style=flat-square)](https://supabase.com)
[![Validation](https://img.shields.io/badge/Validation-Zod_Ultra--Strict-3068b7?style=flat-square)](https://zod.dev)
[![AI Engine](https://img.shields.io/badge/AI-Google_Gemini_Pro_%2F_Flash-a855f7?style=flat-square)](https://aistudio.google.com)
[![Security Armor](https://img.shields.io/badge/Cybersecurity-Helmet_%2B_CORS_%2B_Rate_Limiting-10b981?style=flat-square)](https://helmetjs.github.io)

**AeroNull** is a full-stack research platform dedicated to the physics of antigravity, macroscopic quantum coherence, superconducting flux pinning, and spacetime metric manipulation. It unites theoretical physicists, experimentalists, and quantum engineers to publish, analyze, and mathematically peer-review novel propulsion hypotheses.

---

## ⚡ Core Capabilities

1. **Interactive Levitation Laboratory**:
   - Real-time simulation of **Type-II Superconducting Flux Pinning** (YBCO at sub-77K) and **Type-I Meissner expulsion**.
   - Dynamic parameters: Cryogenic Temperature (Kelvin slider), Magnetic Induction Flux ($B$ Tesla), and material selection.
   - Calculates London Penetration Depth ($\lambda_L$), Meissner Repulsion Force (Newtons), Magnetic Pressure ($P_m$), and levitation altitude in real time.
2. **Research Repository Dashboard**:
   - Live querying of registered physics theories with keyword search, framework filters, status tags, and citation metrics.
   - High-fidelity physics seed dataset included (YBCO Flux Pinning, Alcubierre Spacetime Warping, Spin-Torsion ECSK tensors, Acoustic Radiation Levitation).
3. **Google Gemini AI Theory Summarizer**:
   - Automatically breaks down complex theoretical physics models into three structured sections:
     1. *Core Physical Mechanism*
     2. *Mathematical & Theoretical Feasibility*
     3. *Experimental Verification Roadmap*
   - Includes heuristic neural fallback for instant offline/sandbox evaluation.
4. **Interactive Theory Registration Console**:
   - Live Telemetry Preview updating in real-time as formulas and abstracts are keyed in.
   - 1-click Preset Templates (*Casimir Cavity*, *Gravito-Magnetic Induction*).
   - Real-time client & server **Zod Schema validation**.

---

## 🛡️ Cybersecurity Architecture & Hardening

AeroNull is engineered under a zero-trust cyber defense posture:

| Defense Layer | Implementation | Security Benefit |
| :--- | :--- | :--- |
| **HTTP Armor** | `helmet` | Enforces Content-Security-Policy (CSP), Strict-Transport-Security (HSTS, maxAge=1yr), X-Frame-Options: `DENY` (anti-clickjacking), and disables `X-Powered-By` fingerprinting. |
| **CORS Policy** | `cors` | Restricts API access exclusively to approved frontend origin (`CLIENT_URL`). Preflight caching enabled. |
| **DDoS & Flooding** | `express-rate-limit` | Tiered limiters: Global API limiter (120 req/15 min), Submission limiter (30 req/hr), and strict Gemini AI burst limiter (15 req/10 min). |
| **Payload Integrity** | `zod` | Validates all inbound JSON bodies and query parameters against rigorous schemas, disallowing control characters, null-bytes, and malicious HTML/JS tags to eliminate XSS and injection attacks. |
| **Data Isolation** | **Supabase PostgreSQL RLS** | Enforces Row-Level Security: public read access, authenticated-only insertion, and strict author modification lockdown (`auth.uid() = user_id`). |
| **Memory Safeguard** | `express.json({ limit: '500kb' })` | Rejects oversized payloads to prevent denial-of-service via memory exhaustion. |
| **Error Handling** | Sanitized Handler | Centralized error catcher returns sanitized JSON messages; never leaks internal stack traces or filesystem paths to client. |

---

## 📁 Repository Structure

```
ASTRA/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Futuristic HUD header with identity modal trigger
│   │   │   ├── HeroView.jsx        # Magnetic Levitation lab & Quantum Gravity overview
│   │   │   ├── DashboardView.jsx   # Live research dashboard with filters & search
│   │   │   ├── SubmissionView.jsx  # Interactive submission console with live preview
│   │   │   ├── TheoryCard.jsx      # Research paper card with AI summarizer trigger
│   │   │   ├── TheoryModal.jsx     # Detailed view with Gemini AI analysis drawer
│   │   │   ├── AuthModal.jsx       # Supabase auth modal + 1-Click Guest Pass
│   │   │   ├── ParticleCanvas.jsx  # Interactive HTML5 quantum flux visualizer
│   │   │   └── Toast.jsx           # Cyber HUD notification toasts
│   │   ├── lib/
│   │   │   ├── api.js              # Fetch client with token injection & error parsing
│   │   │   ├── supabase.js         # Supabase client with sandbox fallback
│   │   │   └── validation.js       # Client Zod schema mirror
│   │   ├── App.jsx                 # View state & auth orchestration
│   │   ├── index.css               # Glassmorphism, neon glows, cyber scrollbars
│   │   └── main.jsx
│   ├── tailwind.config.js          # Custom futuristic color tokens & animations
│   ├── vite.config.js              # Reverse proxy to backend API (/api -> localhost:5000)
│   └── package.json
│
├── server/                     # Backend (Node.js + Express + Zod + Helmet)
│   ├── config/
│   │   └── env.js                  # Environment configuration & telemetry banner
│   ├── middleware/
│   │   ├── auth.js                 # Supabase JWT token verification
│   │   ├── rateLimiter.js          # Express rate limiters (Global, Submission, AI)
│   │   ├── security.js             # Helmet CSP, CORS, payload sanitizer
│   │   ├── validate.js             # Zod validation middleware factory
│   │   └── errorHandler.js         # Centralized sanitized error handler
│   ├── routes/
│   │   ├── theories.js             # GET /api/theories, POST /api/theories, upvote
│   │   ├── ai.js                   # POST /api/theories/summarize (Gemini API)
│   │   └── health.js               # GET /api/health (Security & memory status)
│   ├── schemas/
│   │   └── theorySchema.js         # Zod schemas for theories and AI queries
│   ├── services/
│   │   ├── geminiService.js        # Google Gemini AI physics summarizer
│   │   └── supabaseService.js      # Supabase client & in-memory physics seed
│   ├── server.js                   # Express server entry point
│   └── package.json
│
├── supabase/
│   └── schema.sql                  # PostgreSQL table DDL, triggers, and explicit RLS policies
│
├── .replit                         # Replit cloud workspace deployment configuration
├── replit.nix                      # Replit Nix environment packages
├── .env.example                    # Sample environment configuration
├── package.json                    # Root package.json with unified concurrent startup
└── README.md                       # Complete documentation
```

---

## 🗄️ Database & Row Level Security (RLS)

The complete SQL schema is located in `supabase/schema.sql`.

### Core Table Definition
```sql
CREATE TABLE IF NOT EXISTS public.theories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    theoretical_framework VARCHAR(120) NOT NULL,
    formula_latex TEXT,
    experimental_status VARCHAR(60) NOT NULL DEFAULT 'Hypothesis',
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    citations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    ai_summary TEXT,
    upvotes INTEGER NOT NULL DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
```

### Row Level Security Policies
```sql
ALTER TABLE public.theories ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view published research
CREATE POLICY "Theories are viewable by everyone"
    ON public.theories FOR SELECT USING (true);

-- 2. Authenticated users only can insert; user_id must match auth.uid()
CREATE POLICY "Authenticated users can submit theories"
    ON public.theories FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. Only the original author can update their theory
CREATE POLICY "Authors can only update their own theories"
    ON public.theories FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Only the original author can delete their theory
CREATE POLICY "Authors can only delete their own theories"
    ON public.theories FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
Run the unified installer from the project root:
```bash
npm run install:all
```
*(Or install in each directory: `npm install` in root, `cd server && npm install`, `cd client && npm install --legacy-peer-deps`)*

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: If you leave the keys empty, AeroNull automatically runs in Sandbox Mode with rich physics seed data and heuristic AI synthesis, making it 100% testable immediately!)*

### 4. Launch Concurrently
Run both the Vite frontend and Node backend in one command:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Gateway**: `http://localhost:5000`
- **Health Telemetry**: `http://localhost:5000/api/health`

---

## 🛰️ REST API Reference

### `GET /api/health`
Returns security shield status, system uptime, memory usage, and integration diagnostics.

### `GET /api/theories`
Query parameters:
- `search` *(string)*: Searches title and abstract.
- `status` *(string)*: Filters by status (`Hypothesis`, `Mathematical Model`, `Lab Simulation`, `Experimental Prototype`, `Peer Reviewed`).
- `framework` *(string)*: Filters by theoretical framework.
- `tag` *(string)*: Filters by physics classification tag.

### `POST /api/theories`
Requires `Authorization: Bearer <token>` and a valid JSON payload:
```json
{
  "title": "Superconducting Cooper-Pair Inertial Attenuation",
  "abstract": "Investigating localized metric perturbation through macroscopic phase coherence in rotating Type-II YBCO disks...",
  "theoretical_framework": "Superconducting Flux Pinning & Meissner Effect",
  "formula_latex": "\\nabla \\times \\mathbf{B}_g = -\\frac{4\\pi G}{c^2} \\mathbf{J}_m",
  "experimental_status": "Experimental Prototype",
  "tags": ["superconductivity", "meissner-effect", "flux-pinning"],
  "citations": ["Podkletnov (1992)", "Ning Li (1993)"]
}
```

### `POST /api/theories/summarize`
Calls Google Gemini AI to generate a 3-section physics breakdown:
```json
{
  "theoryId": "a1111111-2222-3333-4444-555555555555"
}
```

---

## ☁️ Cloud Workspace Deployment (Replit)

The repository includes pre-configured `.replit` and `replit.nix` files:
1. Import or push the repository to Replit.
2. Replit will automatically read `replit.nix` to provision Node.js 20 and npm.
3. Click **Run**; Replit will execute `npm run dev`, opening the frontend on port 5173 and backend on port 5000.

---

## 🔬 License
MIT License. Built for the advancement of open theoretical physics and quantum metric engineering.
