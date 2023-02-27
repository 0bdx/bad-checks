// Note that private methods like `isBadType()` are NOT tested here.

import {
    bindBadChecks,
    isBadBoolean,
    isBadInteger,
} from './bad-checks.js';

import { bindBadChecksTest } from './src/bind-bad-checks.js';
import { isBadBooleanTest } from './src/is-bad-boolean.js';
import { isBadIntegerTest } from './src/is-bad-integer.js';

bindBadChecksTest(bindBadChecks);
isBadBooleanTest(isBadBoolean);
isBadIntegerTest(isBadInteger);
