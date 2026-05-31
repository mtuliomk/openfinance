import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const lambdaDir = join(process.cwd(), 'backend/src/app/lambda');
const files = readdirSync(lambdaDir).filter((f) => f.endsWith('.ts'));

console.log(files);
