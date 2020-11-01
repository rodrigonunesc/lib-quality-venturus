const redis = require('redis');

const client = redis.createClient({ host: 'redis' });
client.on('error', (error) => console.log(`Error => ${error.stack}`));

module.exports = client;
