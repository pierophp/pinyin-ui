const BaseRepository = require('./BaseRepository');
const knex = require('../../services/knex');

module.exports = class PhraseRepository extends BaseRepository {
  static async findOneByProviderAndProviderIdLanguageId(provider, providerId, languageId) {
    const response = await knex('phrase').where({
      provider,
      provider_id: providerId,
      language_id: languageId,
    });

    if (response.length > 0) {
      return response[0];
    }

    return null;
  }

  static async save(data, skipUpdate) {
    const phrase = await this.findOneByProviderAndProviderIdLanguageId(
      data.provider, data.provider_id, data.language_id
    );

    if (!phrase) {
      await knex('phrase')
        .insert(data);
    } else if (!skipUpdate) {
      await knex('phrase')
        .where('id', '=', phrase.id)
        .update(data);
    }
  }
};
