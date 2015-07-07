var Transform = require('stream').Transform

module.exports = function () {
  var cleaner = new Transform({objectMode: false})

  cleaner._transform = function (chunk, encoding, done) {
    var data = chunk.toString()

    if (data.indexOf('#') === -1) {
      if (data.trim().length < 1) {
        return done()
      }
      this.push(data)
      done()
    } else {
      done()
    }
  }

  return cleaner

}
