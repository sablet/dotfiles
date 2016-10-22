var exec = require('child_process').exec;
module.exports = function sysPrefix() {
  return new Promise(function(resolve, reject) {
    exec('python -c "import sys; print(sys.prefix)"',
      function(err, stdout) {
        if (err !== null) {
          reject(err);
        }
        else {
          resolve(stdout.toString().trim());
        }
      });
  });
}
