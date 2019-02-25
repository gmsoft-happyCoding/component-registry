'use strict';

const fsExtra = require('fs-extra');
const path = require('path');
const { Service } = require('egg');

class ProjectsService extends Service {
  /**
   * @return {string} - 组件发布的根目录
   */
  getRegistryRoot() {
    return path.normalize(this.ctx.app.config.registryRoot);
  }

  /**
   * 获取组件url
   * @param {Object} args - args
   * @param {string} args.projectName - 项目名称
   * @param {string} args.componentName - 组件名称
   */
  async getUrl({ projectName, componentName }) {
    try {
      const components = await fsExtra.readJson(
        path.join(this.getRegistryRoot(), projectName, 'asset-manifest.json')
      );
      return components[`${componentName}.js`];
    } catch (e) {
      return null;
    }
  }

  /**
   * 获取组件元信息
   * @param {Object} args - args
   * @param {string} args.projectName - 项目名称
   * @param {string} args.componentName - 组件名称
   */
  async getMeta({ projectName, componentName }) {
    try {
      const meta = await fsExtra.readJson(
        path.join(this.getRegistryRoot(), projectName, 'meta', `${componentName}.json`)
      );
      return meta;
    } catch (e) {
      return null;
    }
  }
}

module.exports = ProjectsService;
