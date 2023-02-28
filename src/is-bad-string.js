import equal from './private-methods/equal.js';
import throws from './private-methods/throws.js';
import { isBadType } from './utilities/index.js';

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
export default function isBadString(
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

/**
 * isBadString() unit tests.
 * 
 * @param {isBadString} f
 *     The `isBadString()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function isBadStringTest(f) {
    const ep = 'Error: isBadString():'; // error prefix

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

    // Create `checkMsgs`, which will have each test result pushed into it.
    const checkMsgs = [];
    equal(checkMsgs.length, 0);

    // Recognises that `null` is not type 'object'.
    equal(f('a', checkMsgs, null, 'b'),
        "a: b is null not type 'string'");
    equal(checkMsgs[0],
        "a: b is null not type 'string'");
    equal(checkMsgs.length, 1);

    // Recognises that an array is not type 'object'.
    // @ts-expect-error
    equal(f('c', checkMsgs, [true], 'd'),
        "c: d is an array not type 'string'");
    equal(checkMsgs[1],
        "c: d is an array not type 'string'");
    equal(checkMsgs.length, 2);

    // Identifies a plain object as type 'object'.
    // @ts-expect-error
    equal(f('e', checkMsgs, {}, 'f'),
        "e: f is type 'object' not 'string'");
    equal(checkMsgs[2],
        "e: f is type 'object' not 'string'");
    equal(checkMsgs.length, 3);

    // Validates literal and constructed booleans.
    equal(f('g', checkMsgs, '', 'h'), false);
    equal(checkMsgs.length, 3);
    equal(f('i', checkMsgs, String(360), 'j'), false);
    equal(checkMsgs.length, 3);
}
