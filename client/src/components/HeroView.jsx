import React, { useState, useMemo } from 'react';
import {
  Compass,
  Zap,
  Layers,
  ThermometerSnowflake,
  Activity,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Sliders,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Atom,
} from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas';

export const HeroView = ({ onNavigate }) => {
  // Interactive Levitation Simulation State
  const [temperature, setTemperature] = useState(65); // Kelvin (65K is below 93K Tc)
  const [magneticField, setMagneticField] = useState(2.4); // Tesla
  const [material, setMaterial] = useState('YBCO'); // YBCO (Type-II) or Lead (Type-I)

  const Tc = material === 'YBCO' ? 93 : 7.2; // Critical temperature in Kelvin
  const isSuperconducting = temperature < Tc;

  // Real-time Physics Calculations
  const simulationPhysics = useMemo(() => {
    if (!isSuperconducting) {
      return {
        heightMm: 0,
        forceNewtons: 0,
        fluxVortices: 0,
        coherenceLength: '0 nm (Normal Resistive State)',
        penetrationDepth: 'Infinite (Field Penetrates)',
        status: 'RESISTIVE COLLAPSE (T > Tc)',
      };
    }

    // Levitation height calculation based on magnetic pressure B^2 / (2 * mu_0) balancing gravitational mass
    const thermalDecay = Math.max(0, 1 - Math.pow(temperature / Tc, 4));
    const force = +(magneticField * magneticField * 14.8 * thermalDecay).toFixed(2);
    const height = +(Math.min(45, (force / 3.8) * (material === 'YBCO' ? 1.2 : 0.6))).toFixed(1);
    const vortices = material === 'YBCO' ? Math.floor(magneticField * 420 * thermalDecay) : 0;

    return {
      heightMm: height,
      forceNewtons: force,
      fluxVortices: vortices,
      coherenceLength: material === 'YBCO' ? '1.5 nm' : '83 nm',
      penetrationDepth: '150 nm (London Depth)',
      status: material === 'YBCO' ? 'QUANTUM FLUX PINNING LOCKED' : 'TYPE-I MEISSNER EXPULSION',
    };
  }, [temperature, magneticField, material, isSuperconducting, Tc]);

  return (
    <div className="relative min-h-screen">
      {/* Background Quantum Particle Canvas */}
      <div className="absolute inset-0 h-[680px] overflow-hidden pointer-events-none">
        <ParticleCanvas mode="flux" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/60 to-cyber-black pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-24">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-display telemetry-badge shadow-cyan-glow">
            <Sparkles className="w-3.5 h-3.5 text-cyber-neon animate-pulse" />
            <span>THEORETICAL PROPULSION INITIATIVE</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyber-purple/15 border border-cyber-purple/40 text-purple-300 text-xs font-display telemetry-badge">
            <Atom className="w-3.5 h-3.5 text-cyber-purple" />
            <span>MEISSNER EFFECT × QUANTUM GRAVITY</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="max-w-4xl mb-12">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
            ENGINEERING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyan-200 to-cyber-purple">
              ZERO-GRAVITY
            </span> <br />
            METRICS
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-3xl">
            AeroNull bridges macroscopic quantum coherence and general relativity. Investigate superconducting flux pinning, gravito-electromagnetism, and negative Casimir energy densities with peer-verified formulations and <span className="text-cyber-cyan font-medium">Google Gemini AI</span> theory summarization.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-cyber-cyan py-3 px-6 flex items-center space-x-2 text-xs"
            >
              <span>Explore Research Repository</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('submit')}
              className="btn-cyber-outline py-3 px-6 flex items-center space-x-2 text-xs"
            >
              <Zap className="w-4 h-4 text-cyber-cyan" />
              <span>Submit Quantum Model</span>
            </button>
          </div>
        </div>

        {/* Interactive Quantum Levitation Laboratory */}
        <div className="my-16 glass-hud rounded-2xl p-6 sm:p-8 border border-cyber-cyan/30 shadow-cyan-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-display text-cyber-cyan telemetry-badge uppercase mb-1">
                <Activity className="w-4 h-4 text-cyber-neon" />
                <span>Simulation Chamber 01 // Interactive Physics Simulator</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Superconducting Meissner Levitation & Flux Pinning
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Cryostat Status:</span>
              <span
                className={`px-2.5 py-1 rounded font-semibold ${
                  isSuperconducting
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                }`}
              >
                {simulationPhysics.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Visual Cryogenic Levitation Stage */}
            <div className="lg:col-span-7 relative min-h-[360px] bg-cyber-darker rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden p-6">
              {/* Grid Background */}
              <div className="absolute inset-0 cyber-grid-pattern opacity-40"></div>

              {/* Cryogenic Nitrogen Mist effect if sub-77K */}
              {temperature <= 77 && isSuperconducting && (
                <div className="absolute bottom-6 w-full h-16 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none animate-pulse"></div>
              )}

              {/* Levitation Apparatus Display */}
              <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                {/* Upper Levitating Superconductor Disc */}
                <div
                  className="transition-all duration-500 ease-out flex flex-col items-center"
                  style={{
                    transform: `translateY(-${simulationPhysics.heightMm * 2.8}px)`,
                  }}
                >
                  <div
                    className={`relative w-44 h-10 rounded-full border flex items-center justify-center transition-all ${
                      isSuperconducting
                        ? 'bg-gradient-to-r from-cyan-600 via-cyber-cyan to-cyan-400 border-white shadow-cyan-glow-lg animate-levitate'
                        : 'bg-slate-700 border-slate-600 shadow-none'
                    }`}
                  >
                    <span className="font-display text-[10px] font-bold text-cyber-black tracking-wider">
                      {material} SUPERCONDUCTOR
                    </span>

                    {/* Quantum Flux Pinning Core lines */}
                    {isSuperconducting && material === 'YBCO' && (
                      <div className="absolute -inset-1 rounded-full border border-cyber-neon/40 animate-pulse"></div>
                    )}
                  </div>

                  {/* Height Indicator Callout */}
                  <div className="mt-2 text-center">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/70 border border-cyber-cyan/40 text-cyber-cyan">
                      Altitude: {simulationPhysics.heightMm} mm
                    </span>
                  </div>
                </div>

                {/* Magnetic Field Flux Line Visualizer */}
                <div className="w-48 h-20 my-2 relative flex items-center justify-center">
                  {isSuperconducting ? (
                    <svg className="w-full h-full text-cyber-cyan/50" viewBox="0 0 200 80">
                      <path
                        d="M 30,70 Q 20,40 40,10 Q 70,-10 100,10 Q 130,-10 160,10 Q 180,40 170,70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="animate-pulse"
                      />
                      <path
                        d="M 50,70 Q 70,35 100,20 Q 130,35 150,70"
                        fill="none"
                        stroke="#00f5ff"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M 75,70 Q 90,45 100,32 Q 110,45 125,70"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ) : (
                    <div className="text-center text-xs text-rose-400 font-mono">
                      Flux Expulsion Cancelled: Thermal Disorder
                    </div>
                  )}
                </div>

                {/* Lower Permanent Neodymium Rare-Earth Magnet Base */}
                <div className="w-56 h-12 rounded-xl bg-gradient-to-r from-red-800 via-slate-800 to-blue-800 border border-slate-600 flex items-center justify-between px-4 shadow-lg">
                  <span className="font-display text-[10px] font-bold text-red-300">NORTH [N]</span>
                  <span className="font-mono text-[9px] text-slate-300">
                    NdFeB MAGNET ({magneticField}T)
                  </span>
                  <span className="font-display text-[10px] font-bold text-blue-300">SOUTH [S]</span>
                </div>
              </div>

              {/* Visual Telemetry Footer */}
              <div className="w-full mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>London Penetration Depth: λ = 150 nm</span>
                <span>Lorentz Force Eq: F = q(E + v × B)</span>
              </div>
            </div>

            {/* Interactive Control Dashboard */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Material Choice */}
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-slate-300 mb-2">
                    Superconductor Specimen
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMaterial('YBCO')}
                      className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                        material === 'YBCO'
                          ? 'bg-cyber-cyan/15 border-cyber-cyan text-white shadow-cyan-glow'
                          : 'bg-cyber-surface border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold font-display">Type-II YBCO Ceramic</div>
                      <div className="text-[10px] text-slate-400 font-mono">Tc = 93K (Flux Pinning)</div>
                    </button>

                    <button
                      onClick={() => setMaterial('Lead')}
                      className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                        material === 'Lead'
                          ? 'bg-cyber-cyan/15 border-cyber-cyan text-white shadow-cyan-glow'
                          : 'bg-cyber-surface border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold font-display">Type-I Classical (Pb)</div>
                      <div className="text-[10px] text-slate-400 font-mono">Tc = 7.2K (Pure Expulsion)</div>
                    </button>
                  </div>
                </div>

                {/* Temperature Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs font-display">
                    <span className="text-slate-300 flex items-center space-x-1.5">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cryogenic Temperature</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        temperature < Tc ? 'text-cyber-cyan' : 'text-rose-400'
                      }`}
                    >
                      {temperature} Kelvin ({Math.round(temperature - 273.15)}°C)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="150"
                    step="1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
                    className="w-full accent-cyber-cyan cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>4K (Liquid He)</span>
                    <span className="text-cyan-400 font-semibold">77K (Liquid N2)</span>
                    <span className="text-amber-400">93K (YBCO Tc)</span>
                    <span>150K</span>
                  </div>
                </div>

                {/* Magnetic Field Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs font-display">
                    <span className="text-slate-300 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyber-neon" />
                      <span>Magnetic Induction Flux (B)</span>
                    </span>
                    <span className="font-mono text-cyber-neon font-bold">
                      {magneticField} Tesla
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={magneticField}
                    onChange={(e) => setMagneticField(parseFloat(e.target.value))}
                    className="w-full accent-cyber-neon cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0.2T (Ferrite)</span>
                    <span>2.5T (Neodymium N52)</span>
                    <span>5.0T (Superconducting Coil)</span>
                  </div>
                </div>
              </div>

              {/* Calculated Real-time Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">Meissner Upward Force</div>
                  <div className="text-white font-bold text-sm">
                    {simulationPhysics.forceNewtons} N
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Pinned Flux Vortices</div>
                  <div className="text-cyber-cyan font-bold text-sm">
                    {simulationPhysics.fluxVortices.toLocaleString()} lines
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Coherence Length (ξ)</div>
                  <div className="text-slate-300 font-semibold text-xs">
                    {simulationPhysics.coherenceLength}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Magnetic Pressure (Pm)</div>
                  <div className="text-slate-300 font-semibold text-xs">
                    {((magneticField * magneticField) / (2 * 1.2566e-6) / 1e6).toFixed(2)} MPa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Physics Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          {/* Section: Magnetic Levitation & Superconductivity */}
          <div className="glass-hud glass-hud-hover rounded-2xl p-6 sm:p-8 border border-cyber-cyan/20">
            <div className="w-10 h-10 rounded-xl bg-cyber-surface border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan mb-4 shadow-cyan-glow">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              1. Superconducting Meissner Flux Pinning
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              When Type-II superconductors cool below their critical temperature (Tc), screening supercurrents cancel interior magnetic fields (B = 0). In Type-II materials like YBCO, quantized magnetic flux tubes penetrate through non-superconducting crystalline pinning centers:
            </p>

            <div className="p-3.5 rounded-lg bg-cyber-darker border border-slate-800 text-xs font-mono text-cyan-300 mb-4 overflow-x-auto">
              <code>{"\\nabla \\times \\mathbf{j}_s = -\\frac{n_s e^2}{m} \\mathbf{B} \\quad \\text{(London Relation)}"}</code>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This locks the levitating object in a 3D potential well, allowing it to remain suspended upright, sideways, or even upside down without physical contact or active electronic stabilization.
            </p>
          </div>

          {/* Section: Quantum Gravity & Metric Manipulation */}
          <div className="glass-hud glass-hud-hover rounded-2xl p-6 sm:p-8 border border-cyber-purple/20">
            <div className="w-10 h-10 rounded-xl bg-cyber-surface border border-cyber-purple/40 flex items-center justify-center text-cyber-purple mb-4 shadow-purple-glow">
              <Atom className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              2. Quantum Gravity & Metric Warping
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Standard general relativity dictates that spacetime curvature is governed by the stress-energy tensor {"T_μν"}. In quantum field theory, boundary conditions can generate negative Casimir energy expectation values {"⟨T₀₀⟩ < 0"}, opening theoretical avenues for metric engineering:
            </p>

            <div className="p-3.5 rounded-lg bg-cyber-darker border border-slate-800 text-xs font-mono text-purple-300 mb-4 overflow-x-auto">
              <code>{"G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\langle T_{\\mu\\nu}^{\\text{quantum}} \\rangle \\right)"}</code>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              AeroNull curates research models evaluating whether high-frequency resonant cavities, gravitomagnetic induction, or torsion field coupling can create measurable gravitational metric perturbations.
            </p>
          </div>
        </div>

        {/* Physics Modality Matrix */}
        <div className="glass-hud rounded-2xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-display text-cyber-cyan uppercase telemetry-badge mb-3">
            <Sliders className="w-4 h-4 text-cyber-neon" />
            <span>Comparative Physics Modality Matrix</span>
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-4">
            Taxonomy of Anti-Gravitational & Levitation Phenomena
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-display uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-4">Phenomenon</th>
                  <th className="pb-3 px-4">Underlying Mechanism</th>
                  <th className="pb-3 px-4">Verification State</th>
                  <th className="pb-3 px-4">Energy Threshold</th>
                  <th className="pb-3 pl-4">AeroNull Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
                <tr className="hover:bg-cyber-surface/40 transition-colors">
                  <td className="py-3 pr-4 font-display font-semibold text-white">Meissner Flux Pinning</td>
                  <td className="py-3 px-4 text-slate-300">Type-II London Supercurrent Vortex Lock</td>
                  <td className="py-3 px-4"><span className="text-emerald-400">Lab Confirmed (100%)</span></td>
                  <td className="py-3 px-4">Sub-77K Cryogenics</td>
                  <td className="py-3 pl-4 text-cyber-cyan">Electromagnetic Boundary</td>
                </tr>
                <tr className="hover:bg-cyber-surface/40 transition-colors">
                  <td className="py-3 pr-4 font-display font-semibold text-white">Alcubierre Metric Contraction</td>
                  <td className="py-3 px-4 text-slate-300">Negative Casimir Vacuum Stress-Energy Tensor</td>
                  <td className="py-3 px-4"><span className="text-amber-400">Mathematical Model</span></td>
                  <td className="py-3 px-4">Exotic Mass Equivalents</td>
                  <td className="py-3 pl-4 text-purple-400">General Relativity Warping</td>
                </tr>
                <tr className="hover:bg-cyber-surface/40 transition-colors">
                  <td className="py-3 pr-4 font-display font-semibold text-white">Gravito-Electromagnetism (GEM)</td>
                  <td className="py-3 px-4 text-slate-300">Rotating Mass Frame-Dragging (Lense-Thirring)</td>
                  <td className="py-3 px-4"><span className="text-cyan-400">Astrophysical Confirmed</span></td>
                  <td className="py-3 px-4">G/c^2 Coupling Ratio</td>
                  <td className="py-3 pl-4 text-cyber-cyan">Relativistic Maxwell Analogue</td>
                </tr>
                <tr className="hover:bg-cyber-surface/40 transition-colors">
                  <td className="py-3 pr-4 font-display font-semibold text-white">Acoustic Radiation Levitation</td>
                  <td className="py-3 px-4 text-slate-300">Non-linear Ultrasonic Wave Pressure Gradient</td>
                  <td className="py-3 px-4"><span className="text-emerald-400">Commercial Standard</span></td>
                  <td className="py-3 px-4">40 kHz Ultrasonic Arrays</td>
                  <td className="py-3 pl-4 text-slate-400">Fluid Dynamic Trapping</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
