'use strict';

const { Controller } = require('egg');
const error_code = require('../error_code');
/**
 * @Controller Projects
 */
class ProjectsController extends Controller {
  /**
   * @summary 获取当前发布的项目列表
   * @Router get /projects
   * @Response 200 projectsResponse ok
   * @Response 404 errorResponse 错误信息 {res: 错误代码, msg: 错误信息}
   */
  async index() {
    const { ctx } = this;
    const projects = await ctx.service.projects.getProjects();
    ctx.body = { projects: projects.map(project => project.name) };
  }

  /**
   * @summary 获取项目的组件列表
   * @Router get /projects/{projectName}/components
   * @Request path string projectName 项目名称
   * @Request query boolean workflow 过滤工作UI流组件
   * @Response 200 componentsResponse ok
   * @Response 404 errorResponse 错误信息 {res: 错误代码, msg: 错误信息}
   */
  async components() {
    const { ctx } = this;
    ctx.validate({ projectName: 'string' }, ctx.params);
    const components = await ctx.service.projects.getComponents({ ...ctx.params, ...ctx.query });
    if (components) ctx.body = { components };
    else ctx.throw(404, 'project does not exist', { code: error_code.PROJECT_NOT_EXIST });
  }
}

module.exports = ProjectsController;
