import { drizzle } from 'drizzle-orm/libsql';

import { tursoClient } from './turso-client.js';

export const db = drizzle(tursoClient);
