import { config } from '../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
if (config.gemini.isConfigured) {
  try {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI client:', err.message);
  }
}

/**
 * Generate a structured physics summary for an antigravity theory
 */
export const summarizePhysicsTheory = async ({
  title,
  abstract,
  theoretical_framework,
  formula_latex,
}) => {
  const prompt = `You are AeroNull's Quantum Neural Core, a world-class theoretical physicist specializing in general relativity, quantum field theory, superconductor physics, and metric engineering.

Analyze and summarize the following antigravity/propulsion theory into exactly three structured sections with markdown headings:

### 1. Core Physical Mechanism
Explain the fundamental physics at play (e.g., flux pinning, negative energy densities, frame-dragging, gravito-electromagnetism, or torsion field coupling) in 2-3 precise sentences.

### 2. Mathematical & Theoretical Feasibility
Assess its mathematical consistency against known physical laws (e.g., Einstein Field Equations, Energy Conditions like WEC/NEC, Cooper-pair coherence, or Casimir limits). Note any theoretical bottlenecks.

### 3. Experimental Verification Roadmap
Propose 2-3 concrete laboratory experiments, required sensor sensitivities (e.g., superconducting gravimeters, laser interferometry, sub-Kelvin cryostats), or tests needed to confirm or falsify the mechanism.

---
Theory Details:
- Title: ${title || 'Untitled Research'}
- Theoretical Framework: ${theoretical_framework || 'Quantum / Relativistic Unified'}
- Mathematical Formulation: ${formula_latex || 'N/A'}
- Abstract: ${abstract}
---

Keep the response focused, mathematically rigorous, and inspiring for senior physics researchers.`;

  // 1. If Gemini API key is configured, execute via Google GenAI
  if (genAI && config.gemini.isConfigured) {
    try {
      const model = genAI.getGenerativeModel({ model: config.gemini.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        summary: text,
        provider: 'Google Gemini Pro / Flash AI',
        model: config.gemini.model,
        isLiveAi: true,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Gemini API call encountered an error. Falling back to Quantum Neural Core heuristic synthesis:', err.message);
    }
  }

  // 2. Intelligent Physics Heuristic Generator (Fallback for instant sandbox demo)
  const syntheticSummary = generateHeuristicPhysicsSummary({
    title,
    abstract,
    theoretical_framework,
    formula_latex,
  });

  return {
    summary: syntheticSummary,
    provider: 'Quantum Neural Core (Heuristic Physics Engine)',
    model: 'AeroNull-Heuristic-v1',
    isLiveAi: false,
    notice: 'Live Gemini API key not detected or rate-limited. Synthesized via AeroNull Physics Heuristic Core.',
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Heuristic Physics Engine for Instant Offline Demonstration
 */
function generateHeuristicPhysicsSummary({ title, abstract, theoretical_framework, formula_latex }) {
  const framework = theoretical_framework || 'Advanced Metric Physics';
  const hasFormula = Boolean(formula_latex);

  return `### 1. Core Physical Mechanism
The proposed model investigates metric perturbation coupling within the domain of **${framework}**. By manipulating electromagnetic, superconductor, or vacuum boundary conditions, it seeks to induce an asymmetric stress-energy tensor $T_{\\mu\\nu}$ or localized gravito-magnetic moment, modifying local geodesic trajectories without violating global energy conservation.

### 2. Mathematical & Theoretical Feasibility
From an analytical standpoint, the formulation ${
  hasFormula ? `utilizing $${formula_latex}$` : 'detailed in the abstract'
} establishes a coherent boundary value solution. However, macroscopic realization faces significant energy condition thresholds (such as the Weak Energy Condition) and requires extreme flux densities or phase coherence that push current material science limits.

### 3. Experimental Verification Roadmap
1. **Cryogenic Interferometry:** Deploy a stabilized Mach-Zehnder or Fabry-Pérot laser interferometer in a high-vacuum chamber to observe phase fringe shifts $\\Delta\\phi < 10^{-6}$ rad under high-frequency excitation.
2. **Superconducting Gravimetry:** Monitor local delta-$g$ variations using a relative gravimeter with sub-microgal precision (${title.includes('Superconduct') ? 'under sub-77K liquid nitrogen cooling' : 'shielded from ambient acoustic and thermal noise'}).
3. **Pulsed RF Resonance Analysis:** Apply harmonic radiofrequency sweeps to test for non-linear momentum transfer and frame-dragging harmonics.`;
}
