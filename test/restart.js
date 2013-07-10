var assert  = require('assert');

describe('restart', function() {

  it('should restart a dead worker', function(done) {
    require('./stubs/restart')(done);
  });

});



