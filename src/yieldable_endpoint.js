var co = require('co')

module.exports = function(endpointFn, onErrorFn, one, two) {
  return function(req, res, next) {
    var errorHandler = onErrorFn || next

    co(function* (){
      return yield endpointFn( req, res, next )

    }).catch( function(err) {
      errorHandler(err, req, res)
    })
  }
}