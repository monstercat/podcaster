
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

});
