const dbConnection = require('../config/db-connection');

module.exports = async (req, res, next) => {
  try {
    await dbConnection.create();
    next();
  } catch (e) {
    next(e);
  }
};
