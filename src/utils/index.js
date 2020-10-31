const ONE_DAY_MILLI_SECONDS = 86400000;

module.exports.getDateDifferenceInDays = (dateA, dateB) => (dateA - new Date(dateB).getTime())
/ ONE_DAY_MILLI_SECONDS;
