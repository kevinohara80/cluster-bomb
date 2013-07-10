cluster-bomb
============

a node.js cluster management and monitoring system for explosive results

[![Build Status](https://travis-ci.org/kevinohara80/cluster-bomb.png)](https://travis-ci.org/kevinohara80/cluster-bomb)

## Usage

```bash
$ npm install cluster-bomb
```

Then just create an instance, configure with options like number of workers, and create callbacks for `worker()` and `master()`

```js
var clusterBomb = require('cluster-bomb');

var bomb = clusterBomb();

bomb.configure({
  workers: 3,
  restart: true
});

bomb.worker(function(worker) {
  console.log('new worker (pid ' + worker.process.pid + ')');
});

bomb.master(function(cluster) {
  console.log('master is running');
});
```

## Configure Options

* `workers`: [integer] Number of workers to fork. Defaults to the number of CPU's on the host system
* `restart`: [boolean] Auto-restart workers that have died. Defaults to true.

## API

## License

MIT
