import { ZodError } from 'zod';

/**
 * Higher-order middleware factory for strict Zod schema validation
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} target 
 */
export const validate = (schema, target = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[target];
      const parsedData = await schema.parseAsync(dataToValidate);

      if (target === 'query') {
        req.validatedQuery = parsedData;
        try {
          // Attempt to update keys on query object
          Object.keys(req.query).forEach((key) => delete req.query[key]);
          Object.assign(req.query, parsedData);
        } catch {
          // If immutable, validatedQuery holds the parsed values
        }
      } else {
        req[target] = parsedData;
      }

      req[`validated_${target}`] = parsedData;
      next();
    } catch (err) {
      if (err instanceof ZodError || err.name === 'ZodError') {
        const issues = err.issues || err.errors || [];
        const formattedErrors = issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          rule: issue.code,
        }));

        return res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Inbound payload failed schema verification protocol.',
            details: formattedErrors,
            receivedPayloadType: typeof req[target],
          },
        });
      }

      next(err);
    }
  };
};
