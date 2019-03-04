'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  alinode: {
    enable: true,
    package: 'egg-alinode',
  },
};
