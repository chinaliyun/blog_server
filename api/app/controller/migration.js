'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const moment = require('moment');

class MigrationController extends Controller {
  async index() {
    const { response: res, app, helper } = this.ctx;
    // 记录所有的文件
    const errorList = [];
    const sortList = [];

    // blog文章---------------------------------------
    let dirRoot = '/Users/liyun/www/self/blog/docs';
    let allFiles = fs.readdirSync(dirRoot);
    console.log('------');
    // 过滤已点开头的文件
    let validateFiles = allFiles.filter(item => {
      return !/^\./.test(item);
    });
    for (let n = 0; n < validateFiles.length; n++) {
      // for (let n = 0; n < 1; n++) {
      const cf = path.resolve(dirRoot + '/' + validateFiles[n] + '/readme.md');
      if (!fs.existsSync(cf)) {
        console.log(1, cf);
        errorList.push(cf);
        continue;
      }
      const content = fs.readFileSync(cf, 'utf8');
      //   console.log(content);
      // 读取文件标题
      const title = content.match(/^#\ (.*)/gm);
      if (!title || title.length === 0) {
        console.log(2, cf);
        errorList.push(cf);
        continue;
      }
      //   console.log(title);
      // 读取文件创建时间
      const createTime = content.match(/Date:\ (.*)\ /);
      if (!createTime || createTime.length === 0) {
        console.log(3, cf);
        errorList.push(cf);
        continue;
      }
      sortList.push({
        type: 1,
        path: path.resolve(dirRoot, './' + validateFiles[n]),
        time: createTime[1],
      });
    }
    // 处理html文件--------------------------------------
    dirRoot = '/Users/liyun/www/self/course/HTMLCSS';
    allFiles = fs.readdirSync(dirRoot);
    console.log('------');
    // 过滤已点开头的文件
    validateFiles = allFiles.filter(item => {
      return !/^\./.test(item);
    });
    for (let n = 0; n < validateFiles.length; n++) {
      // for (let n = 0; n < 1; n++) {
      const cf = path.resolve(dirRoot + '/' + validateFiles[n] + '/readme.md');
      if (!fs.existsSync(cf)) {
        console.log(4, cf);
        errorList.push(cf);
        continue;
      }
      // 循环处理
      // 读取文件内容
      // const content = fs.readFileSync(cf, 'utf8');
      // console.log(content);
      // 读取文件标题
      // let title = content.match(/^#\ (.*)/gm);
      // const title = validateFiles[n].split('-')[1];
      const title = validateFiles[n].slice(validateFiles[n].indexOf('-') + 1);
      if (!title || title.length === 0) {
        console.log(5, cf);
        errorList.push(cf);
        continue;
      }
      // console.log(title);
      // 读取文件创建时间
      // let createTime = content.match(/Date:\ (.*)\ /);
      let createTime = validateFiles[n].split('-')[0];
      createTime = moment(createTime, 'YYYYMMDDHHmmss').format(
        'YYYY-MM-DD HH:mm:ss'
      );
      // console.log(createTime);
      if (!createTime || createTime.length === 0) {
        console.log(6, cf);
        errorList.push(cf);
        continue;
      }
      sortList.push({
        type: 2,
        path: path.resolve(dirRoot, './' + validateFiles[n]),
        time: createTime,
      });
    }
    // 处理js文件--------------------------------------
    dirRoot = '/Users/liyun/www/self/course/JavaScript';
    allFiles = fs.readdirSync(dirRoot);
    console.log('------');
    // 过滤已点开头的文件
    validateFiles = allFiles.filter(item => {
      return !/^\./.test(item);
    });
    for (let n = 0; n < validateFiles.length; n++) {
      // for (let n = 0; n < 1; n++) {
      const cf = path.resolve(dirRoot + '/' + validateFiles[n] + '/readme.md');
      if (!fs.existsSync(cf)) {
        console.log(7, cf);
        errorList.push(cf);
        continue;
      }
      // 循环处理
      // 读取文件内容
      // const content = fs.readFileSync(cf, 'utf8');
      // console.log(content);
      // 读取文件标题
      // let title = content.match(/^#\ (.*)/gm);
      // const title = validateFiles[n].split('-')[1];
      const title = validateFiles[n].slice(validateFiles[n].indexOf('-') + 1);
      if (!title || title.length === 0) {
        console.log(8, cf);
        errorList.push(cf);
        continue;
      }
      // console.log(title);
      // 读取文件创建时间
      // let createTime = content.match(/Date:\ (.*)\ /);
      let createTime = validateFiles[n].split('-')[0];
      createTime = moment(createTime, 'YYYYMMDDHHmmss').format(
        'YYYY-MM-DD HH:mm:ss'
      );
      // console.log(createTime);
      if (!createTime || createTime.length === 0) {
        console.log(9, cf);
        errorList.push(cf);
        continue;
      }
      sortList.push({
        type: 3,
        path: path.resolve(dirRoot, './' + validateFiles[n]),
        time: createTime,
      });
    }

    sortList.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    // res.body = sortList.map(
    //   item => item.time + '-' + item.type + '-' + item.path
    // );
    // return;
    const data = [];
    const imgMap = [];
    for (let n = 0; n < sortList.length; n++) {
      const row = sortList[n];
      if (row.type === 1) {
        // const cf = path.resolve(
        //   dirRoot + '/' + validateFiles[n] + '/readme.md'
        // );
        const cf = path.resolve(row.path, './readme.md');

        if (!fs.existsSync(cf)) {
          console.log(10, cf);
          errorList.push(cf);
          continue;
        }
        // 循环处理
        // 读取文件内容
        let content = fs.readFileSync(cf, 'utf8');
        //   console.log(content);
        // 读取文件标题
        const title = content.match(/^#\ (.*)/gm);
        if (!title || title.length === 0) {
          console.log(11, cf);
          errorList.push(cf);
          continue;
        }
        //   console.log(title);
        // 读取文件创建时间
        const createTime = content.match(/Date:\ (.*)\ /);
        if (!createTime || createTime.length === 0) {
          console.log(13, cf);
          errorList.push(cf);
          continue;
        }
        //   console.log(createTime[1]);

        //  计算hash
        const hash = helper.randomToken(32);
        //   创建文件夹
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads'));
        }
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads/blogs'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads/blogs'));
        }
        const blogDir = path.resolve(app.baseDir, `./uploads/blogs/${hash}`);
        fs.mkdirSync(blogDir);
        //   内容写入文件
        content = content
          .replace(/^#\ (.*)/gm, '')
          .replace(/\<\!--(.*)-->/, '')
          .trim();
        const targetPath = path.resolve(blogDir, './readme.md');

        if (fs.writeFileSync(targetPath, content)) {
          console.log(14, cf);
          errorList.push(cf);
        }

        // 移动图片
        const imgPath = path.resolve(row.path, './images');
        if (fs.existsSync(imgPath)) {
          fs.renameSync(imgPath, path.resolve(blogDir, './images'));
          // 记录图片对照关系
          // 过滤点目录
          const imgDirs = fs.readdirSync(path.resolve(blogDir, './images'));
          const allImg = imgDirs.filter(item => {
            return !/^\./.test(item);
          });
          allImg.forEach(item => {
            imgMap.push({
              blog_hash: hash,
              path: `./images/${item}`,
              created_at: createTime[1],
              updated_at: createTime[1],
            });
          });
        }
        // 移动demo文件
        const demoPath = path.resolve(row.path, './demo');
        if (fs.existsSync(demoPath)) {
          fs.renameSync(demoPath, path.resolve(blogDir, './demo'));
        }
        const insertData = {
          user_id: 1,
          name: title[0].slice(2),
          created_at: createTime[1],
          updated_at: createTime[1],
          hash,
          content: content
            .replace(/^#\ (.*)/gm, '')
            .replace(/\<\!--(.*)-->/, '')
            .trim(),
          folder_id: '1',
          status: 1,
        };
        data.push(insertData);
      }
      if (row.type === 2) {
        // const originRoot = '/Users/liyun/www/self/course/HTML-CSS';
        const targetRoot = path.resolve(app.baseDir, './uploads/blogs');
        const cf = path.resolve(row.path, './readme.md');
        if (!fs.existsSync(cf)) {
          console.log(15, cf);
          errorList.push(cf);
          continue;
        }
        // 循环处理
        // 读取文件内容
        const content = fs.readFileSync(cf, 'utf8');
        // console.log(content);
        // 读取文件标题
        // let title = content.match(/^#\ (.*)/gm);
        const title = row.path.split('-').slice(1).join('-');
        if (!title || title.length === 0) {
          console.log(16, cf);
          errorList.push(cf);
          continue;
        }
        // console.log(title);
        // 读取文件创建时间
        // let createTime = content.match(/Date:\ (.*)\ /);
        let createTime = row.path.match(/\d{14}/)[0];
        createTime = moment(createTime, 'YYYYMMDDHHmmss').format(
          'YYYY-MM-DD HH:mm:ss'
        );
        // console.log(createTime);
        if (!createTime || createTime.length === 0) {
          console.log(17, cf);
          errorList.push(cf);
          continue;
        }
        // console.log(createTime);
        //  计算hash
        const hash = helper.randomToken(32);
        //   创建文件夹
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads'));
        }
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads/blogs'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads/blogs'));
        }
        const blogDir = path.resolve(targetRoot, `./${hash}`);
        fs.mkdirSync(blogDir);
        const contentSavePath = path.resolve(blogDir, './readme.md');

        // 移动内容文件
        fs.renameSync(cf, contentSavePath);
        // 移动图片
        const imgPath = path.resolve(row.path, './images');
        if (fs.existsSync(imgPath)) {
          fs.renameSync(imgPath, path.resolve(blogDir, './images'));
          // 记录图片对照关系
          // 过滤点目录
          const imgDirs = fs.readdirSync(path.resolve(blogDir, './images'));
          const allImg = imgDirs.filter(item => {
            return !/^\./.test(item);
          });
          allImg.forEach(item => {
            // const imgHash = helper.randomToken();
            imgMap.push({
              blog_hash: hash,
              path: `./images/${item}`,
              created_at: createTime,
              updated_at: createTime,
            });
          });
        }
        // 移动demo文件
        const demoPath = path.resolve(row.path, './demo');
        if (fs.existsSync(demoPath)) {
          fs.renameSync(demoPath, path.resolve(blogDir, './demo'));
        }
        const insertData = {
          user_id: 1,
          name: title,
          created_at: createTime,
          updated_at: createTime,
          hash,
          content: content
            .replace(/^#\ (.*)/gm, '')
            .replace(/\<\!--(.*)-->/, '')
            .trim(),
          folder_id: '2',
          status: 1,
        };
        data.push(insertData);
      }
      if (row.type === 3) {
        // const originRoot = '/Users/liyun/www/self/course/JavaScript';
        const targetRoot = path.resolve(app.baseDir, './uploads/blogs');
        const cf = path.resolve(row.path, './readme.md');
        if (!fs.existsSync(cf)) {
          console.log(18, cf);
          errorList.push(cf);
          continue;
        }
        // 循环处理
        // 读取文件内容
        const content = fs.readFileSync(cf, 'utf8');
        // console.log(content);
        // 读取文件标题
        // let title = content.match(/^#\ (.*)/gm);
        const title = row.path.split('-').slice(1).join('-');
        if (!title || title.length === 0) {
          console.log(19, cf);
          errorList.push(cf);
          continue;
        }
        // console.log(title);
        // 读取文件创建时间
        // let createTime = content.match(/Date:\ (.*)\ /);
        let createTime = row.path.match(/\d{14}/)[0];
        createTime = moment(createTime, 'YYYYMMDDHHmmss').format(
          'YYYY-MM-DD HH:mm:ss'
        );
        // console.log(createTime);
        if (!createTime || createTime.length === 0) {
          console.log(20, cf);
          errorList.push(cf);
          continue;
        }
        // console.log(createTime);
        //  计算hash
        const hash = helper.randomToken(32);
        //   创建文件夹
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads'));
        }
        if (!fs.existsSync(path.resolve(app.baseDir, './uploads/blogs'))) {
          fs.mkdirSync(path.resolve(app.baseDir, './uploads/blogs'));
        }
        const blogDir = path.resolve(targetRoot, `./${hash}`);
        fs.mkdirSync(blogDir);
        const contentSavePath = path.resolve(blogDir, './readme.md');

        // 移动内容文件
        fs.renameSync(cf, contentSavePath);
        // 移动图片
        const imgPath = path.resolve(row.path, './images');
        if (fs.existsSync(imgPath)) {
          fs.renameSync(imgPath, path.resolve(blogDir, './images'));
          // 记录图片对照关系
          // 过滤点目录
          const imgDirs = fs.readdirSync(path.resolve(blogDir, './images'));
          const allImg = imgDirs.filter(item => {
            return !/^\./.test(item);
          });
          allImg.forEach(item => {
            // const imgHash = helper.randomToken();
            imgMap.push({
              blog_hash: hash,
              path: `./images/${item}`,
              created_at: createTime,
              updated_at: createTime,
            });
          });
        }
        // 移动demo文件
        const demoPath = path.resolve(row.path, './demo');
        if (fs.existsSync(demoPath)) {
          fs.renameSync(demoPath, path.resolve(blogDir, './demo'));
        }
        const insertData = {
          user_id: 1,
          name: title,
          created_at: createTime,
          updated_at: createTime,
          hash,
          content: content
            .replace(/^#\ (.*)/gm, '')
            .replace(/\<\!--(.*)-->/, '')
            .trim(),
          folder_id: '3',
          status: 1,
        };
        data.push(insertData);
      }
    }
    await app.model.Blog.bulkCreate(data);
    await app.model.Picture.bulkCreate(imgMap);
    res.body = errorList;
  }
}
module.exports = MigrationController;
