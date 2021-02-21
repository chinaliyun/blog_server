const moment = require('moment');
module.exports = {
  randomToken(size) {
    const allowNumbers = '0123456789';
    const allowLowers = 'abcdefghijklmnopqrstuvwxyz';
    const allowUppers = allowLowers.toUpperCase();

    let result = '';
    size = size || 64;
    size = parseInt(size) != NaN ? parseInt(size) : 16;
    const allChar =
      allowNumbers + allowLowers + allowUppers + new Date().getTime();

    while (result.length < size) {
      result += allChar[Math.floor(Math.random() * allChar.length)];
    }
    return result;
  },
  now() {
    // return moment().format('YYYY-MM-DDHH:mm:ss.SSS') + 'Z';
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  },
};
