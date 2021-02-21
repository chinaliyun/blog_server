'use strict';

const CryptoJS = require('crypto-js');
const moment = require('moment');

function initPassword() {
  const key = 'jgtl99@JGTl20209';
  const iv = '1234567890123456';

  var ciphertext = CryptoJS.AES.encrypt(
    '123456',
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return ciphertext.toString();
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;

    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(30),
      password: STRING(256),
      token: STRING(256),
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: initPassword(),
      },
    ]);
    await queryInterface.createTable('blogs', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: STRING(256), // 用户ID
      name: STRING(100),
      content: TEXT,
      hash: STRING(256),
      view_count: { type: INTEGER, defaultValue: 0 },
      folder_id: STRING,
      status: { type: INTEGER, defaultValue: 0 }, // 0 默认值 ,1 可展示，2 被删除
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.createTable('dict_labels', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(20),
      status: { type: STRING(10), defaultValue: 1 }, // 0 默认值不显示， 1正常显示，2 已删除
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.bulkInsert('dict_labels', [
      {
        name: 'html',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: 'css',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: 'javascript',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },

      {
        name: 'php',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: 'java',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: 'python',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
    ]);
    await queryInterface.createTable('concat_blog_labels', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      blog_id: STRING(32),
      label_id: STRING(32),
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.createTable('folders', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(20),
      status: { type: STRING(10), defaultValue: 1 }, // 0 默认值不显示， 1正常显示，2 已删除
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.bulkInsert('folders', [
      {
        name: '未分类',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: '学习',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
      {
        name: '案例',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      },
    ]);
    await queryInterface.createTable('pictures', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      blog_id: STRING(32),
      blog_hash: STRING(32),
      path: STRING(100),
      created_at: { type: DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: Sequelize.NOW },
    });
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropDatabase('egg');
  },
};

/*
delimiter $$;
create trigger sumBlogCount after insert on blogs for each row update users set blog_count=blog_count+1 where id=new.user_id;


create trigger subBlogCount  after update on blogs  for each row  begin if new.status=0 or new.status=2 then update users set blog_count=blog_count-1 where id=1; elseif new.status=1 then update users set blog_count=blog_count+1 where id=new.user_id; end if;end;
$$ delimiter ;

*/
