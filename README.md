# Generator Toolkit

A collection of utilities to allow generators to be called as Promises or Thunks, and to adapt Thunks and Promises to generators.


## Usage
```
$ npm install generator-toolkit --save

```

### asyncFunction
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

### yieldify
Converts Thunks to Generators

*Example:*

```
var g = require('generator-toolkit');

var thunk = function(cb) { cb( null, 'some result' ) };
var result = yield g.yieldify( thunk )() //== 'some result'
```

### yieldifyb
Converts Thunks to Generators bound to the relevant context

*Example:*

```
var g = require('generator-toolkit');

var example = Object.create({ 
  value : 'some value',
  thunk : function(cb) { cb( null, this.value ) }
});

var result = yield g.yieldifyb( example, 'thunk' )() //== 'some value'
```

### yieldableEndpoint
Allows writing of express endpoints as generators

*Example:*

```
var g = require('generator-toolkit');

app.get('/', g.yieldableEndpoint( function*(req, res, next) {
  result = yield someAsyncFunction();
  res.send( result );
}));
```
