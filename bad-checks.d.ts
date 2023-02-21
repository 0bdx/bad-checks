/**
 * A string, or boolean false. Returned by `BadCheck` and `BoundBadCheck`.
 */
export type StringOrFalse = string | false;
/**
 * A validator function fresh out of the library, before being bound.
 */
export type BadCheck = (arg0: string, arg1: string[], ...args: any[]) => StringOrFalse;
/**
 * A validator function after being bound, ready to use.
 */
export type BoundBadCheck = (...args: any[]) => StringOrFalse;
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
export function bindBadChecks(msgPrefix: string, ...badChecks: BadCheck[]): [string[], ...BoundBadCheck];
