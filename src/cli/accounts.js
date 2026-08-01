#!/usr/bin/env node
import { loadAccounts, saveAccount, removeAccount } from '../account-manager/storage.js';
import { extractCodeFromInput } from '../auth/token-extractor.js';

const args = process.argv.slice(2);
const cmd = args[0] || 'list';

async function main() {
  if (cmd === 'list') {
    const accounts = loadAccounts();
    console.log('Accounts:', accounts.length);
    accounts.forEach(a => console.log(`  ${a.email}  enabled=${a.enabled} invalid=${a.isInvalid}`));
  } else if (cmd === 'add') {
    console.log('OAuth add flow - use WebUI or implement full OAuth here');
    console.log('For headless: provide code via --no-browser');
  } else if (cmd === 'remove') {
    const email = args[1];
    if (!email) { console.error('Email required'); process.exit(1); }
    removeAccount(email);
    console.log('Removed', email);
  } else if (cmd === 'verify') {
    console.log('Verify not fully implemented in this push');
  } else if (cmd === 'clear') {
    loadAccounts().forEach(a => removeAccount(a.email));
    console.log('Cleared all');
  } else {
    console.log('Usage: accounts [list|add|remove|verify|clear]');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
