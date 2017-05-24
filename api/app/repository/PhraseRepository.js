const BaseRepository = require('./BaseRepository');
const DatabasePhraseRepository = require('./database/PhraseRepository');

module.exports = class PhraseRepository extends BaseRepository {
  static async save(phrase, skipUpdate) {
    DatabasePhraseRepository.save(phrase, skipUpdate);
  }
};
