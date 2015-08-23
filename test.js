//test-pretty-path.js

var should = require("should")
var mocha = require("mocha")
var ppath = require('./index')


describe('Pretty-path', function() {

  var options = {

    current_dir: '.',
    super_dir: '..',
    delimeter: '/',
    root: '',
    aliases: {
      '~': ''
    }
  }

  var paths = {
    'x/y/z': './x/y/z',
    '~/x/y/z': '/x/y/z',
    '/x/y/z': '/x/y/z',
    '////x/y/z': '/x/y/z',
    '././././x/y/z': './x/y/z',
    '.././././././x/y/z': '../x/y/z',
    './///x/y///z': './x/y/z',
    '.././x/y/z': '.././x/y/z',
    '.': '.',
    '..': '..'
  }


  it("should correctly format paths", function() {

    Object.keys(paths).forEach(function(path) {

      var shouldEql = paths[path]

      //This just tests that a passed options doesn't cause any failures
      var pped = ppath(path, options)

      console.log("     \'" + path + "\' ===> \'" + pped + "\', should: \'" + shouldEql + '\'')

      pped.should.equal(shouldEql)

    })

  })
})
