'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 列出所有项目
  router.get('/api/projects', controller.projects.index);
  // 列出所有项目组件
  router.get('/api/projects/:projectName/components', controller.projects.components);
  // 获取组件url
  router.get('/api/projects/:projectName/components/:componentName/url', controller.components.url);
  // 获取组件meta
  router.get(
    '/api/projects/:projectName/components/:componentName/meta',
    controller.components.meta
  );
};
