// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var sinon = require('sinon');
var goldwasher = require('goldwasher');
require('../lib/goldwasher-schedule');

var options = {
  schedule: {
    rule: {second: 1}
  },
  goldwasher: {
    selector: 'p'
  },
  needle: {
    follow_max: 20
  },
  goldwasherNeedle: {
    disallowHeader: 'x-goldwasher-version'
  }
};

var targets = [
  {
    url: 'http://google.com'
  }
];

var clock;

before(function() {
  clock = sinon.useFakeTimers();
});

after(function() {
  clock.restore();
});

describe('initialization', function() {

  it('loads', function(done) {
    goldwasher.should.have.property('needle');
    goldwasher.should.have.property('schedule');
    done();
  });

  it('loads without options', function(done) {
    goldwasher.schedule.setup(targets, function() {
    });

    done();
  });

  it('accepts options', function(done) {
    goldwasher.schedule.setup(targets, options, function() {
    });

    done();
  });

  it('passes down options', function(done) {
    goldwasher.schedule.setup(targets, options, function() {
    });

    goldwasher.schedule.options.should.have.property('goldwasher');
    goldwasher.schedule.options.should.have.property('needle');
    goldwasher.schedule.options.should.have.property('goldwasherNeedle');
    done();
  });

});

describe('running', function() {

  it('runs and stops', function(done) {
    goldwasher.schedule.setup(targets, options, function(error, results) {
      results.length.should.be.greaterThan(0);
      goldwasher.schedule.stop();
      done();
    });

    goldwasher.schedule.start();
    clock.tick(61000);
  });

  it('runs with custom options for target', function(done) {
    var targets = [
      {
        url: 'http://google.com',
        rule: {second: 2}
      }
    ];

    goldwasher.schedule.setup(
      targets,
      options,
      function(error, results, target) {
        target.rule.second.should.equal(2);
        results.length.should.be.greaterThan(0);
        goldwasher.schedule.stop();
        done();
      });

    goldwasher.schedule.start();
    clock.tick(61000);
  });

  it('returns error on goldwasher-needle failure', function(done) {
    var targets = [{url: 'foo'}];
    goldwasher.schedule.setup(targets, options, function(error, results) {
      should.exist(error);
      goldwasher.schedule.stop();
      done();
    });

    goldwasher.schedule.start();
    clock.tick(61000);
  });

});
