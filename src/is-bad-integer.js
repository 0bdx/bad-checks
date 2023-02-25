import equal from './private-methods/equal.js';
import throws from './private-methods/throws.js';

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
export default function isBadInteger(
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
 * isBadInteger() unit tests.
 * 
 * @param {isBadInteger} f
 *     The `isBadInteger()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function isBadIntegerTest(f) {
    const ep = 'Error: isBadInteger():'; // error prefix

    // `msgPrefix` is an incorrect type.
    // @ts-expect-error
    throws(()=>f(),
        `${ep} msgPrefix is type 'undefined' not type 'string'`);
    // @ts-expect-error
    throws(()=>f(null),
        `${ep} msgPrefix is null not type 'string'`);
    // @ts-expect-error
    throws(()=>f([]),
        `${ep} msgPrefix is an array not type 'string'`);
    // @ts-expect-error
    throws(()=>f(123),
        `${ep} msgPrefix is type 'number' not type 'string'`);

    // `checkMsgs` is an incorrect type.
    // @ts-expect-error
    throws(()=>f(''),
        `${ep} checkMsgs is type 'undefined' not an array`);
    // @ts-expect-error
    throws(()=>f('', null),
        `${ep} checkMsgs is null not an array`);
    // @ts-expect-error
    throws(()=>f('', {}),
        `${ep} checkMsgs is type 'object' not an array`);

    // `checkMsgs` contains an incorrect type.
    // @ts-expect-error
    throws(()=>f('', [true]),
        `${ep} checkMsgs[0] is type 'boolean' not type 'string'`);
    // @ts-expect-error
    throws(()=>f('', ['', null, []]),
        `${ep} checkMsgs[1] is null not type 'string'`);
    // @ts-expect-error
    throws(()=>f('', ['', 'ok', []]),
        `${ep} checkMsgs[2] is an array not type 'string'`);

}
