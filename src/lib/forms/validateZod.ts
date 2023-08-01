import type { ZodSchema } from 'zod';

function validateZod(schema: ZodSchema, values: unknown) {
  let errors = {};

  const control = schema.safeParse(values);
  if (control.success) return {};

  for (const issue of control.error.issues) {
    errors = { ...errors, [issue.path[0]]: issue.message };
  }

  return errors;
}

export { validateZod };
