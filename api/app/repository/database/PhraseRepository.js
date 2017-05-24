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

  static async findOneByProviderAndProviderId(provider, providerId) {
    const response = await knex('phrase').where({
      provider,
      provider_id: providerId,
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

  static async saveReference(phraseReference) {
    const fromPhrase = await this
            .findOneByProviderAndProviderId(phraseReference.provider, phraseReference.fromId);

    if (!fromPhrase) {
      return;
    }

    const toPhrase = await this
            .findOneByProviderAndProviderId(phraseReference.provider, phraseReference.toId);

    if (!toPhrase) {
      return;
    }

    await knex('phrase_reference')
        .insert({
          from_phrase_id: fromPhrase.id,
          to_phrase_id: toPhrase.id,
        });
  }

  static async findByLanguageAndRlike(language, rlike) {
    return await knex('phrase')
      .whereRaw(`phrase LIKE "%${rlike}%" AND language_id = ${language.id}`)
      .limit(200)
      .select('id');
  }
};
