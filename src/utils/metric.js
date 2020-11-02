function getArrayOfDatesBetweenStartAndEndDate(startDate, endDate) {
  const array = [];

  for (let currentDate = startDate;
    currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    array.push(new Date(currentDate));
  }

  return array;
}

module.exports.getProjectMetricIssuesTrackedPerDay = (projectsIssues) => {
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
