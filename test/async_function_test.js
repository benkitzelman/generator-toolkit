
var should        = require('should'),
	  asyncFunction = require('../index').asyncFunction


describe( 'Async Function', function() {
  describe( 'When executing without error', function() {

    var expectedResult = { val: 'some result' }

    var subject = asyncFunction( function*() {
      return yield expectedResult
    })

    it('should be callable as a thunk', function(done){
      subject( function(err, result) {
        should.not.exist( err )
        result.should.eql( expectedResult )
        done()

      });
    })

    it('should be callable as a promise', function(){
      subject().then( ( result ) => { result.should.eql( expectedResult ) } )
    })

    it('should be callable as a generator', function*(){
      (yield subject()).should.eql( expectedResult )
    })
  })

  describe( 'When executing WITH error', function() {

    var expectedErr = { val: 'some error' }

    var subject = asyncFunction( function*() {
      return yield function() { throw expectedErr } ()
    })

    it('should be callable as a thunk', function(done){
      subject( function(err, result) {
        err.should.eql( expectedErr )
        done()
      });
    })

    it('should be callable as a promise', function(){
      subject().then( 
        ( result ) => { "Should not succeed".should.be.false },
        ( err )    => { err.should.eql(expectedErr) } 
      )
    })

    it('should be callable as a generator', function*(){
      try {
        yield subject()
        throw "no error was thrown"
      }
      catch( e ) { e.should.eql( expectedErr ) }
    })
  })
})