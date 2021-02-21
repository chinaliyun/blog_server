'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // config/plugin.js
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
