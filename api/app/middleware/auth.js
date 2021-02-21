module.exports = async function auth(ctx, next) {
  //   白名单外的所有接口都需要经过用户认证
  const whiteList = ['/login', '/register'];
  const { request, logger, app } = ctx;
  const reg = new RegExp('^' + whiteList.map((item) => `(${item})`).join('|'));
  if (!reg.test(request.url)) {
    const userToken = request.header['x-access-token'];
    console.log('userToken', userToken);
    if (!userToken) {
      ctx.body = {
        code: '401',
        msg: 'token invalid',
      };
      return false;
    }
    const user = await app.model.User.findOne({
      where: {
        token: userToken,
      },
    });
    if (!user) {
      ctx.body = {
        code: '401',
        msg: 'token invalid',
      };
      return false;
    }
    logger.info('auth passed');
    ctx.app.userInfo = {
      id: user.id,
      name: user.username,
      token: user.token,
    };
  }
  await next();
};
