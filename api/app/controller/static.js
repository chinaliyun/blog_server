'use strict';
const mime = require('mime-types');
const path = require('path');
const Controller = require('egg').Controller;
const fs = require('fs');

class StaticController extends Controller {
  async index() {
    const { response: res, app, request: req } = this.ctx;

    // 判断文件是否存在
    const filePath = path.resolve(
      app.baseDir,
      `./uploads/${req.url.replace('/static', '')}`
    );
    let src;
    if (!fs.existsSync(filePath)) {
      src = fs.createReadStream(
        path.resolve(app.baseDir, './app/public/images/image_404.png')
      );
    } else {
      src = fs.createReadStream(filePath);
    }

    const mimeType = mime.lookup(filePath);
    res.set('content-type', mimeType);
    res.body = src;
    return;
  }
}

module.exports = StaticController;
