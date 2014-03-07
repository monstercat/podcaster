
var path = require('path');
var debug = require('debug')('monstercat-podcast');
var fs = require('fs');
var async = require('async');
var Rss = require('rss');
var glob = require('glob');
var extend = require('xtend');

var exports = module.exports = podcast;

/**
 * Parse a file from JSON 
 *
 * @param {String} json file path
 * @param {Function} result callback (err, obj)
 * @api public
 */

exports.parse = function(target, done) {
  fs.readFile(target, function(err, data){
    if (err) return done(err);
    var parsed;

    try {
      parsed = JSON.parse(data.toString());
    } 
    catch (e) {
      return done(e);
    }

    done(null, parsed);
  });
};


/**
 * Glob multiple glob strings
 *
 * @param {Array} an array of glob strings
 * @param {Function} result callback (err, paths)
 * @api public
 */

exports.globs = function(gs, done){
  function step(memo, g, done) {
    glob(g, function(err, files){
      if (err) return done(err);
      memo = memo.concat(files);
      done(err, memo);
    });
  }

  async.reduce(gs, [], step, done);
};


/**
 * listify :: Either a [a] -> [a]
 */

exports.listify = function(items){
  var array = Array.isArray(items);
  return array? items : items? [items] : null;
};


/**
 * Resolve glob paths relative to the config path
 *
 * @param {String} config path
 * @param {String} glob path
 * @return {String} resolved directory
 * @api public
 */

exports.resolve = function(config, item) {
  if (item[0] === '/') return item;
  var dir = path.dirname(config);
  return path.resolve(path.join(dir, item));
};

/**
 * config and items to rss
 *
 * @param {Object} config
 * @param {Array} array of podcast items
 * @return {String} rss data
 * @api public
 */
exports.rss = function(config, items){
  var feed = new Rss(config);
  items.forEach(function(item){
    debug("feeding item %j", item);
    feed.item(item);
  });
  return feed.xml(" ");
};

/**
 * Take a config path and build an rss feed
 *
 * @param {String} yaml config path
 * @param {Function} result callback (err, rss_data)
 * @api public
 */

function podcast(filename, done) {
  debug('reading config...');
  exports.parse(filename, function(err, config){
    if (err) return done(err);

    debug('config: %j', config);
    var items = exports.listify(config.items || "podcast/**/*.json");
    items = items.map(exports.resolve.bind(null, filename));

    exports.globs(items, function(err, files){
      debug('globbed: %j', files);
      if (err) return done(err);

      async.map(files, exports.parse, function(err, items){
        if (err) return done(err);
        var defs = !!config.itemDefaults;
        debug("has item defaults? %s", defs);
        items = items.map(function(item){
          return defs? extend(item, config.itemDefaults) : item;
        });

        return done(err, {
          config: config,
          items: items,
          xml: exports.rss(config, items)
        });
      });
    });
  });
}

