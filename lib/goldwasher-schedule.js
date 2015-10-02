'use strict';

var R = require('ramda');
var gn = require('goldwasher-needle');
var nodeSchedule = require('node-schedule');
var util = require('util');
var events = require('events');

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

var Schedule = function(targets, userOptions, callback) {
  var _this = this;
  _this.jobs = [];
  _this.running = 0;
  _this.targets = targets;

  if (typeof (userOptions) === 'function') {
    _this.options = getDefaults({});
    _this.callback = userOptions;
  } else {
    _this.options = getDefaults(userOptions);
    _this.callback = callback;
  }

  events.EventEmitter.call(this);
  return _this;
};

util.inherits(Schedule, events.EventEmitter);

/**
 * Start the scheduler
 */
Schedule.prototype.start = function() {
  var _this = this;
  _this.emit('start');

  R.forEach(function(target) {
    var options = R.merge(_this.options, target);
    var job = nodeSchedule.scheduleJob(options.rule, function() {
      _this.running++;
      _this.emit('running', options);

      gn(
        options.url,
        options,
        function(error, result, response, body) {
          _this.running--;

          if (error) {
            return _this.callback(error, options);
          }

          _this.emit('result', result, response, body, options);

          return _this.callback(null, result, target, response, body);
        });
    });

    _this.jobs.push(job);
  }, _this.targets);
};

/**
 * stop the scheduler
 */
Schedule.prototype.stop = function() {
  var _this = this;
  R.forEach(function(job) {
    job.cancel();
  }, _this.jobs);

  _this.emit('stop');
};

module.exports = function(targets, userOptions, callback) {
  return new Schedule(targets, userOptions, callback);
};
