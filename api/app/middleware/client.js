'use strict';
module.exports = async (ctx, next) => {
  //   白名单外的所有接口都需要经过用户认证
  console.log(
    `-------------------------${ctx.request.method}--${ctx.request.url}--`,
  );
  if (Object.keys(ctx.request.query).length > 0) {
    console.log('query:', ctx.request.query);
  }
  if (Object.keys(ctx.request.body).length > 0) {
    console.log('body', ctx.request.body);
  }
  await next();
  // console.log('body:', ctx.body.dataValues || ctx.body);
  if (!ctx.body) {
    ctx.body = {
      code: 200,
    };
    return;
  }

  if (ctx.body.msg) {
    ctx.body = {
      code: ctx.body.code || 500,
      msg: ctx.body.msg || 'programer failed',
    };
    return;
  }
  ctx.body = {
    code: 200,
    data: ctx.body,
  };
};
