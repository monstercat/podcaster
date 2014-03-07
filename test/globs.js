
var globs = require("../lib/globs");
var join = require('path').join;
var assert = require('better-assert');

describe('globs', function(){
  it('works ok', function(done){
    var p = join(__dirname, "data/**/*.json");
    globs([p], function(err, files){
      assert(!err);
      assert(files);
      assert(Array.isArray(files) === true);
      assert(files.length > 1);
      assert(files.every(function(f) { return /.json$/.test(f); }) === true);
      done();
    });
  });
});
