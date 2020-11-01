const metricController = require('../controllers/metric-controller');

module.exports = (express) => {
  const router = express.Router();

  router.get('/project', metricController.getProjectMetrics);
  router.get('/life-time-issues/projects', metricController.getProjectMetricsAlongTime);
  return router;
};
