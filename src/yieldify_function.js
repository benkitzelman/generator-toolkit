
var yieldifyNodeFunction = function*(context, fn, args) {
  return new Promise( function(resolve, reject) {

    var cb = function() {
      var err     = arguments[0],
          results = [].slice.call(arguments, 1)

      if(err) return reject( err )
      return resolve( results.length == 1 ? results[0] : results )
    }

    return fn.apply( context, (args || []).concat([ cb ]) )
  })
}

module.exports.yieldify = function(fn, context) {
  return function*() {
    var args = [].slice.call(arguments, 0)
    return yield yieldifyNodeFunction( context, fn, args )
  }
}

module.exports.yieldifyb = function(obj, fnName) {
  return function*() {
    var args = [].slice.call(arguments, 0)
    return yield yieldifyNodeFunction( obj, obj[ fnName ], args )
  }
}