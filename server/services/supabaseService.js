import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Initialize Supabase Client
let supabase = null;
if (config.supabase.isConfigured) {
  supabase = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey || config.supabase.anonKey
  );
}

/**
 * Rich Initial Physics Seed Dataset
 * Used when Supabase DB is in sandbox mode or for offline demonstration
 */
let inMemoryTheories = [
  {
    id: 'a1111111-2222-3333-4444-555555555555',
    title: 'Quantum Vacuum Flux Pinning in High-Tc YBCO Superconductors',
    abstract: 'Investigating anomalous inertial damping and gravitational gradient attenuation observed near rotating Type-II Yttrium Barium Copper Oxide (YBCO) ceramic disks at sub-77K temperatures. Through macroscopic London moment coherence and Josephson junction vortex dynamics, a local metric perturbation g_{00} is induced via non-equilibrium gravitomagnetic coupling under pulsed high-frequency magnetic induction.',
    theoretical_framework: 'Superconducting Flux Pinning & Meissner Effect',
    formula_latex: '\\nabla \\times \\mathbf{B}_g = -\\frac{4\\pi G}{c^2} \\mathbf{J}_m + \\frac{1}{c^2}\\frac{\\partial \\mathbf{E}_g}{\\partial t}',
    experimental_status: 'Experimental Prototype',
    tags: ['superconductivity', 'meissner-effect', 'flux-pinning', 'gravito-electromagnetism'],
    citations: ['Podkletnov, E. (1992)', 'Li, N. & Torr, D. (1993)', 'Modanese, G. (1996)'],
    ai_summary: '### 1. Core Physical Mechanism\nMacroscopic phase coherence in Cooper pairs creates rotating vortex lattices that drag frame structures via the gravito-magnetic Maxwell-Heaviside tensor.\n\n### 2. Mathematical Feasibility\nRequires extreme Cooper pair density gradient exceeding 10^{28} m^{-3} to achieve measurable delta-g (~0.05% attenuation).\n\n### 3. Verification Roadmap\nHigh-vacuum cryogenic resonance test using optical interferometry and superconducting gravimeters under 3.5 MHz RF excitation.',
    upvotes: 184,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_email: 'quantum.propulsion@aeronull.org',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'b2222222-3333-4444-5555-666666666666',
    title: 'Dynamic Casimir Negative Energy Density & Alcubierre Metric Contraction',
    abstract: 'A macroscopic blueprint for generating localized exotic matter surrogates via high-frequency resonant optical metamaterial cavities. By modulating boundary condition reflections at gigahertz frequencies, quantum vacuum fluctuations yield negative stress-energy eigenvalues <T_{00}> < 0 compliant with Quantum Energy Inequalities (Ford-Roman bounds), enabling micro-scale metric contraction.',
    theoretical_framework: 'Alcubierre Metric & Spacetime Warping',
    formula_latex: 'ds^2 = -c^2 dt^2 + [dx - v_s(t)f(r_s)dt]^2 + dy^2 + dz^2',
    experimental_status: 'Mathematical Model',
    tags: ['alcubierre-metric', 'casimir-effect', 'negative-energy', 'warp-physics'],
    citations: ['Alcubierre, M. (1994)', 'White, H. et al. (2021)', 'Lentz, E. (2020)'],
    ai_summary: '### 1. Core Physical Mechanism\nResonant optical Fabry-Perot cavities excited by microwave frequency lasers induce localized standing Casimir waves where expectation value <T_{00}> becomes negative.\n\n### 2. Mathematical Feasibility\nSatisfies quantum energy inequalities by micro-pulsing bursts under 10^{-15} seconds, avoiding global topological singularities.\n\n### 3. Verification Roadmap\nWhite-Juday warp-field laser interferometer detection at 632.8 nm measuring fringe shifts on the order of 10^{-6} radians.',
    upvotes: 312,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_email: 'warp.dynamics@aeronull.org',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'c3333333-4444-5555-6666-777777777777',
    title: 'Non-Abelian Gauge Invariance & Gravitational Torsion Inversion',
    abstract: 'Extending Einstein-Cartan-Sciama-Kibble (ECSK) theory by coupling polarized fermion spin densities to spacetime torsion tensors. When high-density electron beams are aligned in a toroidal magnetic solenoid, non-zero spin alignment creates an asymmetric affine connection that cancels linear gravitational acceleration along the central symmetry axis.',
    theoretical_framework: 'Torsion Tensor & Einstein-Cartan',
    formula_latex: 'S^{\\lambda}_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( s^{\\lambda}_{\\mu\\nu} + \\frac{1}{2} \\delta^{\\lambda}_{\\mu} s^{\\rho}_{\\nu\\rho} - \\frac{1}{2} \\delta^{\\lambda}_{\\nu} s^{\\rho}_{\\mu\\rho} \\right)',
    experimental_status: 'Peer Reviewed',
    tags: ['torsion-physics', 'spin-coupling', 'einstein-cartan', 'fermionic-polarization'],
    citations: ['Hehl, F. W. (1976)', 'Hammond, R. T. (2002)', 'Kibble, T. W. B. (1961)'],
    ai_summary: '### 1. Core Physical Mechanism\nSpacetime curvature is supplemented by torsion generated by intrinsic microscopic angular momentum (spin). Macroscopic polarized spin alignment alters geodesic motion.\n\n### 2. Mathematical Feasibility\nRigorous within Riemann-Cartan geometry; however, spin-torsion coupling constant is suppressed by G/c^4 unless augmented by nonlinear gauge fields.\n\n### 3. Verification Roadmap\nMeasure deflection of neutral ultra-cold neutron beams passing through a 12-Tesla ferromagnetic toroid.',
    upvotes: 95,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_email: 'spin.torsion@aeronull.org',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'd4444444-5555-6666-7777-888888888888',
    title: 'Acoustic Levitation & Phonon-Coupled Micro-Gravitational Decoupling',
    abstract: 'High-intensity standing acoustic ultrasonic wavefields operating at 40 kHz produce acoustic radiation pressure nodes that suspend liquid droplets and solid particles against 1g gravitational fields. This paper models acoustic streaming boundary layers and explores quantum acoustic phonon interactions with metric perturbations.',
    theoretical_framework: 'Other Classical / Quantum Unified',
    formula_latex: 'U = 2\\pi r_0^3 \\left[ \\frac{\\langle p^2 \\rangle}{3\\rho_0 c_0^2} f_1 - \\frac{\\rho_0 \\langle v^2 \\rangle}{2} f_2 \\right]',
    experimental_status: 'Lab Simulation',
    tags: ['acoustic-levitation', 'gor-kov-potential', 'standing-waves', 'ultrasonic'],
    citations: ['Gor-kov, L. P. (1962)', 'Marzo, A. et al. (2015)'],
    ai_summary: '### 1. Core Physical Mechanism\nAcoustic radiation pressure created by non-linear acoustic wave interference balances gravitational forces at pressure nodes.\n\n### 2. Mathematical Feasibility\nDemonstrated with 100% repeatability for particles up to 10cm diameter under atmospheric pressures.\n\n### 3. Verification Roadmap\nMulti-emitter phased array testing with optical tracking and automated 3D position hold in inert nitrogen chambers.',
    upvotes: 247,
    user_id: '00000000-0000-0000-0000-000000000001',
    author_email: 'acoustic.physics@aeronull.org',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export const supabaseService = {
  isConfigured: () => config.supabase.isConfigured,

  /**
   * Fetch theories with search and filtering
   */
  async getTheories(filters = {}) {
    const { search, status, framework, tag, limit = 20, page = 1 } = filters;

    if (supabase) {
      let query = supabase
        .from('theories')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`title.ilike.%${search}%,abstract.ilike.%${search}%`);
      }
      if (status && status !== 'All') {
        query = query.eq('experimental_status', status);
      }
      if (framework && framework !== 'All') {
        query = query.eq('theoretical_framework', framework);
      }
      if (tag && tag !== 'All') {
        query = query.contains('tags', [tag]);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { theories: data || [], total: count || 0, isSandbox: false };
    }

    // In-Memory Fallback
    let filtered = [...inMemoryTheories];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || t.abstract.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((t) => t.experimental_status === status);
    }
    if (framework && framework !== 'All') {
      filtered = filtered.filter((t) => t.theoretical_framework === framework);
    }
    if (tag && tag !== 'All') {
      filtered = filtered.filter((t) => t.tags.includes(tag));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      theories: paginated,
      total,
      isSandbox: true,
      message: 'Operating in Sandbox Mode with high-fidelity physics seed data.',
    };
  },

  /**
   * Fetch single theory by UUID
   */
  async getTheoryById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('theories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }

    const theory = inMemoryTheories.find((t) => t.id === id);
    if (!theory) {
      throw new Error(`Theory with UUID '${id}' was not found.`);
    }
    return theory;
  },

  /**
   * Insert new theory
   */
  async createTheory(theoryData, user) {
    const payload = {
      ...theoryData,
      user_id: user.id,
      author_email: user.email || theoryData.author_email || 'researcher@aeronull.org',
      upvotes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('theories')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // In-memory insert
    const newRecord = {
      id: crypto.randomUUID(),
      ...payload,
    };
    inMemoryTheories.unshift(newRecord);
    return newRecord;
  },

  /**
   * Update AI summary for a theory
   */
  async updateAiSummary(id, summary) {
    if (supabase) {
      const { data, error } = await supabase
        .from('theories')
        .update({ ai_summary: summary })
        .eq('id', id)
        .select()
        .single();

      if (error) console.error('Failed to persist AI summary to Supabase:', error.message);
      return data;
    }

    const item = inMemoryTheories.find((t) => t.id === id);
    if (item) {
      item.ai_summary = summary;
      item.updated_at = new Date().toISOString();
      return item;
    }
    return null;
  },

  /**
   * Upvote a theory
   */
  async upvoteTheory(id) {
    if (supabase) {
      // In Supabase SQL RPC or update:
      const { data: theory } = await supabase.from('theories').select('upvotes').eq('id', id).single();
      const current = theory?.upvotes || 0;
      const { data, error } = await supabase
        .from('theories')
        .update({ upvotes: current + 1 })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const item = inMemoryTheories.find((t) => t.id === id);
    if (item) {
      item.upvotes = (item.upvotes || 0) + 1;
      return item;
    }
    throw new Error('Theory not found');
  }
};
