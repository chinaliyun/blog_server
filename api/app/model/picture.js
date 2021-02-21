'use strict';
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Instance = app.model.define(
    'picture',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      blog_id: STRING(32),
      blog_hash: STRING(32),
      path: STRING(100),
      created_at: DATE,
      updated_at: DATE,
    },
    {
      timestamps: false,
    },
  );
  return Instance;
};
