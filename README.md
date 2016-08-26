# Generator Toolkit

A collection of utilities to allow generators to be called as Promises or Thunks, and to adapt Thunks and Promises to generators.


## asyncFunction
Allow a generator to be called as a Thunk or Promise

```
var g = require('generator-toolkit');

var myAsyncFn = g.asyncFunction( function*() {
  return yield { val: 'some value' };
});

myAsyncFn( function(err, result) {
  ...
});

myAsyncFn()
  .then(
    function(result) { ... },
    function(err)    { ... }
  )

```

## yieldableEndpoint
Allows writing of express endpoints as generators

*Example:*

```
var g = require('generator-toolkit');

app.get('/', g.yieldableEndpoint( function*(req, res, next) {
  result = yield someAsyncFunction();
  res.send( result );
}));
```