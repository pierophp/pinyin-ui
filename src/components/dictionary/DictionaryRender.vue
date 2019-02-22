<template>
  <div>
    <div v-if="type === 'pt' &&  ((dictionary.pt && dictionary.pt.length) || user.admin)">
      <div class="dict-title">Português
        <google-translate-link
          :word="dictionary.pt ? dictionary.pt.join('\n') : ''"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-if="!editing">
          <div v-for="(pt, dictId) in dictionary.pt" v-bind:key="dictId">
            {{ pt }}
            <google-translate-link
              :word="pt"
              sourceLanguage="pt"
              :targetLanguage="translationLanguage"
            />
          </div>

          <md-button
            v-if="user.admin"
            class="md-raised md-primary"
            @click.native="edit()"
          >{{$t('edit')}}</md-button>
        </div>
        <div v-if="editing">
          <div class="field-container">
            <textarea v-model="dictionaryEntry" autocapitalize="none"></textarea>
          </div>
          <md-button class="md-raised md-primary" @click.native="save()">{{$t('save')}}</md-button>
          <md-button class="md-raised md-accent" @click.native="cancelEdit()">{{$t('cancel')}}</md-button>
        </div>
      </div>
    </div>

    <div
      v-if="type === 'chinese_tools_pt' && dictionary.chinese_tools_pt && dictionary.chinese_tools_pt.length"
    >
      <form
        action="http://www.chinese-tools.com/tools/chinese-portuguese-dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-pt"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms">
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('pt')">Chinese Tools - Português</a>
        <google-translate-link
          :word="dictionary.chinese_tools_pt.join('\n')"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(chinese_tools_pt, dictId) in dictionary.chinese_tools_pt" v-bind:key="dictId">
          {{ chinese_tools_pt }}
          <google-translate-link
            :word="chinese_tools_pt"
            sourceLanguage="pt"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'glosbe_pt' && dictionary.glosbe_pt && dictionary.glosbe_pt.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/pt/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - Português</a>
        <google-translate-link
          :word="dictionary.glosbe_pt.join('\n')"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_pt, dictId) in dictionary.glosbe_pt" v-bind:key="dictId">
          {{ glosbe_pt }}
          <google-translate-link
            :word="glosbe_pt"
            sourceLanguage="pt"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="type === 'chinese_tools_es' && dictionary.chinese_tools_es && dictionary.chinese_tools_es.length"
    >
      <form
        action="http://www.chinese-tools.com/tools/chinese-spanish-dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-es"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms">
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('es')">Chinese Tools - Español</a>
        <google-translate-link
          :word="dictionary.chinese_tools_es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(chinese_tools_es, dictId) in dictionary.chinese_tools_es" v-bind:key="dictId">
          {{ chinese_tools_es }}
          <google-translate-link
            :word="chinese_tools_es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'glosbe_es' && dictionary.glosbe_es && dictionary.glosbe_es.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/es/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - Español</a>
        <google-translate-link
          :word="dictionary.glosbe_es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_es, dictId) in dictionary.glosbe_es" v-bind:key="dictId">
          {{ glosbe_es }}
          <google-translate-link
            :word="glosbe_es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'unihan' && dictionary.unihan">
      <div class="dict-title">
        <a
          :href="'https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=' + dictionary.ideograms"
          target="_blank"
        >Unihan - English</a>
        <google-translate-link
          :word="dictionary.unihan.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(unihan, dictId) in dictionary.unihan" v-bind:key="dictId">
          {{ unihan }}
          <google-translate-link
            :word="unihan"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'cedict' && dictionary.cedict">
      <div class="dict-title">
        <a
          :href="'https://cc-cedict.org/editor/editor.php?handler=QueryDictionary&amp;querydictionary_search=' + dictionary.ideograms"
          target="_blank"
        >CC-CEDICT - English</a>
        <google-translate-link
          :word="dictionary.cedict.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(cedict, dictId) in dictionary.cedict" v-bind:key="dictId">
          {{ cedict }}
          <google-translate-link
            :word="cedict"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="type === 'chinese_tools_en' && dictionary.chinese_tools_en && dictionary.chinese_tools_en.length"
    >
      <form
        action="http://www.chinese-tools.com/tools/dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-en"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms">
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('en')">Chinese Tools - English</a>
        <google-translate-link
          :word="dictionary.chinese_tools_en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(chinese_tools_en, dictId) in dictionary.chinese_tools_en" v-bind:key="dictId">
          {{ chinese_tools_en }}
          <google-translate-link
            :word="chinese_tools_en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'glosbe_en' && dictionary.glosbe_en && dictionary.glosbe_en.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/en/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - English</a>
        <google-translate-link
          :word="dictionary.glosbe_en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_en, dictId) in dictionary.glosbe_en" v-bind:key="dictId">
          {{ glosbe_en }}
          <google-translate-link
            :word="glosbe_en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'en' && dictionary.en && dictionary.en.length">
      <div class="dict-title">English
        <google-translate-link
          :word="dictionary.en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(en, dictId) in dictionary.en" v-bind:key="dictId">
          {{ en }}
          <google-translate-link
            :word="en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'es' && dictionary.es && dictionary.es.length">
      <div class="dict-title">Español
        <google-translate-link
          :word="dictionary.es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(es, dictId) in dictionary.es" v-bind:key="dictId">
          {{ es }}
          <google-translate-link
            :word="es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'moedict' && moedict">
      <div class="dict-title">Moedict - Chinese</div>
      <div class="dict-block">
        <div v-for="(definition, definitionId) in moedict.definitions" v-bind:key="definitionId">
          <span class="dict-definition-title">{{ $t('definition') + ' ' + (definitionId + 1)}}:</span>
          <file-container
            ref="fileContainer"
            :lines="[definition.def]"
            :fullLines="[definition.def]"
            :parent="true"
            :showHighlight="false"
            :useFullLines="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import replaceall from 'replaceall';
import http from 'src/helpers/http';
import User from 'src/domain/user';
import OptionsManager from 'src/domain/options-manager';
import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
import GoogleTranslateLink from 'src/components/dictionary/GoogleTranslateLink';

export default {
  name: 'dictionary-render',
  components: {
    GoogleTranslateLink,
  },
  watch: {
    dictionary() {
      this.dictionaryEntry = this.getDictionaryEntry();
    },
  },
  data() {
    return {
      editing: false,
      dictionaryEntry: this.getDictionaryEntry(),
      user: User.getUser(),
      moedict: null,
      translationLanguage: null,
    };
  },
  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    const options = optionsManager.getOptions();
    const translationLanguage = options.translationLanguage;

    this.translationLanguage = translationLanguage;

    if (this.type === 'moedict') {
      this.loadMoedict();
    }
  },
  methods: {
    openChineseTools(language) {
      document.getElementById(`form-ct-${language}`).submit();
    },
    getDictionaryEntry() {
      let dictionaryEntry = '';
      if (!this.dictionary.pt) {
        this.dictionary.pt = [];
      }

      this.dictionary.pt.forEach(entry => {
        dictionaryEntry += `${entry}\n`;
      });

      dictionaryEntry = dictionaryEntry.trim('\n');

      return dictionaryEntry;
    },
    cancelEdit() {
      this.editing = false;
      this.$emit('change-show', this.editing);
    },
    edit() {
      this.editing = true;
      this.$emit('change-show', this.editing);
    },

    async loadMoedict() {
      if (!this.dictionary.ideograms) {
        setTimeout(() => {
          this.loadMoedict();
        }, 500);

        return;
      }

      const optionsManager = new OptionsManager(this.$i18n);
      const options = optionsManager.getOptions();

      const moedictResponse = (await http.get('dictionary/moedict', {
        params: {
          ideogram: this.dictionary.ideograms,
          pronunciation: this.pinyin,
        },
      })).data.definition;

      const definitions =
        options.ideogramType === 't'
          ? moedictResponse.traditionalDefinitions
          : moedictResponse.simplifiedDefinitions;

      const newDefinitions = [];

      let i = 0;
      for (const definition of definitions) {
        let blockCount = 0;
        let characterCounter = 0;

        const line = [];

        for (const pinyinDef of moedictResponse.pinyinDefinitions[i].def) {
          const pinyinList = separatePinyinInSyllables(
            replaceall(' ', String.fromCharCode(160), pinyinDef),
            false,
          )
            .join(String.fromCharCode(160))
            .split(String.fromCharCode(160));

          for (const pinyin of pinyinList) {
            if (!line[blockCount]) {
              line[blockCount] = { c: '', p: '' };

              if (blockCount === 0) {
                line[blockCount].pinyinSpaced = 1;
              }
            }

            line[blockCount].c += definition.def[characterCounter];
            line[blockCount].p += pinyin + String.fromCharCode(160);

            characterCounter++;
          }

          blockCount++;
        }

        newDefinitions.push({ def: line });

        i++;
      }

      const moedict = {
        definitions: newDefinitions,
      };

      this.$set(this, 'moedict', moedict);
    },
    save() {
      const dictionatyList = this.dictionaryEntry
        .split('\n')
        .filter(item => item.trim());

      http
        .post('unihan/save', {
          pinyin: this.pinyin,
          ideograms: this.dictionary.ideograms,
          dictionary: dictionatyList,
        })
        .then(() => {
          this.dictionary.pt = dictionatyList;
          this.editing = false;
          this.$emit('change-show', this.editing);
        });
    },
  },
  props: {
    pinyin: {},
    dictionary: {},
    type: '',
  },
};
</script>

<style>
.dict-block {
  padding-bottom: 10px;
}

.dict-title {
  font-weight: bold;
  font-size: 16px;
}

.dict-title a {
  color: #000 !important;
}

.dict-block .md-input-container {
  margin-top: 0 !important;
}

.dict-block .dict-definition-title {
  font-weight: bold;
}

.dict-block textarea {
  height: 250px !important;
}
</style>
