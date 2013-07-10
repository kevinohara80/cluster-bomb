var clusterBomb = require('../');
var bomb        = clusterBomb();

bomb.configure({
  workers: 3
});

bomb.worker(function(worker) {
  console.log('launching worker with pid ' + worker.process.pid);
});

bomb.master(function(cluster) {
  console.log('master is running');

  setTimeout(function() {
    console.log('scaling up by two');
    bomb.scale(2);
  }, 2000);

});