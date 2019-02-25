'use strict';

const { Controller } = require('egg');
const error_code = require('../error_code');

const rule = { projectName: 'string', componentName: 'string' };

/**
 * @Controller Components
 */
class ComponentsController extends Controller {
  /**
   * @summary 获取组件的加载地址
   * @Router get /projects/{projectName}/components/{componentName}/url
   * @Request path string projectName 项目名称
   * @Request path string componentName 组件名称
   * @Response 200 urlResponse ok
   * @Response 404 errorResponse 错误信息 {res: 错误代码, msg: 错误信息}
   */
  async url() {
    const { ctx } = this;
    ctx.validate(rule, ctx.params);
    const url = await ctx.service.components.getUrl(ctx.params);
    if (url) ctx.body = { url };
    else ctx.throw(404, 'component does not exist', { code: error_code.COMPONENT_NOT_EXIST });
  }

  /**
   * @summary 获取组件元信息
   * @Router get /projects/{projectName}/components/{componentName}/meta
   * @Request path string projectName 项目名称
   * @Request path string componentName 组件名称
   * @Response 200 metaResponse ok
   * @Response 404 errorResponse 错误信息 {res: 错误代码, msg: 错误信息}
   */
  async meta() {
    const { ctx } = this;
    ctx.validate(rule, ctx.params);
    const meta = await ctx.service.components.getMeta(ctx.params);
    if (meta) ctx.body = meta;
    else ctx.throw(404, 'component does not exist', { code: error_code.COMPONENT_NOT_EXIST });
  }
}

module.exports = ComponentsController;
