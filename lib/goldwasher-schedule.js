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

var Schedule = function(targets, userOptions) {
  var _this = this;
  _this.jobs = [];
  _this.running = 0;
  _this.targets = targets;
  _this.options = userOptions ? getDefaults(userOptions) : getDefaults({});

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
      var timestamps = {
        start: Date.now()
      };
      _this.running++;
      _this.emit('running', options, timestamps);

      gn(
        options.url,
        options,
        function(error, result, response, body) {
          _this.running--;
          timestamps.end = Date.now();

          if (error) {
            _this.emit('error', error, options, timestamps);
            return;
          }

          _this.emit('result', result, options, timestamps, response, body);
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

module.exports = function(targets, userOptions) {
  return new Schedule(targets, userOptions);
};
