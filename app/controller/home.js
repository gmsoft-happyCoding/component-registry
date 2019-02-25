'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const projects = await ctx.service.projects.getProjects(true);
    await ctx.render('home.tpl', { projects });
  }
}

module.exports = HomeController;
