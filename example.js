'use strict';

var goldwasher = require('./lib/goldwasher-schedule');

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

// set up the schedule
var gs = goldwasher(targets, options);

// receive the results
gs.on('result', function(results) {
  console.log(results);
});

// start the schedule
gs.start();

// stop the schedule after 60 seconds
setTimeout(function() {
  gs.stop();
}, 60000);