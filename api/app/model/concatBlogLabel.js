'use strict';
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Instance = app.model.define('concat_blog_labels', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    blog_id: STRING(32),
    label_id: STRING(32),
    created_at: DATE,
    updated_at: DATE,
  });
  Instance.associate = function () {
    Instance.belongsTo(app.model.Blog, {
      foreignKey: 'blog_id',
      targetKey: 'id',
    });
    Instance.belongsTo(app.model.Label, {
      foreignKey: 'label_id',
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
  return Instance;
};
