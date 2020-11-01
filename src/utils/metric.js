function getArrayOfDatesBetweenStartAndEndDate(startDate, endDate) {
  const array = [];

  for (let currentDate = startDate;
    currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    array.push(new Date(currentDate));
  }

  return array;
}

getArrayOfDatesBetweenStartAndEndDate(new Date('2016-09-09T09:51:01Z'), new Date('2020-11-01T00:00:00Z'));

module.exports.getProjectIssuesTrackedPerDay = (projectsIssues) => {
  const now = new Date();

  const projectsIssuesTrackedPerDay = {};

  Object.keys(projectsIssues).forEach((key) => {
    const projectIssues = projectsIssues[key];

    const firstIssueDate = new Date(projectIssues[0].created_at);

    const rangeOfDatesPerDay = getArrayOfDatesBetweenStartAndEndDate(
      new Date(firstIssueDate), now,
    );

    const issuesAmountPerDay = rangeOfDatesPerDay.map((date) => {
      const issuesAmountAtThisDate = projectIssues
        .filter((issue) => new Date(issue.created_at) <= date).length;
      return { date, issuesAmount: issuesAmountAtThisDate };
    });

    projectsIssuesTrackedPerDay[key] = issuesAmountPerDay;
  });

  return projectsIssuesTrackedPerDay;
};
