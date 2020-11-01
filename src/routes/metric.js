const metricController = require('../controllers/metric-controller');

module.exports = (express) => {
  const router = express.Router();

  router.get('/project', metricController.getProjectMetrics);
  router.get('/projects', metricController.getProjectMetricsAlongTime);
  return router;
};
