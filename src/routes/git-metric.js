const metricController = require('../controllers/git-metric-controller');

module.exports = (express) => {
  const router = express.Router();

  router.get('/project', metricController.findByProject);
  return router;
};
