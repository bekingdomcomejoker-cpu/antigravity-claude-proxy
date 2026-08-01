/**
 * Test Schema Sanitizer - Tests for schema transformation for Google API
 */
async function runTests() {
    console.log('SCHEMA SANITIZER TEST SUITE');
    const { sanitizeSchema, cleanSchema } = await import('../src/format/schema-sanitizer.js');
    let passed = 0, failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`✓ ${name}`);
            passed++;
        } catch (e) {
            console.log(`✗ ${name}`);
            console.log(`  Error: ${e.message}`);
            failed++;
        }
    }

    function assertEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
        }
    }

    test('Basic type conversion to uppercase', () => {
        const schema = { type: 'string', description: 'A test string' };
        const result = cleanSchema(sanitizeSchema(schema));
        assertEqual(result.type, 'STRING');
    });

    test('Object type conversion', () => {
        const schema = {
            type: 'object',
            properties: { name: { type: 'string' }, age: { type: 'integer' } }
        };
        const result = cleanSchema(sanitizeSchema(schema));
        assertEqual(result.type, 'OBJECT');
        assertEqual(result.properties.name.type, 'STRING');
        assertEqual(result.properties.age.type, 'INTEGER');
    });

    test('Array type conversion with items', () => {
        const schema = { type: 'array', items: { type: 'string' } };
        const result = cleanSchema(sanitizeSchema(schema));
        assertEqual(result.type, 'ARRAY');
        assertEqual(result.items.type, 'STRING');
    });

    test('Nested array inside object', () => {
        const schema = {
            type: 'object',
            properties: {
                todos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' }
                        }
                    }
                }
            }
        };
        const result = cleanSchema(sanitizeSchema(schema));
        assertEqual(result.type, 'OBJECT');
        assertEqual(result.properties.todos.type, 'ARRAY');
        assertEqual(result.properties.todos.items.type, 'OBJECT');
        assertEqual(result.properties.todos.items.properties.id.type, 'INTEGER');
    });

    test('All primitive types', () => {
        const schema = {
            type: 'object',
            properties: {
                str: { type: 'string' },
                num: { type: 'number' },
                int: { type: 'integer' },
                bool: { type: 'boolean' },
                arr: { type: 'array', items: { type: 'string' } },
                obj: { type: 'object', properties: { x: { type: 'string' } } }
            }
        };
        const result = cleanSchema(sanitizeSchema(schema));
        assertEqual(result.properties.str.type, 'STRING');
        assertEqual(result.properties.num.type, 'NUMBER');
        assertEqual(result.properties.int.type, 'INTEGER');
        assertEqual(result.properties.bool.type, 'BOOLEAN');
        assertEqual(result.properties.arr.type, 'ARRAY');
        assertEqual(result.properties.obj.type, 'OBJECT');
    });

    console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error(err); process.exit(1); });
