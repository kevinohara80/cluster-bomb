var clusterBomb = require('../');
var bomb        = clusterBomb();

bomb.configure({
  workers: 3,
  restart: true
});

bomb.worker(function(worker) {
  console.log('launching worker with pid ' + worker.process.pid);
  // test a restart on one of the workers
  if(worker.id === 2) {
    setTimeout(function() {
      console.log('killing ' + worker.id);
      //console.log(worker);
      process.exit();
    }, 1000);
  }

});

bomb.master(function(cluster) {
  console.log('master is running');

  cluster.on('exit', function(worker) {
    console.log('exit event for worker ' + worker.id);
  });

  cluster.on('restart', function(num) {
    console.log('restarting ' + num + ' workers');
  });

});


