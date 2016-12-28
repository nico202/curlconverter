var util = require('../util')
var jsesc = require('jsesc')
var querystring = require('querystring')

require('string.prototype.startswith')

var toJulia = function (curlCommand) {
  var request = util.parseCurlCommand(curlCommand)
  var cookieDict
  if (request.cookies) {
    cookieDict = 'cookies = Dict{}(\n'
    for (var cookieName in request.cookies) {
      cookieDict += '    "' + cookieName + '"=> "' + request.cookies[cookieName] + '",\n'
    }
    cookieDict += ')\n'
  }
  var headerDict
  if (request.headers) {
    headerDict = 'headers = Dict{}(\n'
    for (var headerName in request.headers) {
      headerDict += '    "' + headerName + '"=> "' + request.headers[headerName] + '",\n'
    }
    headerDict += ')\n'
  }

  var dataString
  var filesString
  if (request.data) {
    if (request.data.startsWith('@')) {
      var filePath = request.data.slice(1)
        if (request.isDataBinary) {
            // ";" prevents the "Error showing value of type UTF8String"
        dataString = 'data = readall(open("' + filePath + '", "r"));'
      } else {
        dataString = 'data = readall(open("' + filePath + '", "r"))'
      }
    } else {
      var parsedQueryString = querystring.parse(request.data)
      dataString = 'data = Dict{}(\n'
      var dataCount = Object.keys(parsedQueryString).length
        if (dataCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]]) {
            var escapedData = request.data.replace(/"/g, '\\"')
            dataString = 'data = "' + escapedData + '"\n'
      } else {
        var dataIndex = 0
        for (var key in parsedQueryString) {
            var value = parsedQueryString[key]
            var escapedKey = key.replace(/"/g, '\\"')
            
            if (value.constructor === Array) {
                var escapedValue = ''
                for (var i in value) {
                    escapedValue += i == 0 ? '[' : ', '
                    escapedValue += '"' + value[i].replace(/"/g, '\\\"') + '"'
                }
                escapedValue += ']'
            } else {
                var escapedValue = '"' + value.replace(/"/g, '\\\"') + '"'
            }
          dataString += '  "' + escapedKey + '"=> ' + escapedValue
          if (dataIndex < dataCount - 1) {
            dataString += ',\n'
          }
          dataIndex++
        }
        dataString += '\n)\n'
      }
    }
  } else if (request.multipartUploads) {
    filesString = 'files = Dict{}(\n'
    var filesIndex = 0
    var filesCount = Object.keys(request.multipartUploads).length
    for (var multipartKey in request.multipartUploads) {
      var multipartValue = request.multipartUploads[multipartKey]
      if (multipartValue.startsWith('@')) {
        filesString += '    "' + multipartKey + '"=> open("' + multipartValue.slice(1) + '")'
      } else {
        filesString += '    "' + multipartKey + '"=> "' + multipartValue + '"'
      }
      if (filesIndex < filesCount - 1) {
        filesString += ',\n'
      }
      filesIndex++
    }
    filesString += '\n)\n'
  }
    var requestLine = 'Requests.' + request.method + '("'
    if (request.auth) {
        var splitUrl = request.url.split("://")
        requestLine += splitUrl[0] + "://" + request.auth + "@"
        requestLine += splitUrl[1]
    } else {
        requestLine += request.url
    }
    requestLine += '"'
    
    if (request.headers) {
        requestLine += ', headers=headers'
  }
  if (request.cookies) {
    requestLine += ', cookies=cookies'
  }
  if (request.data) {
    requestLine += ', data=data'
  } else if (request.multipartUploads) {
    requestLine += ', files=files'
  }
  if (request.insecure) {
    requestLine += ', tls_conf=Requests.get_default_tls_config(false)'
  }
  requestLine += ')'

  var juliaCode = ''
  juliaCode += 'import Requests\n\n'
  if (cookieDict) {
    juliaCode += cookieDict + '\n'
  }
  if (headerDict) {
    juliaCode += headerDict + '\n'
  }
  if (dataString) {
    juliaCode += dataString + '\n'
  } else if (filesString) {
    juliaCode += filesString + '\n'
  }
  juliaCode += requestLine

  return juliaCode
}

module.exports = toJulia
