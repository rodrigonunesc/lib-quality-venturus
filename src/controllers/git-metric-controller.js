const { HTTP_STATUS } = require('../utils/constants');
const genericUtils = require('../utils');
const metricUtils = require('../utils/metric');
const metricsRecorderHelper = require('../helpers/metrics-recorder');
const githubApi = require('../external-apis/github');
const { extractAverageAgeFromIssues, extractStandardDeviationAgeFromIssues } = require('../helpers/issues-metrics-extractor');
const redisHelper = require('../helpers/redis');
const NotFoundException = require('../exceptions/not-found');

module.exports.getProjectMetrics = async (req, res, next) => {
  try {
    const requestDate = new Date();

    const { projectName, userId } = req.query;

    const cachedResponse = await redisHelper.getData(projectName);

    let response;

    if (cachedResponse) {
      const parsedCachedResponse = JSON.parse(cachedResponse);

      await metricsRecorderHelper.saveUserTracking({
        userId,
        projectData: parsedCachedResponse.projectData,
        query: projectName,
        requestDate,
        status: HTTP_STATUS.SUCESS,
      });

      response = parsedCachedResponse.cachedPayload;
    } else {
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

      response = {
        projectIdentifier: projectData.full_name,
        issuesAmount: projectData.open_issues,
        averageOpenedIssueTimeInDays,
        deviationOpenedIssueTimeInDays: deviationInDays,
      };

      redisHelper.persistData(projectName,
        JSON.stringify({ cachedPayload: response, projectData }));
    }

    res.json(response);
  } catch (e) {
    next(e);
  }
};

module.exports.getProjectMetricsAlongTime = async (req, res, next) => {
  try {
    const { projectsFullNames } = req.query;

    const arrayOfProjectFullNames = genericUtils.splitStringBySeparator(projectsFullNames, ',');

    const promises = arrayOfProjectFullNames
      .map((projectFullName) => githubApi.getProjectDataByFullName(projectFullName));

    const projectsData = await Promise.all(promises);

    const t = metricUtils.t(projectsData);

    res.json(t);
  } catch (e) {
    next(e);
  }
};
