const dbConnection = require('./create-connection');
const notFound = require('./not-found');
const serverError = require('./server-error');

module.exports = {
  dbConnection,
  notFound,
  serverError,
};
