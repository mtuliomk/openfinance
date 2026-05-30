import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/database/turso/schema/*.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN
  }
});
