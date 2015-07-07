var Transform = require('stream').Transform

module.exports = function createToJSON () {
  var toJSON = new Transform({objectMode: false})

  toJSON._transform = function (chunk, encoding, done) {
    this.push(chunk)
    done()
  }

  return toJSON
}
