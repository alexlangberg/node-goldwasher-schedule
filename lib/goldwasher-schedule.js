// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var goldwasher = require('goldwasher');
/**
 * Gets default options and merges with user options if any.
 * @param url
 * @param options
 * @returns {Object|*}
 */
var getDefaults = function(url, options) {
  var defaults = {
    goldwasher: {
      url: url
    },
    needle: {
      follow_max: 20
    },
    goldwasherNeedle: {
      disallowHeader: 'x-goldwasher-version'
    }
  };

  if (!options) {
    return defaults;
  }

  return {
    goldwasher: R.merge(defaults.goldwasher, options.goldwasher),
    needle: R.merge(defaults.needle, options.needle),
    goldwasherNeedle: R.merge(
      defaults.goldwasherNeedle,
      options.goldwasherNeedle
    )
  };
};

/**
 * Add "schedule" function to goldwasher.
 * At intervals, use needle to get content of sites, pass to goldwasher and return results.
 * @param maps
 */
goldwasher.schedule = function(maps) {

};