'use strict';

const Controller = require('egg').Controller;

class LablesController extends Controller {
  async index() {
    const { app, response: res } = this.ctx;
    const labels = await app.model.Label.getAllLabels();
    res.body = {
      list: labels,
    };
  }

  async show() {
    const { params, response: res, app } = this.ctx;
    const id = params.id;

    const label = await app.model.Label.findByPk(id);
    if (!label) {
      res.body = {
        code: 401,
      };
      return;
    }
    res.body = label;
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
    const label = await app.model.Label.findOne({
      where: {
        name,
      },
    });
    if (label) {
      res.body = {
        msg: '标签已存在',
      };
      return;
    }

    try {
      const label = await app.model.Label.create({
        name,
        created_at: helper.now(),
        updated_at: helper.now(),
      });
      res.body = label;
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
        msg: '标签新增失败',
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
    let label = await app.model.Label.findOne({
      where: {
        name,
        id: {
          [app.Sequelize.Op.ne]: id,
        },
      },
    });
    if (label) {
      res.body = {
        msg: '标签名已存在',
      };
      return;
    }
    label = await app.model.Label.findOne({
      where: {
        id,
      },
    });
    if (!label) {
      res.body = {
        code: 401,
      };
      return;
    }

    try {
      await label.update({
        name,
        updated_at: helper.now(),
      });
      res.body = label;
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
        msg: '标签新增失败',
      };
    }
  }
  async destroy() {
    const { params, response: res, app } = this.ctx;
    const id = params.id;

    // 判断label_id是否有效
    const label = await app.model.Label.findByPk(id);
    if (!label) {
      res.body = {
        code: 401,
      };
      return;
    }
    // 判断id是否有文章关联
    const line = await app.model.ConcatBlogLabel.findOne({
      where: {
        label_id: id,
      },
    });
    if (line) {
      res.body = {
        msg: '该标签下关联了多个文章，请修改后重试',
      };
      return;
    }
    try {
      await label.destroy();
    } catch (e) {
      console.log(e);
      res.body = {
        code: 500,
      };
    }
  }
}
module.exports = LablesController;
