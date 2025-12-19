import { beforeAll } from 'vitest';
import { setupTestDb } from './setup';

beforeAll(async () => {
  await setupTestDb();
});
