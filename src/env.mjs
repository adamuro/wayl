import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  server: {
    PSQL_URL: z.string(),
    PSQL_PRISMA_URL: z.string(),
    PSQL_URL_NON_POOLING: z.string(),
    PSQL_USER: z.string(),
    PSQL_HOST: z.string(),
    PSQL_PASSWORD: z.string(),
    PSQL_DATABASE: z.string(),
    CLERK_SECRET_KEY: z.string(),
    NODE_ENV: z.string().regex(/production|development|test/),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    PSQL_URL: process.env.PSQL_URL,
    PSQL_PRISMA_URL: process.env.PSQL_PRISMA_URL,
    PSQL_URL_NON_POOLING: process.env.PSQL_URL_NON_POOLING,
    PSQL_USER: process.env.PSQL_USER,
    PSQL_HOST: process.env.PSQL_HOST,
    PSQL_PASSWORD: process.env.PSQL_PASSWORD,
    PSQL_DATABASE: process.env.PSQL_DATABASE,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
});
