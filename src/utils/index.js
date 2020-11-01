const ONE_DAY_MILLI_SECONDS = 86400000;

module.exports.getDateDifferenceInDays = (dateA, dateB) => (dateA - dateB) / ONE_DAY_MILLI_SECONDS;
