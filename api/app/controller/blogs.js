'use strict';

const Controller = require('egg').Controller;

class BlogsController extends Controller {
  async index() {
    const { app, response: res, request: req, logger } = this.ctx;

    let {
      pageNo = 1,
      pageSize = 10,
      label_id = '',
      folder_id = '',
      keywords = '',
      order = 'desc',
      by = 'created_at',
      // eslint-disable-next-line no-unused-vars
      limit = '10',
      // eslint-disable-next-line no-unused-vars
      offset = '0',
      status = 1,
    } = req.query;
    const { Sequelize } = app;
    pageNo = isNaN(parseInt(pageNo, 10)) ? 1 : parseInt(pageNo, 10);
    pageSize = isNaN(parseInt(pageSize, 10)) ? 10 : parseInt(pageSize, 10);
    label_id = isNaN(parseInt(label_id, 10)) ? '' : parseInt(label_id, 10);
    folder_id = isNaN(parseInt(folder_id, 10)) ? '' : parseInt(folder_id, 10);
    status = isNaN(parseInt(status, 10)) ? 1 : parseInt(status, 10);
    offset = isNaN(parseInt(offset, 10)) ? 1 : parseInt(offset, 10);
    limit = isNaN(parseInt(limit, 10)) ? 10 : parseInt(limit, 10);
    if (!/^(asc|desc)$/.test(order)) {
      logger.info('order值无效');
      res.body = {
        code: 401,
      };
      return;
    }
    // 判断排序字段是否有效
    if (by !== 'created_at') {
      const columns = await app.model.Blog.describe();
      if (by in columns) {
        by = 'created_at';
      }
    }
    const condation = {
      status,
    };

    if (folder_id) {
      condation.folder_id = folder_id;
    }
    if (keywords) {
      condation.name = {
        [Sequelize.Op.like]: `%${keywords}%`,
      };
    }
    let blogs = [],
      blog_count = 0;
    if (label_id) {
      blogs = await app.model.Blog.findAll({
        where: condation,
        order: [[by, order]],
        limit: pageSize,
        include: [
          {
            model: app.model.ConcatBlogLabel,
            attributes: ['label_id'],
            where: {
              label_id,
            },
          },
        ],
        offset: (pageNo - 1) * pageSize,
      });
      blog_count = await app.model.Blog.count({
        where: condation,
        include: [
          {
            model: app.model.ConcatBlogLabel,
            attributes: ['label_id'],
            where: {
              label_id,
            },
          },
        ],
      });
    } else {
      blogs = await app.model.Blog.findAll({
        where: condation,
        order: [['created_at', 'desc']],
        limit: pageSize,
        offset: (pageNo - 1) * pageSize,
      });
      blog_count = await app.model.Blog.count({
        where: condation,
      });
    }

    res.body = {
      list: blogs,
      total: blog_count,
    };
  }
  async show() {
    const { response: res, app, params } = this.ctx;
    const hash = params.id;
    const blog = await app.model.Blog.findByHash(hash);
    if (!blog) {
      res.body = {
        code: 401,
      };
      return false;
    }
    // 查询相邻的两篇文章
    console.log('blog.id', blog.id);
    const prevBlog = await app.model.Blog.findPrev(blog.id);
    const nextBlog = await app.model.Blog.findNext(blog.id);

    blog.increment('view_count');
    res.body = {
      blog,
      prev: prevBlog,
      next: nextBlog,
    };
  }
  async create() {
    const { app, request: req, response: res, helper } = this.ctx;
    let { title, content, hash, labels = [], folder_id } = req.body;
    title && (title = title.trim());
    content && (content = content.trim());
    hash && (hash = hash.trim());
    folder_id && (folder_id = String(folder_id).trim());

    if (!title) {
      res.body = {
        msg: '标题不能为空',
      };
      return;
    }
    if (!content) {
      res.body = {
        msg: '内容不能为空',
      };
      return;
    }
    if (!Array.isArray(labels)) {
      res.body = {
        code: 401,
      };
      return;
    }

    // 判断目录ID是否有效
    if (folder_id) {
      const folder = await app.model.Folder.findOne({
        where: {
          id: folder_id,
        },
      });
      if (!folder) {
        res.body = {
          code: 401,
        };
        return;
      }
    }

    const blogHash = hash || helper.randomToken(32);
    const tr = await app.model.transaction();
    try {
      const blog = await app.model.Blog.create(
        {
          name: title,
          content,
          user_id: app.userInfo.id,
          hash: blogHash,
          folder_id,
          status: 1,
          created_at: helper.now(),
          updated_at: helper.now(),
        },
        {
          transaction: tr,
        }
      );

      if (labels.length > 0) {
        // 插入新的标签记录
        await app.model.ConcatBlogLabel.bulkCreate(
          [
            ...labels.map(item => {
              return {
                label_id: item,
                blog_id: blog.id,
                created_at: helper.now(),
                updated_at: helper.now(),
              };
            }),
          ],
          {
            transaction: tr,
          }
        );
      }
      tr.commit();
      res.body = blog;
    } catch (e) {
      console.log(e);
      tr.rollback();
      res.body = {
        code: 500,
      };
    }
  }

  async update() {
    // 根据ID修改文章内容
    const { app, request: req, response: res, helper } = this.ctx;
    let { title, content, labels = [], id, folder_id, status } = req.body;
    title && (title = title.trim());
    content && (content = content.trim());
    id && (id = String(id).trim());
    folder_id && (folder_id = String(folder_id).trim());

    if (!id) {
      res.body = {
        code: 401,
      };
      return false;
    }

    if (!title) {
      res.body = {
        msg: '标题不能为空',
      };
      return false;
    }
    // 判断status是否是非法值
    if (status && !/^[0-2]$/g.test(status)) {
      res.body = {
        code: 401,
      };
      return false;
    }
    if (!content) {
      res.body = {
        msg: '内容不能为空',
      };
      return false;
    }
    console.log('参数校验通过');
    const blog = await app.model.Blog.findById(id);

    if (!blog) {
      res.body = {
        code: 401,
      };
      return false;
    }

    // 判断标签值是否有效
    if (labels.length > 0) {
      const label = await app.model.Label.findByName(labels);
      if (label) {
        if (!blog) {
          res.body = {
            msg: '存在非法标签，请稍后重新配置标签',
          };
          return false;
        }
      }
    }
    // 判断目录ID是否有效
    if (folder_id) {
      const folder = await app.model.Folder.findByPk(folder_id);
      if (!folder) {
        res.body = {
          code: 401,
        };
        return;
      }
    }
    // 更新文章内容
    const tr = await app.model.transaction();
    try {
      if (labels.length > 0) {
        // 删除已有对照记录
        await app.model.ConcatBlogLabel.destroy(
          {
            where: {
              blog_id: blog.id,
            },
          },
          {
            transaction: tr,
          }
        );
      }
      await blog.update(
        {
          name: title,
          content,
          labels: labels.join(','),
          folder_id,
          status: status || 1,
          updated_at: helper.now(),
        },
        {
          transaction: tr,
        }
      );
      if (labels.length > 0) {
        // 插入新的标签记录
        await app.model.ConcatBlogLabel.bulkCreate(
          [
            ...labels.map(item => {
              return {
                label_id: item,
                blog_id: blog.id,
                created_at: helper.now(),
                updated_at: helper.now(),
              };
            }),
          ],
          {
            transaction: tr,
          }
        );
      }
      tr.commit();
      res.body = blog;
    } catch (e) {
      console.log(e);
      tr.rollback();
      res.body = {
        code: 500,
      };
    }
  }

  async destroy() {
    const { request: req, response: res, app, params } = this.ctx;
    const id = params.id.trim();
    if (!id) {
      this.logger.log('id为空', id);
      res.body = {
        code: 401,
      };
      return;
    }
    // 判断ID是否有效
    const blog = await app.model.Blog.findOne({
      where: {
        id,
      },
    });
    if (!blog) {
      logger.error('文章id无效', id);
      res.body = {
        code: 401,
      };
      return;
    }
    await blog.update({
      status: 2,
    });
  }
}
module.exports = BlogsController;
