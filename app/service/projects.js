'use strict';

const fs = require('mz/fs');
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
   * 判断项目是否存在
   * @param {string} projectName - 项目名称
   */
  async projectIsExist(projectName) {
    const registryRoot = this.getRegistryRoot();
    const project = path.join(registryRoot, projectName);
    try {
      const projectStat = await fs.stat(project);
      return projectStat && projectStat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  /**
   * 读取componentRoot目录下所有的一级目录
   * 一个目录为一个组件项目
   * @param {boolean} getComponentInfo - 是否获取项目组件数量
   */
  async getProjects(getComponentInfo = false) {
    const registryRoot = this.getRegistryRoot();
    const files = await fs.readdir(registryRoot);

    const dirPromises = files.map(async file => {
      if (await this.projectIsExist(file)) {
        // 读取组件信息
        if (getComponentInfo) {
          const components = await this.getComponents({ projectName: file });
          return { name: file, componentCount: components.length };
        }
        return { name: file };
      }
    });

    const dirs = await Promise.all(dirPromises);
    const projects = dirs.filter(Boolean);
    return projects;
  }

  /**
   * 获取项目下有哪些组件

   * @param {Object} args - args
   * @param {string} args.projectName - 项目名称
   */
  async getComponents({ projectName }) {
    if (await this.projectIsExist(projectName)) {
      const components = await fs.readdir(path.join(this.getRegistryRoot(), projectName, 'meta'));
      return components.map(components => components.split('.')[0]) || [];
    }
    return null;
  }
}

module.exports = ProjectsService;
