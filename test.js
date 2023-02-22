import {
    isBadInteger,
    bindBadChecks,
} from './bad-checks.js';

import { bindBadChecksTest } from './src/bind-bad-checks.js';
import { isBadIntegerTest } from './src/is-bad-integer.js';

bindBadChecksTest(bindBadChecks);
isBadIntegerTest(isBadInteger);
