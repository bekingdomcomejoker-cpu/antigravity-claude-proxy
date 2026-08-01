/**
 * OAuth No-Browser Mode Unit Tests
 */
async function runTests() {
    console.log('OAUTH NO-BROWSER MODE UNIT TESTS');
    const { extractCodeFromInput } = await import('../src/auth/oauth.js');
    let allPassed = true;
    const results = [];

    async function test(name, testFn) {
        try {
            const { passed, message } = await testFn();
            results.push({ name, passed, message });
            console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${name}`);
            if (message) console.log(`         ${message}`);
            if (!passed) allPassed = false;
        } catch (error) {
            results.push({ name, passed: false, message: error.message });
            console.log(`  [FAIL] ${name}`);
            console.log(`         Error: ${error.message}`);
            allPassed = false;
        }
    }

    await test('Parse full callback URL with code and state', () => {
        const input = 'http://localhost:51121/oauth-callback?code=4/0AQSTg123&state=abc123';
        const result = extractCodeFromInput(input);
        const passed = result.code === '4/0AQSTg123' && result.state === 'abc123';
        return { passed, message: `code=${result.code}, state=${result.state}` };
    });

    await test('Parse raw authorization code', () => {
        const input = '4/0AQSTgQGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        const result = extractCodeFromInput(input);
        const passed = result.code === input && result.state === null;
        return { passed, message: `code length=${result.code.length}` };
    });

    await test('Throw on empty input', () => {
        try {
            extractCodeFromInput('');
            return { passed: false, message: 'Should have thrown' };
        } catch (e) {
            return { passed: e.message.includes('No input') || e.message.includes('too short'), message: e.message };
        }
    });

    await test('Throw on OAuth error in URL', () => {
        try {
            extractCodeFromInput('http://localhost:51121/?error=access_denied');
            return { passed: false, message: 'Should have thrown' };
        } catch (e) {
            return { passed: e.message.includes('OAuth error') || e.message.includes('error'), message: e.message };
        }
    });

    console.log('\n' + (allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'));
    process.exit(allPassed ? 0 : 1);
}

runTests().catch(err => { console.error(err); process.exit(1); });
