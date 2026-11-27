import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

if (!existsSync('.dev.vars')) {
  const secret = randomBytes(32).toString('hex');
  const code = randomBytes(9).toString('base64url');
  writeFileSync('.dev.vars', `SESSION_SECRET="${secret}"\nOWNER_CODE="${code}"\n`, { flag: 'wx', mode: 0o600 });
  console.log('Your local owner code is ' + code);
} else {
  console.log('Using your existing .dev.vars and OWNER_CODE.');
}
