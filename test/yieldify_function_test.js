var should    = require('should'),
    yieldify  = require('../index').yieldify,
    yieldifyb = require('../index').yieldifyb


describe( 'yieldify', function() {
  describe( 'a successful thunk', function() {
    var subject = function(someStr, cb) {
      return cb(null, 'some result ' + someStr)
    }

    it( 'should convert to a generator', function*() {
      (yield yieldify( subject )("from yield") ).should.eql('some result from yield')
    })
  })

  describe( 'a thunk returning errors', function() {
    var subject = function(cb) {
      return cb('some error')
    }

    it( 'should throw the error', function*() {
      fn = yieldify( subject )

      try {
        yield fn()
        throw new Error("Should have thrown an error")

      } catch (e) {
        e.should.eql('some error')
      }
    })
  })
})

describe( 'yieldifyb', function() {
  describe( 'a successful thunk', function() {
    var subject = Object.create({
      value: 'some value',
      thunk: function(someStr, cb) {
        return cb(null, ['some result', someStr, this.value].join(' '))
      }
    })

    it( 'should convert to a generator', function*() {
      (yield yieldifyb( subject, 'thunk' )("from yield with") ).should.eql('some result from yield with some value')
    })
  })

  describe( 'a thunk returning errors', function() {
    var subject = Object.create({
      value: 'some value',
      thunk: function(cb) {
        return cb('some error')
      }
    })

    it( 'should throw the error', function*() {
      fn = yieldifyb( subject, 'thunk' )

      try {
        yield fn()
        throw new Error("Should have thrown an error")

      } catch (e) {
        e.should.eql('some error')
      }
    })
  })
})
