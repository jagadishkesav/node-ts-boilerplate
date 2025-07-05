import { config } from 'dotenv';
import { z } from 'zod';
config();

const envVarsSchema = z
  .object({
    NODE_ENV: z
      .string()
      .optional()
      .default('development')
      .refine((val) => ['development', 'production', 'test'].includes(val), {
        message:
          "NODE_ENV must be one of 'development', 'production', or 'test'"
      }),
    PORT: z
      .string()
      .optional()
      .default(process.env.PORT || '3000')
      .transform(Number)
  })
  .strict();

const parsedEnv = envVarsSchema.safeParse(
  Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      Object.keys(envVarsSchema.shape).includes(key)
    )
  )
);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.errors
    .map((err) => `${err.path}: ${err.message}`)
    .join(', ');
  throw new Error(`Config validation error: ${errors}`);
}

const envVars = parsedEnv.data;

export = {
  node_env: envVars.NODE_ENV,
  port: envVars.PORT
};
