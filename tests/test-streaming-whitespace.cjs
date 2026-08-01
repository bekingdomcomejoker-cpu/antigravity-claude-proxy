/**
 * Test Streaming Whitespace - Verifies that whitespace-only chunks are not dropped
 * Reproduction for Issue #138: "Claude models swallow spaces between words"
 */
const { TextEncoder } = require('util');

class MockResponse {
    constructor(chunks) {
        this.body = {
            getReader: () => {
                let index = 0;
                return {
                    read: async () => {
                        if (index >= chunks.length) return { done: true, value: undefined };
                        const chunk = chunks[index++];
                        const encoder = new TextEncoder();
                        return { done: false, value: encoder.encode(chunk) };
                    }
                };
            }
        };
    }
}

async function runTests() {
    console.log('STREAMING WHITESPACE TEST SUITE');
    const { streamSSEResponse } = await import('../src/cloudcode/sse-streamer.js');
    let passed = 0, failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`✓ ${name}`);
            passed++;
        } catch (e) {
            console.log(`✗ ${name}`);
            console.log(`  Error: ${e.message}`);
            failed++;
        }
    }

    function assertEqual(actual, expected, message = '') {
        if (actual !== expected) throw new Error(`${message}\nExpected: "${expected}"\nActual: "${actual}"`);
    }

    await test('Preserves whitespace-only chunks', async () => {
        const chunks = [
            'data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: "Hello" }] } }] }) + '\n\n',
            'data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: " " }] } }] }) + '\n\n',
            'data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: "World" }] } }] }) + '\n\n'
        ];
        const response = new MockResponse(chunks);
        let fullText = '';
        for await (const event of streamSSEResponse(response, 'claude-sonnet-4-6')) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                fullText += event.delta.text;
            }
        }
        assertEqual(fullText, 'Hello World', 'Should preserve space between words');
    });

    console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error(err); process.exit(1); });
