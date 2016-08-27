# Generator Toolkit

[![Build Status](https://travis-ci.org/benkitzelman/generator-toolkit.png)](https://travis-ci.org/benkitzelman/generator-toolkit)
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
  return yield { val: 'some value' }; // yield to a generator / promise / object
});

myAsyncFn( function(err, result) {
  // result == { val: 'some value' }
});

myAsyncFn()
  .then(
    function(result) { // result == { val: 'some value' } },
    function(err)    { ... }
  );

```

### asyncFunctionB
Allow a generator to be called as a Thunk or Promise bound to the given context

```
var g = require('generator-toolkit');

var MyObj = function() {
  this.value  = { val: 'some value'};
  this.testFn = g.asyncFunctionB(this, 'testFn');
}

MyObj.prototype.testFn = function*() {
  return yield value; // yield to a generator / promise / object
}

var subject = new MyObj


subject.testFn( function(err, result) {
  //result == this.value
});

subject.testFn()
  .then(
    function(result) { //result == this.value },
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
Converts Thunks to Generators bound to the given context

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
Allows writing of express endpoints as generators. If `errorHandler` is not specified, next is called (allows error handling middleware)

*Example:*

```
var g = require('generator-toolkit');

var errorHandler = function(req, res, next) { res.send(500, 'some error') }; // optional

app.get('/', g.yieldableEndpoint( function*(req, res, next) {
  result = yield someAsyncFunction();
  res.send( result );
}, errorHandler ));
```
