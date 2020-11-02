const { HTTP_STATUS } = require('../utils/constants');
const genericUtils = require('../utils');
const metricUtils = require('../utils/metric');
const metricsRecorderHelper = require('../helpers/metrics-recorder');
const githubApi = require('../external-apis/github');
const { extractAverageAgeFromIssues, extractStandardDeviationAgeFromIssues } = require('../helpers/issues-metrics-extractor');
const redisHelper = require('../helpers/redis');
const NotFoundException = require('../exceptions/not-found');
const InvalidFields = require('../exceptions/invalid-fields');

module.exports.getProjectMetrics = async (req, res, next) => {
  try {
    const requestDate = new Date();

    const { projectName, userId } = req.query;

    if (!projectName) {
      throw new InvalidFields('Missing projectName param');
    }

    const redisKey = `getProjectMetrics${projectName}`;

    const cachedResponse = await redisHelper.getData(redisKey);

    let response;

    if (cachedResponse) {
      const parsedCachedResponse = JSON.parse(cachedResponse);

      await metricsRecorderHelper.saveUserTracking({
        userId,
        projectData: parsedCachedResponse.projectData,
        query: projectName,
        requestDate,
        status: HTTP_STATUS.SUCCESS,
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
          userId, projectData, query: projectName, requestDate, status: HTTP_STATUS.SUCCESS,
        }),
      ]);

      const issues = await githubApi.getOpenedProjectIssues(projectData.full_name, []);

      const averageOpenedIssueTimeInDays = extractAverageAgeFromIssues(issues);

      const deviationInDays = extractStandardDeviationAgeFromIssues(issues,
        averageOpenedIssueTimeInDays);

      response = {
        projectIdentifier: projectData.full_name,
        issuesAmount: issues.length,
        averageOpenedIssueTimeInDays,
        deviationOpenedIssueTimeInDays: deviationInDays,
      };

      redisHelper.persistData(redisKey,
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

    const redisKey = `getProjectMetricsAlongTime${projectsFullNames}`;

    let response;

    const cachedResponse = await redisHelper.getData(redisKey);

    if (cachedResponse) {
      response = JSON.parse(cachedResponse);
    } else {
      const arrayOfProjectFullNames = genericUtils.splitStringBySeparator(projectsFullNames, ',');

      const projectsIssues = {};

      const promises = arrayOfProjectFullNames
        .map(async (projectFullName) => {
          projectsIssues[projectFullName] = await githubApi.getOpenedProjectIssues(
            projectFullName, [{ name: 'direction', value: 'asc' }],
          );
        });

      await Promise.all(promises);

      const trackedProjectIssues = metricUtils.getProjectIssuesTrackedPerDay(projectsIssues);

      response = trackedProjectIssues;

      redisHelper.persistData(redisKey, JSON.stringify(response));
    }

    res.json(response);
  } catch (e) {
    next(e);
  }
};
