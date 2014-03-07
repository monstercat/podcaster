
var resolve = require('../lib/resolve');
var assert = require('better-assert');
var join = require('path').join;

describe('resolve', function(){
  it('items should resolve properly', function(){
    var rel = resolve("/a/b/c.json", "podcast/**/*.json");
    assert(rel === "/a/b/podcast/**/*.json");

    rel = resolve("c.json", "podcast/**/*.json");
    assert(rel === join(process.cwd(), "podcast/**/*.json"));

    rel = resolve("a/c.json", "**/*.json");
    assert(rel === join(process.cwd(), "a", "**/*.json"));
  });
});
