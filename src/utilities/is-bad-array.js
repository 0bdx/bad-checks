import equal from '../private-methods/equal.js';

/**
 * @private
 * Validates a value using JavaScript's native `Array.isArray()`.
 *
 * As a private method, isBadArray() assumes that the arguments have already
 * been checked for correctness, so it never throws an `Error`.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {any[]} value
 *     The value to check.
 * @param {string} identifier
 *     What to call `value` in the explanation, if invalid.
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
export default function isBadArray(
    msgPrefix,
    value,
    identifier,
) {
    if (Array.isArray(value)) return false;
    return `${msgPrefix}: ${identifier || 'A value'} ${
        value === null
            ? 'is null not'
            : `is type '${typeof value}' not`
        } an array`
    ;
}

/**
 * isBadArray() unit tests.
 * 
 * @param {isBadArray} f
 *     The `isBadArray()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function isBadArrayTest(f) {

    // Incorrect usage does not throw an Error.
    // @ts-expect-error
    equal(f(),
        "undefined: A value is type 'undefined' not an array");
    // @ts-expect-error
    equal(f(99),
        "99: A value is type 'undefined' not an array");
    // @ts-expect-error
    equal(f('Incorrect Test', {}, 99),
        "Incorrect Test: 99 is type 'object' not an array");
    // @ts-expect-error
    equal(f(null, [], 0),
        false);
    // @ts-expect-error
    equal(f('Incorrect Test', void 0, 98765),
        "Incorrect Test: 98765 is type 'undefined' not an array");

    // Typical usage.
    equal(f('Typical Usage', [], 'emptyArray'),
        false);
    equal(f('Typical Usage', Array(5), 'array object'),
        false);
    equal(f('Typical Usage', new Array(), 'new array object'),
        false);
    equal(f('Typical Usage', null, 'NULL'),
        "Typical Usage: NULL is null not an array");
    // @ts-expect-error
    equal(f('Typical Usage', '[]'),
        "Typical Usage: A value is type 'string' not an array");
    // @ts-expect-error
    equal(f('Typical Usage', arguments, 'The `arguments` object'),
        "Typical Usage: The `arguments` object is type 'object' not an array");
}
