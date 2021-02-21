'use strict';
const path = require('path');
const fs = require('fs');
const Controller = require('egg').Controller;

class uploadController extends Controller {
  async index() {
    const { ctx, logger } = this;
    const { request } = ctx;
    let { hash, type } = request.body;
    hash && (hash = hash.trim());
    console.log(request.files);
    if ((!!hash && hash.length !== 32) || !type || request.files.length === 0) {
      logger.warn('hash格式错误', hash);
      ctx.body = {
        code: 401,
      };
      return;
    }
    if (type === 'blog') {
      await this.blog();
      return;
    }
  }
  // async show() {
  //   console.log('show');
  //   const { request: req, response: res, params, app } = this.ctx;
  //   console.log(params);
  //   const filePath = path.resolve(
  //     app.baseDir,
  //     `./uploads/blogs/${params.id}/images/${params.path}`,
  //   );
  //   console.log(filePath);
  //   res.set('Content-Type', 'application/octet-stream');
  //   const stream = fs.createReadStream(filePath);
  //   res.body = stream;
  //   return;
  // }
  async blog() {
    const { ctx, logger } = this;
    const { app, request, model, helper } = ctx;
    let { id } = request.body;
    id && (id = id.trim());
    const blogHash = helper.randomToken(32);
    const baseDir = path.resolve(app.baseDir, './uploads');
    const docsDir = path.resolve(baseDir, './blogs');
    let blogDir = path.resolve(docsDir, `./${blogHash}`);

    let blog;
    if (id) {
      // 如果有id，先检查id对应的文章是否存在
      blog = await model.Blog.findOne({
        where: {
          id,
        },
      });
      if (!blog) {
        logger.warn('文章ID无效', id);
        ctx.body = {
          code: 401,
        };
        return;
      }
      // 找到文章后，重新定义文章目录位置
      blogDir = path.resolve(docsDir, `./${blog.hash}`);
    }
    if (!id) {
      // 如果没有id，就是新文章，创建文章对应的目录文件
      try {
        if (!fs.existsSync(baseDir)) {
          fs.mkdirSync(baseDir);
        }
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir);
        }
        if (!fs.existsSync(blogDir)) {
          fs.mkdirSync(blogDir);
          fs.mkdirSync(path.resolve(blogDir, './images'));
        }
      } catch (e) {
        console.log(e);
        logger.warn('文章目录创建失败');
        ctx.body = {
          code: 500,
        };
        return;
      }
    }
    // 处理图片文件
    const picHash = helper.randomToken(32);
    // savePath 保存进数据库的路径
    const savePath = `./images/${picHash}${path.extname(
      request.files[0].filepath
    )}`;
    // realPath 文件将要移动到的最终路径
    const realPath = path.resolve(
      blogDir,
      `./images/${picHash}${path.extname(request.files[0].filename)}`
    );
    const tr = await app.model.transaction();
    try {
      // 如果没有ID 先创建对应的文章
      if (!id) {
        blog = await app.model.Blog.create(
          {
            hash: blogHash,
            user_id: app.userInfo.id,
            created_at: helper.now(),
            updated_at: helper.now(),
          },
          {
            transaction: tr,
          }
        );
      }
      console.log('fs.existsSync', fs.existsSync(request.files[0].filepath));
      console.log(blogDir, realPath);
      fs.renameSync(request.files[0].filepath, realPath);
      await app.model.Picture.create(
        {
          name: picHash,
          blog_id: blog.id,
          path: savePath,
          created_at: helper.now(),
          updated_at: helper.now(),
        },
        {
          transaction: tr,
        }
      );

      await tr.commit();
      ctx.body = {
        path: savePath,
        blog,
      };
    } catch (e) {
      logger.error(e);
      await tr.rollback();
      // mysql回滚
      ctx.body = {
        code: 500,
      };
    }
  }
}

module.exports = uploadController;
