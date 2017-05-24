const BaseRepository = require('./BaseRepository');
const DatabaseCjkRepository = require('./database/CjkRepository');

module.exports = class CjkRepository extends BaseRepository {
  static async searchPronunciationByWord(ideograms) {
    return DatabaseCjkRepository.searchPronunciationByWord(ideograms);
  }

  static async save(cjk) {
    return DatabaseCjkRepository.save(cjk);
  }
};
