
var fs = require('fs');

/**
 * Parse a file from JSON 
 *
 * @param {String} json file path
 * @param {Function} result callback (err, obj)
 * @api public
 */

module.exports = function parse(target, done) {
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

