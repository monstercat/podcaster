
var join = require('path').join;
var podcast = require('..');
var assert = require('better-assert');

describe('config', function(){

  it('should read a config', function(done){
    var config = join(__dirname, 'data/podcast.json');
    podcast(config, function(err, pc){
      assert(!err);
      assert(pc);
      assert(pc.config);
      assert(pc.items);
      assert(pc.items.length > 0);
      assert(pc.items[0].itunesAuthor === "Monstercat");
      assert(pc.xml);
      done();
    });
  });

  it('items should resolve properly', function(){
    var rel = podcast.resolve("/a/b/c.json", "podcast/**/*.json");
    assert(rel === "/a/b/podcast/**/*.json");

    rel = podcast.resolve("c.json", "podcast/**/*.json");
    assert(rel === join(process.cwd(), "podcast/**/*.json"));

    rel = podcast.resolve("a/c.json", "**/*.json");
    assert(rel === join(process.cwd(), "a", "**/*.json"));
  });

  it('globs works ok', function(done){
    var p = join(__dirname, "data/**/*.json");
    podcast.globs([p], function(err, files){
      assert(!err);
      assert(files);
      assert(Array.isArray(files) === true);
      assert(files.length > 1);
      assert(files.every(function(f) { return /.json$/.test(f); }) === true);
      done();
    });
  });

});
