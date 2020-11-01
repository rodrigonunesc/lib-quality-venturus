const projectMetrics = {
  tags: ['Metrics'],
  summary: 'Endpoint to extract metrics for a project from Github API',
  description: 'Metrics from Github projects',
  operationId: 'metric',
  consumes: ['application/json'],
  produces: ['application/json'],
  parameters: [
    {
      name: 'projectName',
      in: 'query',
      description: 'Project text that will be searched',
      required: false,
      type: 'string',
      example: 'angular',
    },
    {
      name: 'userId',
      in: 'query',
      description: 'UserId from LibQuality app. This is necessary for tracking.',
      required: false,
      type: 'string',
      example: '23414514',
    },
  ],
  responses: {
    200: {
      description: 'Metrics for the given project name',
    },
  },
};

const lifeTimeIssuesMetric = {
  tags: ['LifetimeIssuesMetric'],
  summary: 'Endpoint to extract life time metrics from issues for multiple projects.',
  description: 'Extract life time metrics from issues for multiple Github projects',
  operationId: 'lifeTimeIssuesMetric',
  consumes: ['application/json'],
  produces: ['application/json'],
  parameters: [
    {
      name: 'projectsFullNames',
      in: 'query',
      description: 'Projects full names separated by comma',
      required: false,
      type: 'string',
      example: 'vuejs/vue,facebook/react',
    },
  ],
  responses: {
    200: {
      description: 'Lifetime issues metrics for the given projects',
    },
  },
};

module.exports = {
  projectMetrics,
  lifeTimeIssuesMetric,
};
