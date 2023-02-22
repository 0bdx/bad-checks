import {
    isBadInteger,
    bindBadChecks,
} from './index.js';

import { bindBadChecksTest } from './bind-bad-checks.js';
import { isBadIntegerTest } from './is-bad-integer.js';

bindBadChecksTest(bindBadChecks);
isBadIntegerTest(isBadInteger);
