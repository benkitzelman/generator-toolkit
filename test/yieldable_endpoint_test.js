var should = require('should'),
    sinon  = require('sinon'),
    yieldableEndpoint = require('../index').yieldableEndpoint,
    sandbox = null

describe( 'Yieldable Endpoint', function() {
  var resSpy = nextSpy = null

  beforeEach( () => { sandbox = sinon.sandbox.create() })
  afterEach(  () => { sandbox.restore() })

  var callEndpoint = function(endpoint){
    return function(done) {
      var args = {
        req  : {},
        res  : { send: function() { done() } },
        next : function() { done() }
      }

      resSpy  = sandbox.spy(args.res, 'send')
      nextSpy = sandbox.spy(args, 'next')

      endpoint(args.req, args.res, args.next)
    }
  }

  var expectedResponse = { val: 'some value' },
      expectedError    = { val: 'some error' }

  describe( 'when no error is thrown in the endpoint', function() {

    var endpoint = yieldableEndpoint( function*(req, res, next) {
      res.send( yield expectedResponse )
    })

    beforeEach( callEndpoint( endpoint ) )

    it('should be yieldable', function() {
      resSpy.callCount.should.eql(1)
      resSpy.args[0].should.eql([ expectedResponse ])
    })

    it('should NOT call next Fn (error middleware)', function() {
      nextSpy.callCount.should.eql(0)
    })
  })

  describe( 'when an error is thrown in the endpoint', function() {

    var endpoint = yieldableEndpoint( function*(req, res, next) {
      yield {} // ensure yields are considered
      throw expectedError
      res.send( yield expectedResponse )
    })

    beforeEach( callEndpoint( endpoint ) )

    it( 'should call next Fn (error middleware)', function() {
      nextSpy.callCount.should.eql(1)
      nextSpy.args[0][0].should.eql(expectedError)
    })
  })
})