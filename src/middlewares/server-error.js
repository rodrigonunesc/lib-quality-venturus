const ServerError = require('../exceptions/server-error');

module.exports = (req, res, next) => next(new ServerError());
