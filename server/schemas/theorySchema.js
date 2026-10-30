import { z } from 'zod';

// Allowed Experimental Status Enums
export const EXPERIMENTAL_STATUSES = [
  'Hypothesis',
  'Mathematical Model',
  'Lab Simulation',
  'Experimental Prototype',
  'Peer Reviewed',
];

// Common Theoretical Frameworks
export const THEORETICAL_FRAMEWORKS = [
  'Quantum Field Theory',
  'Alcubierre Metric & Spacetime Warping',
  'Gravito-Electromagnetism (GEM)',
  'Superconducting Flux Pinning & Meissner Effect',
  'String Theory & Extra Dimensions',
  'Modified Gravity (MOG / MOND)',
  'Torsion Tensor & Einstein-Cartan',
  'Zero-Point Energy (ZPE) & Casimir Dynamics',
  'Other Classical / Quantum Unified'
];

// Strict Regex to disallow script tags and suspicious control characters
const SANITIZE_REGEX = /^[^<>{}\\]+$/;
const LATEX_REGEX = /^[^<>\\]*(\\?[^<>]*)*$/; // Allows LaTeX backslashes while blocking raw HTML scripts

/**
 * Zod Schema for Creating a New Physics Theory (POST /api/theories)
 */
export const createTheorySchema = z.object({
  title: z
    .string({ required_error: 'Theory title is required.' })
    .trim()
    .min(5, { message: 'Title must be at least 5 characters long.' })
    .max(255, { message: 'Title must not exceed 255 characters.' })
    .refine((val) => !/<script|javascript:|data:/i.test(val), {
      message: 'Malicious markup or script patterns detected in title.',
    }),

  abstract: z
    .string({ required_error: 'Comprehensive abstract is required.' })
    .trim()
    .min(30, { message: 'Abstract must provide sufficient theoretical depth (min 30 characters).' })
    .max(5000, { message: 'Abstract must not exceed 5000 characters.' })
    .refine((val) => !/<script|onload=|onerror=/i.test(val), {
      message: 'Potential XSS injection vectors detected in abstract.',
    }),

  theoretical_framework: z
    .string({ required_error: 'Theoretical framework classification is required.' })
    .trim()
    .min(3, { message: 'Framework name must be at least 3 characters.' })
    .max(120, { message: 'Framework name cannot exceed 120 characters.' }),

  formula_latex: z
    .string()
    .max(1000, { message: 'LaTeX formulation exceeds maximum length of 1000 characters.' })
    .optional()
    .nullable()
    .transform((val) => val || null),

  experimental_status: z
    .enum(
      [
        'Hypothesis',
        'Mathematical Model',
        'Lab Simulation',
        'Experimental Prototype',
        'Peer Reviewed',
      ],
      {
        errorMap: () => ({
          message:
            'Invalid experimental status. Must be one of: Hypothesis, Mathematical Model, Lab Simulation, Experimental Prototype, Peer Reviewed',
        }),
      }
    )
    .default('Hypothesis'),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(2, { message: 'Tag must be at least 2 characters.' })
        .max(40, { message: 'Tag cannot exceed 40 characters.' })
        .regex(/^[a-z0-9\-]+$/i, {
          message: 'Tags must be alphanumeric and may contain hyphens only.',
        })
    )
    .min(1, { message: 'At least one physics classification tag is required.' })
    .max(10, { message: 'Maximum of 10 tags allowed per theory.' }),

  citations: z
    .array(
      z
        .string()
        .trim()
        .max(255, { message: 'Citation cannot exceed 255 characters.' })
    )
    .max(20, { message: 'Maximum 20 citations permitted.' })
    .optional()
    .default([]),

  author_email: z
    .string()
    .trim()
    .email({ message: 'A valid email address is required for peer attribution.' })
    .optional()
    .or(z.literal('')),
});

/**
 * Zod Schema for Query Filtering & Search (GET /api/theories)
 */
export const queryTheorySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z
    .enum([
      'All',
      'Hypothesis',
      'Mathematical Model',
      'Lab Simulation',
      'Experimental Prototype',
      'Peer Reviewed',
    ])
    .optional(),
  framework: z.string().trim().max(120).optional(),
  tag: z.string().trim().max(40).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(Math.max(parseInt(val, 10) || 20, 1), 100) : 20)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(parseInt(val, 10) || 1, 1) : 1)),
});

/**
 * Zod Schema for AI Summarization Request (POST /api/theories/summarize)
 */
export const summarizeTheorySchema = z.object({
  theoryId: z.string().uuid({ message: 'Invalid theory UUID format.' }).optional(),
  title: z.string().trim().min(3).max(255).optional(),
  abstract: z.string().trim().min(20).max(5000).optional(),
  theoretical_framework: z.string().trim().max(120).optional(),
  formula_latex: z.string().trim().max(1000).optional().nullable(),
}).refine((data) => data.theoryId || (data.title && data.abstract), {
  message: 'Either theoryId or both title and abstract must be supplied for AI summarization.',
});
