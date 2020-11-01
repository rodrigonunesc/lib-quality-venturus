const client = require('../config/redis');
const { CACHE_TIME_IN_SECONDS } = require('../utils/constants');

module.exports.persistData = (key, value) => client.set(key, value, 'EX', CACHE_TIME_IN_SECONDS);

module.exports.getData = (key) => new Promise((resolve, reject) => {
  client.get(key, (error, reply) => {
    if (error) reject(error);
    resolve(reply);
  });
});

module.exports.endRedisInstance = () => client.quit();
