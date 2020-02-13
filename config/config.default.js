/* eslint-disable array-bracket-spacing */
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.tpl': 'nunjucks',
      },
    },
    security: {
      csrf: {
        enable: false,
      },
    },
  };

  config.proxy = true;
  config.hostHeaders = 'X-Forwarded-Host';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550733099928_9764';

  // add your middleware config here
  config.middleware = ['cors', 'errorHandler'];
  // 只对 /api 前缀的 url 路径生效
  config.errorHandler = { match: '/api' };
  // 跨域请求
  config.cors = {
    // 允许携带cookie
    credentials: true,
  };

  config.swaggerdoc = {
    dirScanner: './app/controller',
    basePath: '/api',
    apiInfo: {
      title: 'component-registry',
      description: '提供项目和组件相关api',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true,
  };

  config.alinode = {
    // 从 `Node.js 性能平台` 获取对应的接入参数
    appid: '@appid@',
    secret: '@secret@',
  };

  // add your user config here
  const userConfig = {
    componentsRoot: '@componentsRoot@',
  };

  return {
    ...config,
    ...userConfig,
  };
};
