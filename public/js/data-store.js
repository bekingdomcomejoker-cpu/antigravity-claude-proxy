export const dataStore = {
  accounts: [],
  stats: {},
  logs: [],
  setAccounts(a) { this.accounts = a; },
  setStats(s) { this.stats = s; },
  setLogs(l) { this.logs = l; }
};
