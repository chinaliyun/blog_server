'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Instance = app.model.define(
    'blog',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: STRING(256), // 用户ID
      name: STRING(100),
      hash: STRING(256),
      content: TEXT,
      view_count: { type: INTEGER, defaultValue: 0 },
      folder_id: STRING,
      status: { type: INTEGER, defaultValue: 0 }, // 0 默认值 ,1 可展示，2 被删除
      created_at: {
        type: DATE,
      },
      updated_at: DATE,
    },
    {
      timestamps: false,
    }
  );
  Instance.associate = function () {
    Instance.hasOne(app.model.ConcatBlogLabel, {
      foreignKey: 'blog_id',
      targetKey: 'id',
    });
  };
  Instance.findById = async function (id) {
    return await this.findOne({
      where: {
        id,
      },
    });
  };
  Instance.findPrev = async function (id) {
    return await this.findOne({
      attributes: [
        'id',
        'name',
        // 'content',
        'hash',
        // 'folder_id',
        // 'created_at',
        // 'view_count',
        [
          app.Sequelize.fn(
            'group_concat',
            app.Sequelize.literal('`concat_blog_label`.`label_id`'),
            ','
          ),
          'labels',
        ],
      ],
      include: [
        {
          model: app.model.ConcatBlogLabel,
          attributes: [],
        },
      ],
      where: {
        id: {
          [app.Sequelize.Op.lt]: id,
        },
        status: 1,
      },
      order: [['id', 'DESC']],
      group: ['id', 'name', 'content', 'folder_id'],
    });
  };
  Instance.findNext = async function (id) {
    return await this.findOne({
      attributes: [
        'id',
        'name',
        // 'content',
        'hash',
        // 'folder_id',
        // 'created_at',
        // 'view_count',
        [
          app.Sequelize.fn(
            'group_concat',
            app.Sequelize.literal('`concat_blog_label`.`label_id`'),
            ','
          ),
          'labels',
        ],
      ],
      include: [
        {
          model: app.model.ConcatBlogLabel,
          attributes: [],
        },
      ],
      where: {
        id: {
          [app.Sequelize.Op.gt]: id,
        },
        status: 1,
      },
      group: ['id', 'name', 'content', 'folder_id'],
    });
  };
  Instance.findByHash = async function (hash) {
    return await this.findOne({
      attributes: [
        'id',
        'name',
        'content',
        'hash',
        'folder_id',
        'created_at',
        'view_count',
        [
          app.Sequelize.fn(
            'group_concat',
            app.Sequelize.literal('`concat_blog_label`.`label_id`'),
            ','
          ),
          'labels',
        ],
      ],
      include: [
        {
          model: app.model.ConcatBlogLabel,
          attributes: [],
        },
      ],
      where: {
        hash,
        // status: 1,
      },
      group: ['id', 'name', 'content', 'folder_id'],
    });
  };

  return Instance;
};
