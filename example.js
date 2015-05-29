'use strict';

var goldwasher = require('goldwasher');
require('./lib/goldwasher-schedule');

// first will use default options below, second has custom options
var targets = [
  {
    url: 'https://google.com'
  },
  {
    url: 'https://github.com',
    rule: { second: [15, 35, 55] },
    goldwasher: {
      selector: 'h1'
    }
  }
];

// default options
var options = {
  rule: { second: [1, 10, 20, 30, 40, 50] }
};

// function that will receive the results
var processResults = function(error, results) {
  console.log(results);
};

// set up the schedule
goldwasher.schedule.setup(targets, options, processResults);

// start the schedule
goldwasher.schedule.start();

// stop the schedule after 60 seconds
setTimeout(function() {
  goldwasher.schedule.stop();
}, 60000);