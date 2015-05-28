'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var goldwasher = require('goldwasher');
var goldwasherNeedle = require('goldwasher-needle');
var goldwasherSchedule = require('../lib/goldwasher-schedule');
var url = 'https://google.com';

describe('initialization', function() {

  it('loads', function(done) {
    goldwasher.should.have.property('schedule');
    done();
  });
});
