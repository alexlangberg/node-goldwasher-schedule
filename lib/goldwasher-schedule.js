'use strict';

var R = require('ramda');
var goldwasher = require('goldwasher');
require('goldwasher-needle');
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
  jobs: []
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
};

/**
 * Start the scheduler
 */
schedule.start = function() {
  var _this = this;
  R.forEach(function(target) {
    var options = R.merge(_this.options, target);
    var job = nodeSchedule.scheduleJob(options.rule, function() {
      goldwasher.needle(options.url, options, function(error, result) {
        if (error) {
          return _this.callback(error);
        }

        return _this.callback(null, result, target);
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

goldwasher.schedule = schedule;
