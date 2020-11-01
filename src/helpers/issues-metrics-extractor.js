const { getDateDifferenceInDays } = require('../utils');

module.exports.extractAverageAgeFromIssues = (issues) => {
  const now = Date.now();
  const summedDifferenceInDaysFromAllIssues = issues.reduce((accumulator, current) => accumulator
                      + getDateDifferenceInDays(now, new Date(current.created_at).getTime()), 0);
  const averageTimeInDays = summedDifferenceInDaysFromAllIssues / issues.length;
  return Math.round(averageTimeInDays);
};

module.exports.extractStandardDeviationAgeFromIssues = (issues, averageTimeInDays) => {
  const now = Date.now();
  const variation = issues.reduce((accumulator, current) => {
    const diffInDays = getDateDifferenceInDays(now, new Date(current.created_at).getTime());
    return accumulator + (diffInDays - averageTimeInDays) ** 2;
  }, 0) / issues.length;
  const deviation = Math.sqrt(variation);
  return Math.round(deviation);
};
