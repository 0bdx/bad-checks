import equal from '../private-methods/equal.js';

/**
 * @private
 * Validates that a value is exactly `null`.
 *
 * As a private method, isBadNull() assumes that the arguments have already been
 * checked for correctness, so it never throws an `Error`.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {null} value
 *     The value to check.
 * @param {string} identifier
 *     What to call `value` in the explanation, if invalid.
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
export default function isBadNull(
    msgPrefix,
    value,
    identifier,
) {
    if (value === null) return false;
    return `${msgPrefix}: ${identifier || 'A value'} ${
        Array.isArray(value)
            ? 'is an array not'
            : `is type '${typeof value}' not`
        } null`
    ;
}

/**
 * isBadNull() unit tests.
 * 
 * @param {isBadNull} f
 *     The `isBadNull()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function isBadNullTest(f) {

    // Incorrect usage does not throw an Error.
    // @ts-expect-error
    equal(f(),
        "undefined: A value is type 'undefined' not null");
    // @ts-expect-error
    equal(f(true),
        "true: A value is type 'undefined' not null");
    // @ts-expect-error
    equal(f('Incorrect Test', BigInt(55), null),
        "Incorrect Test: A value is type 'bigint' not null");
    equal(f(null, null, null),
        false);
    // @ts-expect-error
    equal(f(12345, void 0, true),
        "12345: true is type 'undefined' not null");

    // Typical usage.
    equal(f('Typical Usage', null, 'NULL'),
        false);
    equal(f('Typical Usage', void 0, '`void 0`'),
        "Typical Usage: `void 0` is type 'undefined' not null");
    // @ts-expect-error
    equal(f('Typical Usage', false),
        "Typical Usage: A value is type 'boolean' not null");
    // @ts-expect-error
    equal(f('Typical Usage', '', 'an empty string'),
        "Typical Usage: an empty string is type 'string' not null");
}
