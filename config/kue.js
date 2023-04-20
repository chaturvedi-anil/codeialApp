const kue = require('kue');

const queue = kue.createQueue({
    redis: 
    {
      port: 6379,
      host: '127.0.0.1'
    }
});
  



module.exports = queue;