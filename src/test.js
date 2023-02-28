// Note that private methods like `isBadType()` ARE tested here.

import {
    isBadArray,
    isBadNull,
    isBadType,
} from './utilities/index.js';
import { isBadArrayTest } from './utilities/is-bad-array.js';
import { isBadNullTest } from './utilities/is-bad-null.js';
import { isBadTypeTest } from './utilities/is-bad-type.js';

import bindBadChecks, {
    isBadBoolean,
    isBadInteger,
    isBadString,
    isBadStringArray,
} from './index.js';
import { bindBadChecksTest } from './bind-bad-checks.js';
import { isBadBooleanTest } from './is-bad-boolean.js';
import { isBadIntegerTest } from './is-bad-integer.js';
import { isBadStringTest } from './is-bad-string.js';
import { isBadStringArrayTest } from './is-bad-string-array.js';

isBadArrayTest(isBadArray);
isBadNullTest(isBadNull);
isBadTypeTest(isBadType);

bindBadChecksTest(bindBadChecks);
isBadBooleanTest(isBadBoolean);
isBadIntegerTest(isBadInteger);
isBadStringTest(isBadString);
// isBadStringArrayTest(isBadStringArray);
