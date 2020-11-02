require('jest');
require('dotenv').config();

const request = require('supertest');
const { app } = require('../../src/app');
const ProjectTrackingShema = require('../../src/models/project-tracking');
const UserTrackingSchema = require('../../src/models/user-tracking');
const connection = require('../../src/config/db-connection');
const { getData } = require('../../src/helpers/redis');

process.env.NODE_ENV = 'test';

jest.setTimeout(20000);

// eslint-disable-next-line global-require
jest.mock('redis', () => require('redis-mock'));

jest.mock('../../src/helpers/redis');

describe('Metric Controller', () => {
  describe('#getProjectMetrics', () => {
    beforeAll(async (done) => {
      await connection.create();
      done();
    });

    beforeEach(async (done) => {
      await ProjectTrackingShema.deleteMany({});
      await UserTrackingSchema.deleteMany({});
      done();
    });

    describe('If there is no cached data', () => {
      it('Should get project metrics and save data tracking', (done) => {
        request(app)
          .get('/metric/project?projectName=vue&userId=123')
          .end((error, response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe('If there is cached data', () => {
      it('Should get project metrics and save data tracking', (done) => {
        getData.mockReturnValueOnce(Promise.resolve('{"cachedPayload":{"issues":500}, "projectData": {}}'));
        request(app)
          .get('/metric/project?projectName=vue&userId=123')
          .end((error, response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe('If isnt possible to find data on Github API', () => {
      it('Should get project metrics and save data tracking', (done) => {
        request(app)
          .get('/metric/project?projectName=bnfaifbaiewhfiawuhfiaw&userId=123')
          .end((error, response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
    });

    afterAll(async (done) => {
      await connection.end();
      done();
    });
  });

  describe('#getProjectMetricsAlongTime', () => {
    describe('If there is no cached data', () => {
      it('Should get projects issues metrics along project lifetime', (done) => {
        request(app)
          .get('/metric/life-time-issues/projects?projectsFullNames=vuejs/vue,facebook/react')
          .end((error, response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe('If there is cached data', () => {
      it('Should get projects issues metrics along project lifetime', (done) => {
        getData.mockReturnValue(Promise.resolve('{"cachedPayload":{"issues":500}}'));
        request(app)
          .get('/metric/life-time-issues/projects?projectsFullNames=vuejs/vue,facebook/react')
          .end((error, response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });
  });
});
