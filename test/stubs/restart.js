var cluster = require('cluster');
var assert = require('assert');

var done = function() {};

if(cluster.isMaster) {
  cluster.setupMaster({
    exec: __filename
  });
}

var bomb = require('../../')();

bomb.configure({
  workers: 3,
  restart: true
});

bomb.worker(function(worker) {
  if(worker.id === 2) {
    setTimeout(function() {
      process.exit();
    }, 200);
  }
});

bomb.master(function(cluster) {

  cluster.on('restart', function(num) {
    assert.equal(1, num);
    assert.equal(2, bomb.workerCount());
  });

  cluster.on('online', function(worker) {
    if(worker.id === 4) {
      assert.equal(3, bomb.workerCount());
      done();
    }
  });

});

module.exports = function(fn) {
  done = fn;
}