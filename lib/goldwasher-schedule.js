'use strict';

var R = require('ramda');
var gn = require('goldwasher-needle');
var nodeSchedule = require('node-schedule');

/**
 * Gets default options and merges with user options if any.
 * @param options
 * @returns {*}
 */
var getDefaults = function(options) {
  var defaults = {
    rule: { second: 1 }
  };

  return R.merge(defaults, options);
};

var schedule = {
  jobs: [],
  running: 0
};

/**
 * Set up the scheduler.
 * @param targets
 * @param userOptions
 * @param callback
 */
schedule.setup = function(targets, userOptions, callback) {
  var _this = this;

  _this.targets = targets;

  if (typeof (userOptions) === 'function') {
    _this.options = getDefaults({});
    _this.callback = userOptions;
  } else {
    _this.options = getDefaults(userOptions);
    _this.callback = callback;
  }

  return _this;
};

/**
 * Start the scheduler
 */
schedule.start = function() {
  var _this = this;
  R.forEach(function(target) {
    var options = R.merge(_this.options, target);
    var job = nodeSchedule.scheduleJob(options.rule, function() {
      _this.running++;
      gn(
        options.url,
        options,
        function(error, result, response, body) {
          _this.running--;

          if (error) {
            return _this.callback(error);
          }

          return _this.callback(null, result, target, response, body);
        });
    });

    _this.jobs.push(job);
  }, _this.targets);
};

/**
 * stop the scheduler
 */
schedule.stop = function() {
  var _this = this;
  R.forEach(function(job) {
    job.cancel();
  }, _this.jobs);
};

module.exports = schedule;
