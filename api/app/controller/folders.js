'use strict';

const Controller = require('egg').Controller;

class LablesController extends Controller {
  async index() {
    const { app } = this.ctx;
    const folders_list = await app.model.Folder.getAllFolders();
    this.ctx.body = {
      total: 0,
      list: folders_list,
    };
  }

  async show() {
    const { params, response: res, app } = this.ctx;
    const id = params.id;

    const folder = await app.model.Folder.findByPk(id);
    if (!folder) {
      res.body = {
        code: 401,
      };
      return;
    }
    res.body = folder;
  }

  async create() {
    const { request: req, response: res, app, helper } = this.ctx;
    const name = req.body.name.trim();
    if (!name) {
      res.body = {
        code: 401,
      };
      return;
    }
    const folder = await app.model.Folder.findOne({
      where: {
        name,
      },
    });
    if (folder) {
      res.body = {
        msg: '分组已存在',
      };
      return;
    }

    try {
      const folder = await app.model.Folder.create({
        name,
        created_at: helper.now(),
        updated_at: helper.now(),
      });
      res.body = folder;
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
        msg: '分组新增失败',
      };
    }
  }
  async update() {
    const { request: req, response: res, app, params, helper } = this.ctx;
    const name = req.body.name.trim();
    const id = params.id;
    if (!id) {
      res.body = {
        code: 401,
      };
      return;
    }
    if (!name) {
      res.body = {
        code: 401,
      };
      return;
    }
    let folder = await app.model.Folder.findOne({
      where: {
        name,
        id: {
          [app.Sequelize.Op.ne]: id,
        },
      },
    });
    if (folder) {
      res.body = {
        msg: '分组名已存在',
      };
      return;
    }
    folder = await app.model.Folder.findOne({
      where: {
        id,
      },
    });
    if (!folder) {
      res.body = {
        code: 401,
      };
      return;
    }

    try {
      await folder.update({
        name,
        updated_at: helper.now(),
      });
      res.body = folder;
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
        msg: '分组新增失败',
      };
    }
  }
  async destroy() {
    const { params, response: res, app } = this.ctx;
    const id = params.id;

    // 判断ID是否有效
    const folder = await app.model.Folder.findByPk(id);
    if (!folder) {
      res.body = {
        code: 401,
      };
      return;
    }
    // 判断id是否有文章关联
    const line = await app.model.Blog.findOne({
      where: {
        folder_id: id,
      },
    });
    if (line) {
      res.body = {
        msg: '该目录下关联了多个文章，请修改后重试',
      };
      return;
    }
    try {
      await folder.destroy();
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
      };
    }
  }
}
module.exports = LablesController;
