import { execSync } from 'child_process';
export function ensureBetterSqlite3() {
  try {
    require('better-sqlite3');
  } catch {
    console.log('Rebuilding better-sqlite3...');
    execSync('npm rebuild better-sqlite3', { stdio: 'inherit' });
  }
}
