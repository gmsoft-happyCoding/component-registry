'use strict';

const fs = require('mz/fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { Service } = require('egg');

// 获取组件名称
const componentName = fileName => fileName.split('.')[0];

// 过滤工作流UI组件
const workflowFilter = (componentsRoot, projectName, workflow) => componentFile => {
  const meta = fsExtra.readJsonSync(path.join(componentsRoot, projectName, 'meta', componentFile));
  return JSON.parse(workflow)
    ? meta.workflowFlag === true
    : meta.workflowFlag === false || meta.workflowFlag === undefined;
};

class ProjectsService extends Service {
  /**
   * @return {string} - 组件发布的根目录
   */
  getComponentsRoot() {
    return path.normalize(this.ctx.app.config.componentsRoot);
  }

  /**
   * 判断项目是否存在
   * @param {string} projectName - 项目名称
   */
  async projectIsExist(projectName) {
    const componentsRoot = this.getComponentsRoot();
    const project = path.join(componentsRoot, projectName);
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
    const componentsRoot = this.getComponentsRoot();
    const files = await fs.readdir(componentsRoot);

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
   * @param {boolean} args.workflow - 过滤工作UI流组件
   */
  async getComponents({ projectName, workflow }) {
    if (await this.projectIsExist(projectName)) {
      const components = await fs.readdir(path.join(this.getComponentsRoot(), projectName, 'meta'));

      if (!components) return [];

      // 不需要过滤 workflow
      if (workflow === undefined) {
        return components.map(componentName);
      }

      // 过滤 workflow
      return components
        .filter(workflowFilter(this.getComponentsRoot(), projectName, workflow))
        .map(componentName);
    }
    return null;
  }
}

module.exports = ProjectsService;
