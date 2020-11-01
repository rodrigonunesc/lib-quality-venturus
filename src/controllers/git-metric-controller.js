const { HTTP_STATUS } = require('../utils/constants');
const metricsRecorderHelper = require('../helpers/metrics-recorder');
const githubApi = require('../external-apis/github');
const { extractAverageAgeFromIssues, extractStandardDeviationAgeFromIssues } = require('../helpers/issues-metrics-extractor');
const NotFoundException = require('../exceptions/not-found');

module.exports.findByProject = async (req, res, next) => {
  try {
    const requestDate = new Date();
    const { projectName, userId } = req.query;
    const projectData = await githubApi.getProjectDataByName(projectName);
    if (!projectData) {
      await metricsRecorderHelper.saveUserTracking({
        userId, projectData: {}, query: projectName, requestDate, status: HTTP_STATUS.NOT_FOUND,
      });
      throw new NotFoundException('Project not found');
    }

    await Promise.all([
      metricsRecorderHelper.saveProjectTracking({ projectData, requestDate }),
      metricsRecorderHelper.saveUserTracking({
        userId, projectData, query: projectName, requestDate, status: HTTP_STATUS.SUCESS,
      }),
    ]);

    const issues = await githubApi.getOpenedProjectIssues(projectData.full_name);
    const averageOpenedIssueTimeInDays = extractAverageAgeFromIssues(issues);
    const deviationInDays = extractStandardDeviationAgeFromIssues(issues,
      averageOpenedIssueTimeInDays);

    const response = {
      projectIdentifier: projectData.full_name,
      issuesAmount: projectData.open_issues,
      averageOpenedIssueTimeInDays,
      deviationOpenedIssueTimeInDays: deviationInDays,
    };
    res.json(response);
  } catch (e) {
    next(e);
  }
};
