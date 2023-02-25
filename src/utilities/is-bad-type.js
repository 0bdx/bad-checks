import equal from '../private-methods/equal.js';

/**
 * @private
 * Validates a value using JavaScript's native `typeof`.
 * 
 * As a private method, isBadType() assumes that the arguments have already been
 * checked for correctness, so it never throws an `Error`.
 * 
 * Due to the way `typeof` works, these are all valid, so return `false`:
 * - `isBadType('', null, '', 'object')`
 * - `isBadType('', [99], '', 'object')`
 * - `isBadType('', NaN, '', 'number')`
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {any} value
 *     The value to check.
 * @param {string} identifier
 *     What to call `value` in the explanation, if invalid.
 * @param {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} typeStr
 *     The JavaScript type to expect, eg "boolean" or "undefined".
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
export default function isBadType(
    msgPrefix,
    value,
    identifier,
    typeStr,
) {
    const type = typeof value;
    if (type === typeStr) return false;
    return `${msgPrefix}: ${identifier || 'A value'} ${
        value === null
            ? 'is null not type'
            : Array.isArray(value)
                ? 'is an array not type'
                : `is type '${type}' not`
        } '${typeStr}'`
    ;
}

/**
 * isBadType() unit tests.
 * 
 * @param {isBadType} f
 *     The `isBadType()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function isBadTypeTest(f) {

    // Incorrect usage does not throw an Error.
    // @ts-expect-error
    equal(f(),
        "undefined: A value is type 'undefined' not 'undefined'");
    // @ts-expect-error
    equal(f(99),
        "99: A value is type 'undefined' not 'undefined'");
    // @ts-expect-error
    equal(f('Incorrect Test', [], 99),
        "Incorrect Test: 99 is an array not type 'undefined'");
    // @ts-expect-error
    equal(f(null, void 0, 0, typeof void 0),
        false);
    // @ts-expect-error
    equal(f('Incorrect Test', void 0, 98765, 54321),
        "Incorrect Test: 98765 is type 'undefined' not '54321'");
    // @ts-expect-error
    equal(f('Incorrect Test', 123, 'typeStr_has_uppercase', 'String'),
        "Incorrect Test: typeStr_has_uppercase is type 'number' not 'String'");

    // typeStr is 'bigint'.
    equal(f('BigInt Test', BigInt(123), 'hugeNum', 'bigint'),
        false);
    equal(f('BigInt Test', null, 'NULL', 'bigint'),
        "BigInt Test: NULL is null not type 'bigint'");
    equal(f('BigInt Test', [[0,1],[1,0]], 'matrix', 'bigint'),
        "BigInt Test: matrix is an array not type 'bigint'");
    equal(f('BigInt Test', 123, '', 'bigint'),
        "BigInt Test: A value is type 'number' not 'bigint'");
    equal(f('BigInt Test', BigInt, 'BigInt', 'bigint'),
        "BigInt Test: BigInt is type 'function' not 'bigint'");

    // typeStr is 'boolean'.
    equal(f('Boolean Test', true, 'flag', 'boolean'),
        false);
    equal(f('Boolean Test', false, 'flag', 'boolean'),
        false);
    equal(f('Boolean Test', Boolean(1), 'Boolean(1)', 'boolean'),
        false);
    equal(f('Boolean Test', null, 'nullish', 'boolean'),
        "Boolean Test: nullish is null not type 'boolean'");
    equal(f('Boolean Test', void 0, 'nullish', 'boolean'),
        "Boolean Test: nullish is type 'undefined' not 'boolean'");
    equal(f('Boolean Test', [], 'arr', 'boolean'),
        "Boolean Test: arr is an array not type 'boolean'");
    equal(f('Boolean Test', 'true', 'num', 'boolean'),
        "Boolean Test: num is type 'string' not 'boolean'");

    // typeStr is 'function'.
    equal(f('Function Test', ()=>{}, 'noop', 'function'),
        false);
    equal(f('Function Test', parseInt, 'parseInt()', 'function'),
        false);
    equal(f('Function Test', Function, 'Function', 'function'),
        false);
    equal(f('Function Test', Function("a","return a+1"), 'constructor', 'function'),
        false);
    equal(f('Function Test', class A {}, 'class A {}', 'function'),
        false);
    equal(f('Function Test', (()=>null)(), 'iifeNull', 'function'),
        "Function Test: iifeNull is null not type 'function'");
    equal(f('Function Test', [()=>0,()=>1], 'list-of-fns', 'function'),
        "Function Test: list-of-fns is an array not type 'function'");
    equal(f('Function Test', JSON, 'JSON', 'function'),
        "Function Test: JSON is type 'object' not 'function'");

    // typeStr is 'number'.
    equal(f('Number Test', 99, 'red balloons', 'number'),
        false);
    equal(f('Number Test', NaN, 'NaN', 'number'),
        false);
    equal(f('Number Test', -Infinity, 'minusInfinity', 'number'),
        false);
    equal(f('Number Test', null, 'nullNum', 'number'),
        "Number Test: nullNum is null not type 'number'");
    equal(f('Number Test', [[],1,true], 'allsorts', 'number'),
        "Number Test: allsorts is an array not type 'number'");
    equal(f('Number Test', BigInt(0), 'big zero', 'number'),
        "Number Test: big zero is type 'bigint' not 'number'");

    // typeStr is 'object'.
    equal(f('Object Test', {}, 'plain', 'object'),
        false);
    equal(f('Object Test', null, 'NULL', 'object'),
        false);
    equal(f('Object Test', [[0,1],[1,0]], 'matrix', 'object'),
        false);
    equal(f('Object Test', arguments, 'args', 'object'),
        false);
    equal(f('Object Test', Symbol(1), 'sym', 'object'),
        "Object Test: sym is type 'symbol' not 'object'");

    // typeStr is 'string'.
    equal(f('String Test', '', 'empty', 'string'),
        false);
    equal(f('String Test', 'foo', 'literal "foo"', 'string'),
        false);
    equal(f('String Test', String(99), 'String(99)', 'string'),
        false);
    equal(f('String Test', null, '', 'string'),
        "String Test: A value is null not type 'string'");
    equal(f('String Test', ['x','y','z'], 'letters', 'string'),
        "String Test: letters is an array not type 'string'");
    equal(f('String Test', true, 'boolTrue', 'string'),
        "String Test: boolTrue is type 'boolean' not 'string'");

    // typeStr is 'symbol'.
    equal(f('Symbol Test', Symbol(55), 'fiftyFive', 'symbol'),
        false);
    equal(f('Symbol Test', null, 'NULL', 'symbol'),
        "Symbol Test: NULL is null not type 'symbol'");
    equal(f('Symbol Test', Array(2), '`Array(2)`', 'symbol'),
        "Symbol Test: `Array(2)` is an array not type 'symbol'");
    equal(f('Symbol Test', {}.nope, 'num', 'symbol'),
        "Symbol Test: num is type 'undefined' not 'symbol'");

    // typeStr is 'undefined'.
    equal(f('Undefined Test', void 0, 'voidZero', 'undefined'),
        false);
    equal(f('Undefined Test', {}.nope, 'no such property', 'undefined'),
        false);
    equal(f('Undefined Test', undefined, 'keyword', 'undefined'),
        false);
    equal(f('Undefined Test', null, 'NULL', 'undefined'),
        "Undefined Test: NULL is null not type 'undefined'");
    equal(f('Undefined Test', [], 'emptyArray', 'undefined'),
        "Undefined Test: emptyArray is an array not type 'undefined'");
    equal(f('Undefined Test', Math, 'Math', 'undefined'),
        "Undefined Test: Math is type 'object' not 'undefined'");

}
