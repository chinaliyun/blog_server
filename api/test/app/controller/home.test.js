'use strict';
const { app } = require('egg-mock/bootstrap');
describe('test/controller/home.test.js', () => {
  // test cases
  it('should get a ctx', () => {
    return app.httpRequest().get('/').expect(200);
  });
});
