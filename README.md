# @0bdx/bad-checks

Utilities for validating values in 0bdx apps, libraries and websites.

∅&nbsp; __Version:__ 0.0.1  
∅&nbsp; __NPM:__ <https://www.npmjs.com/package/@0bdx/bad-checks>  
∅&nbsp; __Repo:__ <https://github.com/0bdx/bad-checks>  
∅&nbsp; __Homepage:__ <https://0bdx.com/bad-checks>

@TODO add an overview

### Typical usage:

```js
import bindBadChecks, { isBadInteger } from '@0bdx/bad-checks';

function sayOk(n) {
    const [ checkMsgs, isBadInt ] = bindBadChecks('sayOk()', isBadInteger);
    if (isBadInt(n, 'n', 0, 2000)) return checkMsgs;
    return 'ok!';
}

sayOk(null); // sayOk(): 'n' is null not type 'number'
sayOk(7777); // sayOk(): 'n' 7777 is greater than 2000
sayOk(1234); // ok!
```
