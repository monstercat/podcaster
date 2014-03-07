
var async = require('async');
var glob = require('glob');

/**
 * Glob multiple glob strings
 *
 * @param {Array} an array of glob strings
 * @param {Function} result callback (err, paths)
 * @api public
 */

module.exports = function globs(gs, done){
  function step(memo, g, done) {
    glob(g, function(err, files){
      if (err) return done(err);
      memo = memo.concat(files);
      done(err, memo);
    });
  }

  async.reduce(gs, [], step, done);
};

