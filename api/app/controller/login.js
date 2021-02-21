'use strict';
const Controller = require('egg').Controller;

class loginController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { logger } = ctx;

    logger.info(ctx.request.body);

    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (username == '' || password == '') {
      ctx.body = {
        code: 500,
        msg: '用户名或密码不能为空',
      };
      return false;
    }

    const user = await ctx.model.User.findOne({
      where: {
        username,
      },
    });
    if (!user || user.password !== password) {
      ctx.body = {
        code: 500,
        msg: '账号或密码输入错误',
      };
      return false;
    }

    const token = ctx.helper.randomToken();
    const row = await ctx.model.User.update(
      {
        token,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
    console.log(row);
    if (row[0] == 0) {
      ctx.body = {
        code: 500,
        msg: '登录失败',
      };
      return false;
    }

    ctx.body = {
      code: 200,
      data: {
        token,
      },
    };
  }
}
module.exports = loginController;
