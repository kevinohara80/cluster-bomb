var cluster = require('cluster');
var cpus    = require('os').cpus().length;

var ClusterBomb = function(opts) {
  var that = this;

  if(!opts) opts = {};
  
  // defaults
  this._workers = cpus;
  this._restart = true;

  if(opts) this.configure(opts);

  if(cluster.isMaster) {
    // master setup
    cluster.on('exit', function(worker, code, signal) {
      if((that.workerCount() < that._workers) && that._restart === true ) {
        var n = that._workers - that.workerCount();
        cluster.emit('restart', n);
        that._forkWorkers();
      }
    });
  } else {
    // worker setup
  }
}

/*******************************/
/* public functions            */
/*******************************/

ClusterBomb.prototype.configure = function(opts) {
  // exit on function call if it is a worker
  if(!cluster.isMaster) return;
  if(!opts || typeof opts !== 'object') throw new Error('options must be supplied as an object');
  if(typeof opts.workers !== undefined && typeof opts.workers === 'number') {
    this._workers = opts.workers;
  } 
  if(typeof opts.restart !== undefined && typeof opts.restart === 'boolean') {
    this._restart = opts.restart;
  }
}

ClusterBomb.prototype.worker = function(worker) {
  // exit on function call if it is a worker
  if(!cluster.isWorker) return;
  if(typeof worker !== 'function') throw new Error('worker argument must be a function');
  worker(cluster.worker);
}

ClusterBomb.prototype.master = function(master) {
  var that = this;
  // exit on function call if it is a worker
  if(!cluster.isMaster) return;
  if(typeof master !== 'function') throw new Error('master argument must be a function');
  this._initialRun = true;
  this._forkWorkers();
  master(cluster);
}

ClusterBomb.prototype.workerCount = function() {
  if(!cluster.isMaster) return;
  return Object.keys(cluster.workers).length;
}

ClusterBomb.prototype.cluster = function() {
  return cluster;
}

ClusterBomb.prototype.scale = function(num) {
  if(!cluster.isMaster) return;
  if(typeof num !== 'number') throw new Error('num must be a number');
  num = parseInt(num);
  if(num < 0) {
    // maybe kill one
  } 
  this._workers += num;
  this._forkWorkers();
}

/*******************************/
/* private-ish functions       */
/*******************************/

ClusterBomb.prototype._forkWorkers = function() {
  if(!cluster.isMaster || (this.initialRun && !this._restart)) return;
  var n = this._workers - this.workerCount();
  if(n > 0) {
    for(var i=0; i<n; i++) {
      cluster.fork();
    }
  }
}

/*******************************/
/* exports                     */
/*******************************/

module.exports = function(opts) {
  if(!opts) opts = {};
  return new ClusterBomb(opts);
} 