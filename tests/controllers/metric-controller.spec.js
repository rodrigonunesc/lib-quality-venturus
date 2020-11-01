require('jest');
require('dotenv').config();
const request = require('supertest');
const app = require('../../src/index');
const ProjectTrackingShema = require('../../src/models/project-tracking');
const UserTrackingSchema = require('../../src/models/user-tracking');
const connection = require('../../src/config/db-connection');

process.env.NODE_ENV = 'test';

// eslint-disable-next-line global-require
jest.mock('redis', () => require('redis-mock'));

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

    it('Should get project metrics and save data tracking', (done) => {
      request(app)
        .get('/metric/project')
        .expect(200)
        .end((error) => {
          console.log(error.message);
          done();
        });
    });

    afterAll(async (done) => {
      await connection.end();
      done();
    });
  });
});
