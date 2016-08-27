var should        = require('should'),
    asyncFunction = require('../index').asyncFunction,
    asyncFunctionB = require('../index').asyncFunctionB

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

describe( 'Async Function Bind', function() {
  describe( 'When executing without error', function() {

    var expectedResult = { val: 'some value' }

    var subject = Object.create({
      value: expectedResult,
      testFn: function*() {
        return yield this.value
      }
    })

    subject.testFn = asyncFunctionB( subject, 'testFn' )

    it('should be callable as a thunk', function(done){
      subject.testFn( function(err, result) {
        should.not.exist( err )
        result.should.eql( expectedResult )
        done()

      });
    })

    it('should be callable as a promise', function(){
      subject.testFn().then( ( result ) => { result.should.eql( expectedResult ) } )
    })

    it('should be callable as a generator', function*(){
      (yield subject.testFn()).should.eql( expectedResult )
    })
  })

  describe( 'When executing WITH error', function() {

    var expectedErr = { val: 'some error' }

    var Klass = function() {
      this.err    = expectedErr
      this.testFn = asyncFunctionB(this, 'testFn')
    }

    Klass.prototype.testFn = function*() {
      var self = this
      return yield function() { throw self.err } ()
    }

    var subject = new Klass

    it('should be callable as a thunk', function(done){
      subject.testFn( function(err, result) {
        err.should.eql( expectedErr )
        done()
      });
    })

    it('should be callable as a promise', function(){
      subject.testFn().then( 
        ( result ) => { "Should not succeed".should.be.false },
        ( err )    => { err.should.eql(expectedErr) } 
      )
    })

    it('should be callable as a generator', function*(){
      try {
        yield subject.testFn()
        throw "no error was thrown"
      }
      catch( e ) { e.should.eql( expectedErr ) }
    })
  })
})