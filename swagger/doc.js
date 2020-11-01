const swaggerUi = require('swagger-ui-express');

const metricSwagger = require('./controllers/metric-controller.swagger');

const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    description: 'LibQuality Project',
    title: 'LibQuality - API Document',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  paths: {
    '/metric/project': {
      get: metricSwagger.projectMetrics,
    },
    '/metric/life-time-issues/projects': {
      get: metricSwagger.lifeTimeIssuesMetric,
    },
  },
  components: {
    schemas: {},
  },
};

module.exports = (express) => {
  const router = express.Router();
  router.use('/', swaggerUi.serve);
  router.get('/api-docs', swaggerUi.setup(swaggerDocument));

  return router;
};
