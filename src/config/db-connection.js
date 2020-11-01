const mongoose = require('mongoose');

const connectionParams = {
  autoIndex: false,
  reconnectTries: 1,
  reconnectInterval: 500,
  poolSize: 5,
  bufferMaxEntries: 0,
  bufferCommands: false,
  useNewUrlParser: true,
};

const isConnected = () => mongoose.connection.readyState;

module.exports.create = () => new Promise((resolve, reject) => {
  if (isConnected()) {
    resolve();
  }

  mongoose.set('bufferCommands', false);

  mongoose.connection.on('error', (error) => reject(error));

  mongoose.connect(process.env.DB_URL, connectionParams).then(() => resolve(mongoose.connection));
});
