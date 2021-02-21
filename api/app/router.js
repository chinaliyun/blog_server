'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { client, auth } = app.middlewares;
  router.get('/', controller.home.index);
  router.post('/login', controller.login.index);
  router.post('/upload', client, auth, controller.upload.index);
  router.resources('users', '/users', auth, controller.users);

  router.get('/blogs', client, controller.blogs.index);
  router.get('/blogs/:id', client, controller.blogs.show);
  router.post('/blogs', client, auth, controller.blogs.create);
  router.post('/blogs/:id', client, auth, controller.blogs.update);
  router.delete('/blogs/:id', client, auth, controller.blogs.destroy);

  router.get('/labels', client, controller.labels.index);
  router.get('/labels/:id', client, controller.labels.show);
  router.post('/labels', client, auth, controller.labels.create);
  router.post('/labels/:id', client, auth, controller.labels.update);
  router.delete('/labels/:id', client, auth, controller.labels.destroy);

  router.get('/folders', client, controller.folders.index);
  router.get('/folders/:id', client, controller.folders.show);
  router.post('/folders', client, auth, controller.folders.create);
  router.post('/folders/:id', client, auth, controller.folders.update);
  router.delete('/folders/:id', client, auth, controller.folders.destroy);

  router.get('/migration', client, controller.migration.index);

  router.get(/static(.*)\.(png|jpg|jpeg|gif)/, controller.static.index);
};
