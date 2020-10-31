const githubApi = require('../external-apis/github');
const { extractAverageAgeFromIssues, extractStandardDeviationAgeFromIssues } = require('../helpers/issues-metrics-extractor');
const NotFoundException = require('../exceptions/not-found');

module.exports.findByProject = async (req, res, next) => {
  try {
    const { projectName } = req.query;
    const projectData = await githubApi.getProjectDataByName(projectName);
    if (!projectData) {
      throw new NotFoundException('Project not found');
    }

    const issues = await githubApi.getOpenedProjectIssues(projectData.full_name);
    const averageOpenedIssueTimeInDays = extractAverageAgeFromIssues(issues);
    const deviationInDays = extractStandardDeviationAgeFromIssues(issues,
      averageOpenedIssueTimeInDays);

    const payload = {
      projectIdentifier: projectData.full_name,
      issuesAmount: projectData.open_issues,
      averageOpenedIssueTimeInDays,
      deviationOpenedIssueTimeInDays: deviationInDays,
    };
    res.json(payload);
  } catch (e) {
    next(e);
  }
};
