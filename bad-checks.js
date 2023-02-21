/**
 * https://www.npmjs.com/package/bad-checks
 * @version 0.0.1
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
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
 *     Added to the start of every check-message, typically a function name.
 * @param {...BadCheck} badChecks
 *     Any number of functions, to bind to `msgPrefix` and `checkMsgs`.
 * @returns {[string[], ...BoundBadCheck]}
 *     The first item of the returned array is `checkMsgs`. The remaining items
 *     are the passed-in functions, bound to `msgPrefix` and `checkMsgs`.
 * @throws
 *     Throws an `Error` if any of the arguments are invalid.
 */
function bindBadChecks(msgPrefix, ...badChecks) {
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
 *     Added to the start of every check-message, typically a function name.
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

export { bindBadChecks };
