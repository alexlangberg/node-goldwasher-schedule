// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var sinon = require('sinon');
var gs = require('../lib/goldwasher-schedule');

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
  },
  retry: {
    retries: 0
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

  it('loads without options', function(done) {
    gs.setup(targets, function() {
    });

    done();
  });

  it('accepts options', function(done) {
    gs.setup(targets, options, function() {
    });

    done();
  });

  it('passes down options', function(done) {
    gs.setup(targets, options, function() {
    });

    gs.options.should.have.property('goldwasher');
    gs.options.should.have.property('needle');
    gs.options.should.have.property('goldwasherNeedle');
    done();
  });

});

describe('running', function() {

  it('runs and stops', function(done) {
    gs.setup(targets, options, function(error, results) {
      results.length.should.be.greaterThan(0);
      gs.stop();
      done();
    });

    gs.start();
    clock.tick(61000);
  });

  it('runs with custom options for target', function(done) {
    var targets = [
      {
        url: 'http://google.com',
        rule: {second: 2}
      }
    ];

    gs.setup(
      targets,
      options,
      function(error, results, target) {
        target.rule.second.should.equal(2);
        results.length.should.be.greaterThan(0);
        gs.stop();
        done();
      });

    gs.start();
    clock.tick(61000);
  });

  it('returns error on goldwasher-needle failure', function(done) {
    var targets = [{url: 'foo'}];
    gs.setup(targets, options, function(error, results) {
      should.exist(error);
      gs.stop();
      done();
    });

    gs.start();
    clock.tick(61000);
  });

});
