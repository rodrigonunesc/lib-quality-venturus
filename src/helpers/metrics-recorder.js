const UserTrackingModel = require('../models/user-tracking');
const ProjectTrackingModel = require('../models/project-tracking');

module.exports.saveUserTracking = ({
  userId, projectData, query, requestDate, status,
}) => UserTrackingModel.updateOne(
  { userId },
  {
    $push: {
      visits: {
        status,
        requestDate,
        projectType: projectData.full_name,
        query,
        apiData: projectData,
      },
    },
  },
  { upsert: true },
);

module.exports.saveProjectTracking = ({
  projectData, requestDate,
}) => ProjectTrackingModel.updateOne(
  { projectId: projectData.full_name },
  {
    $push: {
      trackings: { requestDate, apiData: projectData },
    },
  },
  { upsert: true },
);
