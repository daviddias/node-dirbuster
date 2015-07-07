var stream = require('stream')

function createPathStream () {
  var ps = new stream.Transform({
    objectMode: true
  })

  ps._transform = function (data, enc, callback) {
    callback(null, data)
  }

  ps.pause()

  ps.setMaxListeners(0)

  return ps
}

module.exports = createPathStream
