# sys-prefix-promise

[![Build Status](https://travis-ci.org/rgbkrk/sys-prefix-promise.svg)](https://travis-ci.org/rgbkrk/sys-prefix-promise)

Python's sys.prefix, handed back as a Promise

```
npm install sys-prefix-promise
```

## Usage

```javascript
> var sysPrefixPromise = require('sys-prefix-promise')
> sysPrefixPromise().then(console.log)
/usr/local/Cellar/python/2.7.11/Frameworks/Python.framework/Versions/2.7
```

