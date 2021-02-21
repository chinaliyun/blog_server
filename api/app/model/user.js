'use strict';
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Instance = app.model.define(
    'user',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(30),
      password: STRING(256),
      token: STRING(256),
      created_at: DATE,
      updated_at: DATE,
    },
    {
      timestamps: false,
    },
  );
  // 统计用户文章数量
  Instance.countBlog = async function (id) {
    const one = await this.findOne({
      where: {
        id,
      },
    });
    return one['blog_count'];
  };
  return Instance;
};
