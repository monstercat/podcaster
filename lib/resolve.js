
var path = require('path');

/**
 * Resolve glob paths relative to the config path
 *
 * @param {String} config path
 * @param {String} glob path
 * @return {String} resolved directory
 * @api public
 */

module.exports = function resolve(config, item) {
  if (item[0] === '/') return item;
  var dir = path.dirname(config);
  return path.resolve(path.join(dir, item));
};
