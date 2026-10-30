import { z } from 'zod';

export const EXPERIMENTAL_STATUSES = [
  'Hypothesis',
  'Mathematical Model',
  'Lab Simulation',
  'Experimental Prototype',
  'Peer Reviewed',
];

export const THEORETICAL_FRAMEWORKS = [
  'Quantum Field Theory',
  'Alcubierre Metric & Spacetime Warping',
  'Gravito-Electromagnetism (GEM)',
  'Superconducting Flux Pinning & Meissner Effect',
  'String Theory & Extra Dimensions',
  'Modified Gravity (MOG / MOND)',
  'Torsion Tensor & Einstein-Cartan',
  'Zero-Point Energy (ZPE) & Casimir Dynamics',
  'Other Classical / Quantum Unified',
];

export const clientTheorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title must contain at least 5 characters.' })
    .max(255, { message: 'Title exceeds maximum limit of 255 characters.' }),

  abstract: z
    .string()
    .trim()
    .min(30, { message: 'Abstract must be at least 30 characters explaining the physics.' })
    .max(5000, { message: 'Abstract must not exceed 5000 characters.' }),

  theoretical_framework: z
    .string()
    .trim()
    .min(3, { message: 'Please select or specify a theoretical physics framework.' }),

  formula_latex: z
    .string()
    .trim()
    .max(1000, { message: 'Formula must not exceed 1000 characters.' })
    .optional()
    .or(z.literal('')),

  experimental_status: z
    .enum([
      'Hypothesis',
      'Mathematical Model',
      'Lab Simulation',
      'Experimental Prototype',
      'Peer Reviewed',
    ]),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(2, { message: 'Tags must be at least 2 characters.' })
        .max(40, { message: 'Tag max length is 40 characters.' })
        .regex(/^[a-z0-9\-]+$/i, {
          message: 'Tags must contain alphanumeric characters or hyphens only.',
        })
    )
    .min(1, { message: 'At least one physics classification tag is required.' })
    .max(10, { message: 'Max 10 tags allowed.' }),

  citations: z.array(z.string().trim().max(255)).optional(),

  author_email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email format for attribution.' })
    .optional()
    .or(z.literal('')),
});

/**
 * Validate form input and return field-keyed error map
 */
export const validateTheoryForm = (formData) => {
  const result = clientTheorySchema.safeParse(formData);

  if (result.success) {
    return { isValid: true, errors: {}, data: result.data };
  }

  const errors = {};
  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0] || '_general';
    if (!errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  });

  return { isValid: false, errors, data: null };
};
