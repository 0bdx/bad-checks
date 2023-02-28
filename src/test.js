// Note that private methods like `isBadType()` ARE tested here.

import {
    isBadType,
} from './utilities/index.js';
import { isBadTypeTest } from './utilities/is-bad-type.js';

import bindBadChecks, {
    isBadBoolean,
    isBadInteger,
    isBadString,
} from './index.js';
import { bindBadChecksTest } from './bind-bad-checks.js';
import { isBadBooleanTest } from './is-bad-boolean.js';
import { isBadIntegerTest } from './is-bad-integer.js';
import { isBadStringTest } from './is-bad-string.js';

isBadTypeTest(isBadType);

bindBadChecksTest(bindBadChecks);
isBadBooleanTest(isBadBoolean);
isBadIntegerTest(isBadInteger);
isBadStringTest(isBadString);
