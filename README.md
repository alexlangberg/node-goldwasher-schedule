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
If you haven't already downloaded [goldwasher](https://www.npmjs.org/package/goldwasher), you need to install this too, to run the example:
```
npm install goldwasher
```

## Usage

```javascript
var goldwasher = require('goldwasher');
require('goldwasher-schedule');
goldwasher.schedule.setup(targets, options, callback);
goldwasher.start();
goldwasher.stop();
```

## Targets
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
```rule``` is the schedule rule for [node-schedule](https://www.npmjs.org/package/node-schedule). In thise case, 3 times a minute when second equals any of the three values.
```goldwasher``` is an object of custom [goldwasher](https://www.npmjs.org/package/goldwasher) options for this target.

Additionally, all other options used by [goldwasher-needle](https://www.npmjs.org/package/goldwasher-needle) can be passed along, such as ```needle```, ```goldwasherNeedle``` and ```retry```. Have a look at their respective doc pages for [goldwasher](https://www.npmjs.org/package/goldwasher), [needle](https://www.npmjs.org/package/needle) and [retry](https://www.npmjs.org/package/retry) for options available.

If no other options than ```url``` are set in the target, the defaults provided by the options parameter, explained below, will be used.

## Options
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

These options will be applied to all targets that do not explicitly define them themselves.

## Example
```javascript
```

## Advanced example
```javascript
```