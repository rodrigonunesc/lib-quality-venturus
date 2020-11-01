const { ONE_DAY_MILLI_SECONDS } = require('./constants');

module.exports.getDateDifferenceInDays = (dateA, dateB) => (dateA - dateB) / ONE_DAY_MILLI_SECONDS;

module.exports.splitStringBySeparator = (string, separator) => string.split(separator);
