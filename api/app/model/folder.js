'use strict';
// const moment = require('moment');
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Instance = app.model.define(
    'folders',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      created_at: { type: DATE },
      updated_at: { type: DATE },
    },
    {
      timestamps: false,
    },
  );
  Instance.associate = function () {
    Instance.hasOne(app.model.Blog, {
      foreignKey: 'folder_id',
      targetKey: 'id',
    });
  };
  Instance.getAllFolders = async function () {
    return await this.findAll({
      attributes: [
        'id',
        'name',
        'created_at',
        'updated_at',
        [
          app.Sequelize.fn('count', app.Sequelize.literal('`blog`.`name`')),
          'nums',
        ],
      ],
      include: [
        {
          model: app.model.Blog,
          attributes: [],
        },
      ],
      group: ['id', 'name'],
    });
  };
  return Instance;
};
