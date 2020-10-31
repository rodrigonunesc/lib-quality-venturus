const NotFoundError = require('../exceptions/not-found');

module.exports = (req, res, next) => next(new NotFoundError());
