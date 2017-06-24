const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

module.exports = class NativeAdapter {
  static async listContents(folder) {
    return await readdir(folder, 'utf8');
  }
};
