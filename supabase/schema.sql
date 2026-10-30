-- ==============================================================================
-- AERO-NULL: Antigravity Physics Research Repository
-- PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- Target Platform: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop Existing Objects (Clean Re-initialization if needed)
-- DROP TABLE IF EXISTS public.theories CASCADE;

-- 3. Create the 'theories' Table
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,

    -- Constraints for data integrity
    CONSTRAINT title_length_check CHECK (char_length(title) >= 5 AND char_length(title) <= 255),
    CONSTRAINT abstract_length_check CHECK (char_length(abstract) >= 30),
    CONSTRAINT status_check CHECK (experimental_status IN (
        'Hypothesis',
        'Mathematical Model',
        'Lab Simulation',
        'Experimental Prototype',
        'Peer Reviewed'
    ))
);

-- 4. Automatic 'updated_at' Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_theories_updated_at ON public.theories;
CREATE TRIGGER set_theories_updated_at
    BEFORE UPDATE ON public.theories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Optimized Indexes for Query Performance & Tag Filtering
CREATE INDEX IF NOT EXISTS idx_theories_created_at ON public.theories (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_theories_user_id ON public.theories (user_id);
CREATE INDEX IF NOT EXISTS idx_theories_status ON public.theories (experimental_status);
CREATE INDEX IF NOT EXISTS idx_theories_framework ON public.theories (theoretical_framework);
CREATE INDEX IF NOT EXISTS idx_theories_tags ON public.theories USING GIN (tags);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Cyber-Defense Posture enforcing Least Privilege Access
-- ==============================================================================

-- Enable Row Level Security on the table
ALTER TABLE public.theories ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Read Access
-- Open access to peer researchers to discover and read physics models
DROP POLICY IF EXISTS "Theories are viewable by everyone" ON public.theories;
CREATE POLICY "Theories are viewable by everyone"
    ON public.theories
    FOR SELECT
    USING (true);

-- Policy 2: Authenticated Insert with Author Identity Lockdown
-- Users must be authenticated, and user_id MUST equal their Supabase Auth UID
DROP POLICY IF EXISTS "Authenticated users can submit theories" ON public.theories;
CREATE POLICY "Authenticated users can submit theories"
    ON public.theories
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy 3: Strict Author Modification (UPDATE)
-- Only the original author who created the record can modify it
DROP POLICY IF EXISTS "Authors can only update their own theories" ON public.theories;
CREATE POLICY "Authors can only update their own theories"
    ON public.theories
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy 4: Strict Author Deletion (DELETE)
-- Only the original author who created the record can delete it
DROP POLICY IF EXISTS "Authors can only delete their own theories" ON public.theories;
CREATE POLICY "Authors can only delete their own theories"
    ON public.theories
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id
    );

-- ==============================================================================
-- 7. Verified Sample Physics Data (Initial Seed)
-- ==============================================================================

-- Note: In production Supabase, seeds attach to actual auth.users.
-- For local or staging databases, uncomment with a valid user UUID:
/*
INSERT INTO public.theories (
    id,
    title,
    abstract,
    theoretical_framework,
    formula_latex,
    experimental_status,
    tags,
    citations,
    ai_summary,
    upvotes,
    user_id,
    author_email
) VALUES 
(
    'a1111111-2222-3333-4444-555555555555',
    'Quantum Vacuum Flux Pinning in High-Tc YBCO Superconductors',
    'Investigating anomalous inertial damping and gravitational gradient attenuation observed near rotating Type-II Yttrium Barium Copper Oxide (YBCO) ceramic disks at sub-77K temperatures. Through macroscopic London moment coherence and Josephson junction vortex dynamics, a local metric perturbation g_{00} is induced via non-equilibrium gravitomagnetic coupling.',
    'Gravito-Electromagnetism & Superconductivity',
    '\nabla \times \mathbf{B}_g = -\frac{4\pi G}{c^2} \mathbf{J}_m + \frac{1}{c^2}\frac{\partial \mathbf{E}_g}{\partial t}',
    'Experimental Prototype',
    ARRAY['superconductivity', 'meissner-effect', 'flux-pinning', 'gravito-electromagnetism'],
    ARRAY['Podkletnov (1992)', 'Ning Li (1993)', 'Modanese (1996)'],
    'Proposes that macroscopic quantum coherence in Type-II superconductors causes coupled vortex lattice rotations, generating a localized frame-dragging effect that attenuates gravitational acceleration by ~0.05% under RF excitation.',
    142,
    '00000000-0000-0000-0000-000000000001',
    'quantum.research@aeronull.org'
),
(
    'b2222222-3333-4444-5555-666666666666',
    'Dynamic Casimir Negative Energy Density & Alcubierre Spacetime Contraction',
    'A microscopic blueprint for generating exotic matter surrogates via high-frequency resonant optical cavities. By exploiting boundary condition oscillations at gigahertz frequencies, quantum vacuum fluctuations produce localized negative energy densities <T_00> < 0 compliant with Quantum Energy Inequalities (Ford-Roman bounds), enabling micro-scale spacetime expansion and contraction.',
    'Quantum Field Theory in Curved Spacetime',
    'ds^2 = -c^2 dt^2 + [dx - v_s(t)f(r_s)dt]^2 + dy^2 + dz^2',
    'Mathematical Model',
    ARRAY['alcubierre-metric', 'casimir-effect', 'negative-energy', 'warp-physics'],
    ARRAY['Alcubierre (1994)', 'White (2021)', 'Lentz (2020)'],
    'Demonstrates that gigahertz-driven dielectric metamaterial cavities can induce localized negative Casimir stress-energy tensors, dramatically lowering the theoretical mass-energy threshold for metric contraction.',
    289,
    '00000000-0000-0000-0000-000000000001',
    'warp.dynamics@aeronull.org'
);
*/
