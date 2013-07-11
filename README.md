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
  workers: 3, // set the number of workers to fork (default is # of cpus)
  restart: true // auto-restart dead workers
});

bomb.worker(function(worker) {
  console.log('new worker (pid ' + worker.process.pid + ')');
});

bomb.master(function(cluster) {
  console.log('master is running');
});
```

Results in...

```bash
$ node myclusterbomb.js
master is running
new worker (pid 94215)
new worker (pid 94216)
new worker (pid 94217)
```

## Restarts

Setting `restart:true` will auto-restart dead workers. A 'restart event is also emitted'.

```js
bomb.configure({
  workers: 3,
  restart: true
});

bomb.worker(function(worker) {
  console.log('launching worker with pid ' + worker.process.pid);

  if(worker.id === 2) {
    setTimeout(function() {
      console.log('killing worker ' + worker.id);
      process.exit();
    }, 5000);
  }

});

bomb.master(function(cluster) {
  console.log('master is running');

  cluster.on('restart', function(num) {
    console.log('restarting ' + num + ' workers');
  });

});
```

Results in...

```bash
$ node restart.js
master is running
launching worker with pid 95072
launching worker with pid 95073
launching worker with pid 95074
killing worker 2
restarting 1 workers
launching worker with pid 95075
```

## Scaling

You can even scale up your workers...

```js
bomb.master(function(cluster) {
  console.log('master is running');

  setTimeout(function() {
    console.log('--> scaling up');
    bomb.scale(1);
  }, 2000);

});
```

Results in...

```bash
$ node myclusterbomb.js
master is running
new worker (pid 94215)
new worker (pid 94216)
new worker (pid 94217)
--> scaling up
new worker (pid 94218)
```

## Configure Options

* `workers`: [integer] Number of workers to fork. Defaults to the number of CPU's on the host system
* `restart`: [boolean] Auto-restart workers that have died. Defaults to true.

## API

* `configure(opts)`: Set your options hash
* `worker(fn)`: Set the worker callback function. Callback contains a reference to the worker object.
* `master(fn)`: Set the master callback function. Callback contains a reference to the cluster object.
* `scale(num)`: Scale up your workers. (scale down coming soon)


## License

MIT
