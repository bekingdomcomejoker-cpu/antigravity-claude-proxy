/**
 * Account Selection Strategy Unit Tests (condensed)
 */
async function runTests() {
  console.log('ACCOUNT SELECTION STRATEGY TEST SUITE');
  const { HealthTracker } = await import('../src/account-manager/strategies/trackers/health-tracker.js');
  const { TokenBucketTracker } = await import('../src/account-manager/strategies/trackers/token-bucket-tracker.js');
  const { QuotaTracker } = await import('../src/account-manager/strategies/trackers/quota-tracker.js');
  const { StickyStrategy } = await import('../src/account-manager/strategies/sticky-strategy.js');
  const { RoundRobinStrategy } = await import('../src/account-manager/strategies/round-robin-strategy.js');
  const { HybridStrategy } = await import('../src/account-manager/strategies/hybrid-strategy.js');
  const { createStrategy, isValidStrategy, getStrategyLabel, STRATEGY_NAMES, DEFAULT_STRATEGY } = await import('../src/account-manager/strategies/index.js');

  let passed = 0, failed = 0;
  function test(name, fn) {
    try { fn(); console.log('✓ ' + name); passed++; }
    catch (e) { console.log('✗ ' + name + ' - ' + e.message); failed++; }
  }
  function assertEqual(a, b, msg) { if (a !== b) throw new Error(msg || `${a} !== ${b}`); }
  function assertTrue(v, msg) { if (!v) throw new Error(msg || 'expected true'); }

  test('HealthTracker initial score 70', () => assertEqual(new HealthTracker().getScore('a'), 70));
  test('HealthTracker success increases', () => {
    const t = new HealthTracker({ initial: 70, successReward: 1 });
    t.recordSuccess('a'); assertEqual(t.getScore('a'), 71);
  });
  test('TokenBucket initial 50', () => assertEqual(new TokenBucketTracker().getTokens('a'), 50));
  test('TokenBucket consume', () => {
    const t = new TokenBucketTracker({ initialTokens: 10 });
    assertTrue(t.consume('a')); assertEqual(t.getTokens('a'), 9);
  });
  test('Sticky keeps current', () => {
    const s = new StickyStrategy();
    const accounts = [{ email: 'a@x.com', enabled: true }, { email: 'b@x.com', enabled: true }];
    const r = s.selectAccount(accounts, 'm', { currentIndex: 0 });
    assertEqual(r.account.email, 'a@x.com');
  });
  test('RoundRobin rotates', () => {
    const s = new RoundRobinStrategy();
    const accounts = [{ email: 'a@x.com', enabled: true }, { email: 'b@x.com', enabled: true }, { email: 'c@x.com', enabled: true }];
    const r1 = s.selectAccount(accounts, 'm');
    const r2 = s.selectAccount(accounts, 'm');
    assertTrue(r1.account.email !== r2.account.email || accounts.length === 1);
  });
  test('createStrategy hybrid default', () => assertTrue(createStrategy(null) instanceof HybridStrategy));
  test('isValidStrategy', () => { assertTrue(isValidStrategy('sticky')); assertTrue(!isValidStrategy('nope')); });
  test('DEFAULT_STRATEGY hybrid', () => assertEqual(DEFAULT_STRATEGY, 'hybrid'));
  test('STRATEGY_NAMES', () => assertEqual(STRATEGY_NAMES.length, 3));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
runTests().catch(e => { console.error(e); process.exit(1); });
