const BaseRepository = require('./BaseRepository');
const knex = require('../../services/knex');
const UnihanSearch = require('../../services/UnihanSearch');

module.exports = class CjkRepository extends BaseRepository {
  static async searchPronunciationByWord(ideograms) {
    const ideogramConverted = UnihanSearch.convertIdeogramsToUtf16(ideograms);
    let response = null;
    if (ideograms.length === 1) {
      response = await knex('cjk')
        .where({
          ideogram: ideogramConverted,
          type: 'C',
        })
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation');

      if (response.length > 0) {
        return response[0].pronunciation;
      }
    }

    response = await knex('cjk')
      .where({
        ideogram: ideogramConverted,
        type: 'W',
      })
      .orderBy('frequency', 'ASC')
      .orderBy('usage', 'DESC')
      .select('id', 'pronunciation');

    if (response.length > 0) {
      return response[0].pronunciation;
    }

    return null;
  }

  static async save(cjk) {
    let action = 'insert';
    if (cjk.id) {
      action = 'update';
      await knex('cjk')
        .where('id', '=', cjk.id)
        .update(cjk);
    } else {
      await knex('cjk')
        .insert(cjk);
    }

    console.log(action);
  }
};
