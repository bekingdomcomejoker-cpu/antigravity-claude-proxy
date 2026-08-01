import fs from 'fs';
import path from 'path';
import os from 'os';

export function getClaudeConfigPath() {
  return process.env.CLAUDE_CONFIG_PATH || path.join(os.homedir(), '.claude');
}

export function readClaudeSettings() {
  const p = path.join(getClaudeConfigPath(), 'settings.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

export function writeClaudeSettings(settings) {
  const dir = getClaudeConfigPath();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(settings, null, 2));
}
