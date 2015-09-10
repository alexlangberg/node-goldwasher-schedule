'use strict';

var gs = require('./lib/goldwasher-schedule');

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
gs.setup(targets, options, processResults);

// start the schedule
gs.start();

// stop the schedule after 60 seconds
setTimeout(function() {
  gs.stop();
}, 60000);