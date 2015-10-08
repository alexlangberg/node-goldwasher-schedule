// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var sinon = require('sinon');
var goldwasher = require('../lib/goldwasher-schedule');

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
    goldwasher(targets);
    done();
  });

  it('accepts options', function(done) {
    goldwasher(targets, options);
    done();
  });

  it('passes down options', function(done) {
    var gs = goldwasher(targets, options);

    gs.options.should.have.property('goldwasher');
    gs.options.should.have.property('needle');
    gs.options.should.have.property('goldwasherNeedle');
    done();
  });

});

describe('running', function() {

  it('runs and stops', function(done) {
    var gs = goldwasher(targets, options);

    var emitter = sinon.spy(gs, 'emit');

    gs.on('result', function(results) {
      gs.stop();
      results.length.should.be.greaterThan(0);
      emitter.getCall(0).args[0].should.equal('start');
      emitter.getCall(1).args[0].should.equal('running');
      emitter.getCall(3).args[0].should.equal('result');
      emitter.getCall(4).args[0].should.equal('stop');
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

    var gs = goldwasher(targets, options);
    gs.on('result', function(results, options, timestamps) {
      options.rule.second.should.equal(2);
      results.length.should.be.greaterThan(0);
      timestamps.start.should.be.greaterThan(0);
      timestamps.end.should.be.greaterThan(0);
      gs.stop();
      done();
    });

    gs.start();
    clock.tick(61000);
  });

  it('returns error on goldwasher-needle failure', function(done) {
    var targets = [{url: 'foo'}];
    var gs = goldwasher(targets, options);
    gs.on('error', function(error, options, timestamps) {
      targets[0].url.should.equal(options.url);
      should.exist(timestamps);
      should.exist(error);
      gs.stop();
      done();
    });

    gs.start();
    clock.tick(61000);
  });

});
