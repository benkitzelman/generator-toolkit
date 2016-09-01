
var _  = require('lodash'),
    co = require('co'),
    asyncFn

/*
Decorates a function so that it can either take a last parameter callback (node-style)
or returns a promise, if no callback is passed.

Dispatching to these variants is based on the number of passed arguments.
*/
module.exports.asyncFunction = asyncFn = function(fn) {

  return function() {
    var args = [].slice.call(arguments, 0)

    var passedCallback = function() {
      // if the number of passed arguments (args)
      // match the number of args in the method signature
      // of fn (fn.length)
      if(args.length == fn.length) return
      if(typeof(cb = _.last( args )) != 'function') return
      return cb
    }

    var callOkOn = function(theCallback) {
      return function() {
        var args = [].slice.call(arguments, 0)

        // next tick is required, so that errors don't get eaten
        process.nextTick( () => {
          return theCallback.apply(null, [ null ].concat( args ))
        })
      }
    }

    var callErrOn = function(theCallback) {
      return function() {
        var args = [].slice.call(arguments, 0)

        // next tick is required, so that errors don't get eaten
        process.nextTick(() => {
          theCallback.apply( this, args )
        })
      }
    }
    //--

    var boundFn = fn.bind.apply(fn, [ fn ].concat( args ) )
    var promise = co( function*() { return yield boundFn() } )

    // if a callback has not been passed - we can assume that the async fn is either
    // returning a promise, or is a generator - so we normalise it by using the
    // wrapping promise
    cb = passedCallback()
    if(!cb) return promise

    // if a callback is being used, we need to actually call the callback to
    // complete the execution
    return promise.then( callOkOn(cb), callErrOn(cb) )
  }
}

module.exports.asyncFunctionB = function(object, fnName) {
  return asyncFn( object[ fnName ].bind( object ) )
}