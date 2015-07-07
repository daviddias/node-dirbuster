var transform = require('parallel-transform')
var request = require('request')

request.defaults({
  maxSockets: Infinity
})

function testDir (url, foundDir) {
  var t = transform(1, {highWaterMark: 1}, checkDir)
  return t

  function checkDir (data, callback) {
    var path = data.toString('utf8').trim()

    // / avoid checking the same dir that was previously checked
    if (path.indexOf('/') === path.length - 1) {
      return callback()
    }

    var options = {}
    options.headers = {}
    options.path = '/' + path + '/'
    options.url = url + options.path
    options.followRedirect = false
    options.pool = false
    options.method = 'HEAD'

    request(options, verify)

    function verify (error, res, body) {
      if (error) {
        console.log('ERROR: ', options.path, error)
        return callback()
      }

      if (res.statusCode !== 404) {
        foundDir(path)
      }
      callback()
    }
  }
}

module.exports = testDir
