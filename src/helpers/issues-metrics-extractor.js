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
  const datesDiffInDays = issues.map((issue) => getDateDifferenceInDays(now,
    new Date(issue.created_at).getTime()));
  const variation = datesDiffInDays.map((diffInDays) => (diffInDays - averageTimeInDays) ** 2)
    .reduce((accumulator, current) => accumulator + current, 0) / issues.length;
  const deviation = Math.sqrt(variation);
  return Math.round(deviation);
};
