'use strict'

var toPython = require('./generators/python.js')
var toNode = require('./generators/node.js')
var toPhp = require('./generators/php.js')
var toJulia = require('./generators/julia.js')

module.exports = {
  toPhp: toPhp,
  toPython: toPython,
  toNode: toNode,
  toJulia: toJulia
}
