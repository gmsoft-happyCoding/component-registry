'use strict';

const fs = require('mz/fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { filter, orderBy } = require('lodash');
const { Service } = require('egg');

class ProjectsService extends Service {
  /**
   * @return {string} - 组件发布的根目录
   */
  getComponentsRoot() {
    return path.normalize(this.ctx.app.config.componentsRoot);
  }

  /**
   * 构造组件url
   * @param {string} projectName - 项目名称
   * @param {*} componentFile - 组件文件名称
   * @return {string} - 组件url
   */
  buildComponentUrl(projectName, componentFile) {
    return `//${this.ctx.app.config.serverName}/${projectName}/static/js/${componentFile}`;
  }

  /**
   * 获取组件url
   * @param {Object} args - args
   * @param {string} args.projectName - 项目名称
   * @param {string} args.componentName - 组件名称
   */
  async getUrl({ projectName, componentName }) {
    try {
      // 组件文件所在目录
      const dir = path.join(this.getComponentsRoot(), projectName, 'static', 'js');
      const files = await fs.readdir(dir);
      const components = filter(
        files,
        file => file.startsWith(componentName) && path.extname(file) === '.js'
      );
      // 没有找到组件
      if (components.length === 0) return null;
      // 找到一个组件
      if (components.length === 1) return this.buildComponentUrl(projectName, components[0]);

      // 如果找到多个组件(版本), 按照时间排倒序
      const orderedComponents = orderBy(
        components,
        [ component => fs.statSync(path.join(dir, component)).mtimeMs ],
        [ 'desc' ]
      );

      return this.buildComponentUrl(projectName, orderedComponents[0]);
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
        path.join(this.getComponentsRoot(), projectName, 'meta', `${componentName}.json`)
      );
      return meta;
    } catch (e) {
      return null;
    }
  }
}

module.exports = ProjectsService;
