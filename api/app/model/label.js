'use strict';
// const moment = require('moment');
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Instance = app.model.define(
    'dict_labels',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(20),
      status: STRING(10),
      created_at: {
        type: DATE,
      },
      updated_at: {
        type: DATE,
      },
    },
    {
      timestamps: false,
    },
  );
  Instance.associate = function () {
    Instance.hasOne(app.model.ConcatBlogLabel, {
      as: 'concat',
      foreignKey: 'label_id',
      targetKey: 'id',
    });
  };
  Instance.findByName = async function (labels) {
    return await this.findOne({
      where: {
        status: 1,
        [app.Sequelize.Op.not]: {
          id: labels,
        },
      },
    });
  };
  Instance.getAllLabels = async function () {
    return await this.findAll({
      attributes: [
        'id',
        'name',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
        [
          app.Sequelize.fn(
            'count',
            app.Sequelize.literal('`concat->blog`.`name`'),
          ),
          'nums',
        ],
      ],
      include: [
        {
          model: app.model.ConcatBlogLabel,
          as: 'concat',
          attributes: [],
          include: [
            {
              model: app.model.Blog,
              attributes: [],
            },
          ],
        },
      ],
      group: ['dict_labels.name', 'dict_labels.id'],
    });
  };
  Instance.countAll = async function () {
    return await this.count({
      where: {
        status: 1,
      },
    });
  };

  return Instance;
};
