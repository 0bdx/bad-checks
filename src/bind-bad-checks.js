import equal from './private-methods/equal.js';
import throws from './private-methods/throws.js';

/** A string, or boolean false. Returned by `BadCheck` and `BoundBadCheck`.
 * @typedef {string|false} StringOrFalse */
/** A validator function fresh out of the library, before being bound.
 * @typedef {function(string, string[], ...any):StringOrFalse} BadCheck */
/** A validator function after being bound, ready to use.
 * @typedef {function(...any):StringOrFalse} BoundBadCheck */

/**
 * Prepares validation functions for use.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {...BadCheck} badChecks
 *     Any number of functions, to bind to `msgPrefix` and `checkMsgs`.
 * @returns {[string[], ...BoundBadCheck]}
 *     The first item of the returned array is `checkMsgs`. The remaining items
 *     are the passed-in functions, bound to `msgPrefix` and `checkMsgs`.
 * @throws
 *     Throws an `Error` if any of the arguments are invalid.
 */
export default function bindBadChecks(msgPrefix, ...badChecks) {
    const ep = 'Error: bindBadChecks():'; // error prefix

    // Validate the `msgPrefix` argument.
    if (msgPrefix === null) throw Error(`${ep} msgPrefix is null not 'string'`);
    if (typeof msgPrefix !== 'string') throw Error(`${ep
        } msgPrefix is type '${typeof msgPrefix}' not 'string'`);

    // Validate the `badChecks` argument.
    for (let i=0, len=badChecks.length; i<len; i++)
        if (typeof badChecks[i] !== 'function') throw Error(`${ep
            } badChecks[${i}] is type '${typeof badChecks[i]}' not 'function'`);

    // Create an empty array, which the bound functions can add messages to.
    const checkMsgs = [];

    // `checkMsgs` becomes the first item of the returned array. The remaining
    // items are all functions with `msgPrefix` and `checkMsgs` bound to them.
    return [
        checkMsgs,
        ...badChecks.map(badCheck => bindBadCheck(msgPrefix, checkMsgs, badCheck)),
    ];
}

/**
 * Prepares a validation function for use.
 * 
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {string[]} checkMsgs
 *     Stores a message for each invalid value that the function finds.
 *     Note that this array may be shared with other `BoundBadCheck` functions.
 * @param {BadCheck} badCheck
 *     The validation function which needs to be bound.
 * @return {BoundBadCheck}
 *     A new validation function, which has been bound and is ready to use.
 */
const bindBadCheck = (msgPrefix, checkMsgs, badCheck) =>
    (...args) => badCheck(msgPrefix, checkMsgs, ...args);

/**
 * bindBadChecks() unit tests.
 * 
 * @param {bindBadChecks} f
 *     The `bindBadChecks()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function bindBadChecksTest(f) {
    const ep = 'Error: bindBadChecks():'; // error prefix

    /** @type BadCheck */
    const spy1 = (pfx, msgs, a, b, c) => {
        msgs.push(`${pfx}: spy1 ${a}${b}${c}`);
        return false;
    };
    /** @type BadCheck */
    const spy2 = (pfx, msgs, a, b, c) => {
        msgs.push(`${pfx}: spy2 ${a}${b}${c}`);
        return `${pfx}: spy2 ${a}${b}${c}`;
    };

    // `msgPrefix` is an incorrect type.
    // @ts-expect-error
    throws(()=>f(),
        `${ep} msgPrefix is type 'undefined' not 'string'`);
    throws(()=>f(null),
        `${ep} msgPrefix is null not 'string'`);
    // @ts-expect-error
    throws(()=>f(true),
        `${ep} msgPrefix is type 'boolean' not 'string'`);

    // @ts-expect-error
    throws(()=>f('', 1e3),
        `${ep} badChecks[0] is type 'number' not 'function'`);

    // Arguments are ok, and bindBadChecks() returns an array whose first item
    // is an array of strings, and whose remaining items are all functions.
    equal(JSON.stringify(f('')),
        '[[]]');
    equal(JSON.stringify(f('foo()')),
        '[[]]');
    equal(Array.isArray(f('foo()', spy1)),
        true);
    equal(f('foo()', spy1).length,
        2);
    equal(Array.isArray(f('foo()', spy1)[0]),
        true);
    equal(typeof f('foo()', spy1)[1],
        'function');

    // Simulate typical usage.
    const [ checkMsgs, boundSpy1, boundSpy2 ] = f('foo()', spy1, spy2);
    equal(JSON.stringify(checkMsgs), '[]');
    const boundSpy1Result = boundSpy1('A', 'B', 'C');
    equal(boundSpy1Result, false);
    equal(JSON.stringify(checkMsgs), '["foo(): spy1 ABC"]');
    const boundSpy2Result = boundSpy2('A', 'B', 'C');
    equal(boundSpy2Result, 'foo(): spy2 ABC');
    equal(JSON.stringify(checkMsgs), '["foo(): spy1 ABC","foo(): spy2 ABC"]');
}
