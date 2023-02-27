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
 *     Added to the start of every explanation, typically a function name.
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
function isBadType(
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
 * Validates a boolean.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {string[]} checkMsgs
 *     Stores a message for each invalid value that the function finds.
 *     Note that this array may be shared with other `BoundBadCheck` functions.
 * @param {boolean} value
 *     The value to check.
 * @param {string} [identifier='']
 *     What to call `value` in the explanation, if invalid. Defaults to "".
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 * @throws
 *     Throws an `Error` if any of the arguments are incorrect.
 */
function isBadBoolean(
    msgPrefix,
    checkMsgs,
    value,
    identifier = '',
) {
    const ep = 'Error: isBadBoolean():'; // error prefix

    // Throw an `Error` if the `msgPrefix` argument is incorrect.
    if (typeof msgPrefix !== 'string') {
        if (msgPrefix === null) throw Error(`${ep
            } msgPrefix is null not type 'string'`);
        if (Array.isArray(msgPrefix)) throw Error(`${ep
            } msgPrefix is an array not type 'string'`);
        throw Error(`${ep
            } msgPrefix is type '${typeof msgPrefix}' not type 'string'`);
    }

    // Throw an `Error` if the `checkMsgs` argument is incorrect.
    if (!Array.isArray(checkMsgs)) {
        if (checkMsgs === null) throw Error(`${ep
            } checkMsgs is null not an array`);
        throw Error(`${ep
            } checkMsgs is type '${typeof checkMsgs}' not an array`);
    } else {
        for (let i=0, len=checkMsgs.length; i<len; i++) {
            if (typeof checkMsgs[i] !== 'string') {
                const item = checkMsgs[i];
                if (item === null) throw Error(`${ep
                    } checkMsgs[${i}] is null not type 'string'`);
                if (Array.isArray(item)) throw Error(`${ep
                    } checkMsgs[${i}] is an array not type 'string'`);
                throw Error(`${ep
                    } checkMsgs[${i}] is type '${typeof item}' not type 'string'`);
            }
        }
    }

    // Use the isBadType() utility to check whether `value` is a boolean.
    // If not, store the check-message in the shared `checkMsgs` array.
    const checkResult = isBadType(msgPrefix, value, identifier, 'boolean');
    if (checkResult) checkMsgs.push(checkResult);

    // If `value` is a boolean return false, otherwise return the check-message.
    return checkResult;
}

/**
 * Validates an integer.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {string[]} checkMsgs
 *     Stores a message for each invalid value that the function finds.
 *     Note that this array may be shared with other `BoundBadCheck` functions.
 * @param {number} value
 *     The value to check.
 * @param {string} [identifier='']
 *     What to call `value` in the explanation, if invalid. Defaults to "".
 * @param {number} [min=-Infinity]
 *     The minimum `value` is allowed to be. Defaults to minus infinity.
 * @param {number} [max=Infinity]
 *     The maximum `value` is allowed to be. Defaults to infinity.
 * @param {number} [divisibleBy=1]
 *     `value` must divisible by this number, with no remainder. Defaults to 1.
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 * @throws
 *     Throws an `Error` if any of the arguments are incorrect.
 */
function isBadInteger(
    msgPrefix,
    checkMsgs,
    value,
    identifier = '',
    min = -Infinity,
    max = Infinity,
    divisibleBy = 1,
) {
    const ep = 'Error: isBadInteger():'; // error prefix

    // Throw an `Error` if the `msgPrefix` argument is incorrect.
    if (typeof msgPrefix !== 'string') {
        if (msgPrefix === null) throw Error(`${ep
            } msgPrefix is null not type 'string'`);
        if (Array.isArray(msgPrefix)) throw Error(`${ep
            } msgPrefix is an array not type 'string'`);
        throw Error(`${ep
            } msgPrefix is type '${typeof msgPrefix}' not type 'string'`);
    }

    // Throw an `Error` if the `checkMsgs` argument is incorrect.
    if (!Array.isArray(checkMsgs)) {
        if (checkMsgs === null) throw Error(`${ep
            } checkMsgs is null not an array`);
        throw Error(`${ep
            } checkMsgs is type '${typeof checkMsgs}' not an array`);
    } else {
        for (let i=0, len=checkMsgs.length; i<len; i++) {
            if (typeof checkMsgs[i] !== 'string') {
                const item = checkMsgs[i];
                if (item === null) throw Error(`${ep
                    } checkMsgs[${i}] is null not type 'string'`);
                if (Array.isArray(item)) throw Error(`${ep
                    } checkMsgs[${i}] is an array not type 'string'`);
                throw Error(`${ep
                    } checkMsgs[${i}] is type '${typeof item}' not type 'string'`);
            }
        }
    }

    return false;
}

/**
 * Validates a string.
 *
 * @param {string} msgPrefix
 *     Added to the start of every explanation, typically a function name.
 * @param {string[]} checkMsgs
 *     Stores a message for each invalid value that the function finds.
 *     Note that this array may be shared with other `BoundBadCheck` functions.
 * @param {string} value
 *     The value to check.
 * @param {string} [identifier='']
 *     What to call `value` in the explanation, if invalid. Defaults to "".
 * @returns {string|false}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 * @throws
 *     Throws an `Error` if any of the arguments are incorrect.
 */
function isBadString(
    msgPrefix,
    checkMsgs,
    value,
    identifier = '',
) {
    const ep = 'Error: isBadString():'; // error prefix

    // Throw an `Error` if the `msgPrefix` argument is incorrect.
    if (typeof msgPrefix !== 'string') {
        if (msgPrefix === null) throw Error(`${ep
            } msgPrefix is null not type 'string'`);
        if (Array.isArray(msgPrefix)) throw Error(`${ep
            } msgPrefix is an array not type 'string'`);
        throw Error(`${ep
            } msgPrefix is type '${typeof msgPrefix}' not type 'string'`);
    }

    // Throw an `Error` if the `checkMsgs` argument is incorrect.
    if (!Array.isArray(checkMsgs)) {
        if (checkMsgs === null) throw Error(`${ep
            } checkMsgs is null not an array`);
        throw Error(`${ep
            } checkMsgs is type '${typeof checkMsgs}' not an array`);
    } else {
        for (let i=0, len=checkMsgs.length; i<len; i++) {
            if (typeof checkMsgs[i] !== 'string') {
                const item = checkMsgs[i];
                if (item === null) throw Error(`${ep
                    } checkMsgs[${i}] is null not type 'string'`);
                if (Array.isArray(item)) throw Error(`${ep
                    } checkMsgs[${i}] is an array not type 'string'`);
                throw Error(`${ep
                    } checkMsgs[${i}] is type '${typeof item}' not type 'string'`);
            }
        }
    }

    // Use the isBadType() utility to check whether `value` is a string.
    // If not, store the check-message in the shared `checkMsgs` array.
    const checkResult = isBadType(msgPrefix, value, identifier, 'string');
    if (checkResult) checkMsgs.push(checkResult);

    // If `value` is a string return false, otherwise return the check-message.
    return checkResult;
}

export { bindBadChecks, isBadBoolean, isBadInteger, isBadString };
