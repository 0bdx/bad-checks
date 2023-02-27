// Note that private methods like `isBadType()` ARE tested here.

import {
    isBadType,
} from './utilities/index.js';
import { isBadTypeTest } from './utilities/is-bad-type.js';

import {
    isBadBoolean,
    isBadInteger,
    bindBadChecks,
} from './index.js';
import { bindBadChecksTest } from './bind-bad-checks.js';
import { isBadBooleanTest } from './is-bad-boolean.js';
import { isBadIntegerTest } from './is-bad-integer.js';

isBadTypeTest(isBadType);

bindBadChecksTest(bindBadChecks);
isBadBooleanTest(isBadBoolean);
isBadIntegerTest(isBadInteger);
