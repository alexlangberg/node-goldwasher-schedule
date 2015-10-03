# node-goldwasher-schedule
[![npm version](http://img.shields.io/npm/v/goldwasher-schedule.svg)](https://www.npmjs.org/package/goldwasher-schedule)
[![Build Status](http://img.shields.io/travis/alexlangberg/node-goldwasher-schedule.svg)](https://travis-ci.org/alexlangberg/node-goldwasher-schedule)
[![Coverage Status](http://img.shields.io/coveralls/alexlangberg/node-goldwasher-schedule.svg)](https://coveralls.io/r/alexlangberg/node-goldwasher-schedule?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/alexlangberg/node-goldwasher-schedule.svg)](https://codeclimate.com/github/alexlangberg/node-goldwasher-schedule)

[![Dependency Status](https://david-dm.org/alexlangberg/node-goldwasher-schedule.svg)](https://david-dm.org/alexlangberg/node-goldwasher-schedule)
[![devDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-schedule/dev-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-schedule#info=devDependencies)
[![peerDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-schedule/peer-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-schedule#info=peerDependencies)

Plugin for [goldwasher](https://www.npmjs.org/package/goldwasher), using [node-schedule](https://www.npmjs.org/package/node-schedule) to schedule [goldwasher-needle](https://www.npmjs.org/package/goldwasher-needle) requests at time intervals. Requires [goldwasher](https://www.npmjs.org/package/goldwasher) to work.

## Installation
```
npm install goldwasher-schedule
```

## Usage

```javascript
var goldwasher = require('goldwasher-schedule');
var gs = goldwasher(targets, options);
gs.on('result', function(results) {
  console.log(results);
});
gs.start();
gs.stop();
```

## Parameters

### Targets
The first parameter required by the setup function is an array of targets. An example:
```javascript
[
  {
    url: 'https://github.com',
    rule: { second: [15, 35, 55] },
    goldwasher: {
      selector: 'h1'
    }
  }
]
```

```url``` is the only required parameter.
```rule``` is the schedule rule for [node-schedule](https://www.npmjs.org/package/node-schedule). In this case, 3 times a minute when second equals any of the three values (defaults to ```second: 1```, e.g. once a minute).
```goldwasher``` is an object of custom [goldwasher](https://www.npmjs.org/package/goldwasher) options for this target.

Additionally, all other options used by [goldwasher-needle](https://www.npmjs.org/package/goldwasher-needle) can be passed along, such as ```needle```, ```goldwasherNeedle``` and ```retry```. Have a look at their respective doc pages for [goldwasher](https://www.npmjs.org/package/goldwasher), [needle](https://www.npmjs.org/package/needle) and [retry](https://www.npmjs.org/package/retry) for options available.

If no other options than ```url``` are set in the target, the defaults provided by the options parameter, explained below, will be used.

### Options
Options can be optionally passed in as the second parameter. It can contain the default values for targets. For instance:

```javascript
var options = {
    rule: { second: 10 },
    goldwasher: {
        selector: 'h1'
    },
    needle: {
        follow_max: 20
    },
    retry: {
        retries: 3
    }
}
```

These options will be applied to all targets that do not explicitly define them themselves. Note that if no rule is provided, it defaults to ```second: 1```, e.g. once a minute.

### events
This module is an event emitter, that will emit events on start, stop, run, end and results. The results event will emit:

1. ```results``` - the results from goldwasher.
2. ```options``` - the options (and target) the results have been collected with.
3. ```response``` - the response from goldwasher-needle.
4. ```body``` - the raw body from goldwasher-needle.

## Example
```javascript
var gs = require('goldwasher-schedule');

// declare google.com a target
var targets = [
  {
    url: 'https://google.com'
  }
];

// set up the schedule
gs(targets).start();

// receive the results
gs.on('result', function(results) {
  console.log(results);
});
```

## Advanced example
```javascript
var goldwasher = require('goldwasher-schedule');

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
```