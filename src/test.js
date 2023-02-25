// Note that private methods like `isBadType()` ARE tested here.

import {
    isBadType,
} from './utilities/index.js';
import { isBadTypeTest } from './utilities/is-bad-type.js';

import {
    isBadInteger,
    bindBadChecks,
} from './index.js';
import { bindBadChecksTest } from './bind-bad-checks.js';
import { isBadIntegerTest } from './is-bad-integer.js';

isBadTypeTest(isBadType);
bindBadChecksTest(bindBadChecks);
isBadIntegerTest(isBadInteger);
