const BaseRepository = require('./BaseRepository');
const DatabasePhraseRepository = require('./database/PhraseRepository');

module.exports = class PhraseRepository extends BaseRepository {
  static async save(phrase, skipUpdate) {
    DatabasePhraseRepository.save(phrase, skipUpdate);
  }

  static async saveReference(phraseReference) {
    DatabasePhraseRepository.saveReference(phraseReference);
  }

  static async findByLanguageAndRlike(language, rlike) {
    return DatabasePhraseRepository.findByLanguageAndRlike(language, rlike);
  }
};
