<template>
  <div>
    <div v-if="type === 'pt' &&  ((dictionary.pt && dictionary.pt.length) || user.admin)">
      <div class="dict-title">Português</div>
      <div class="dict-block">
        <div v-if="!editing">
          <div v-for="(pt, dictId) in dictionary.pt" v-bind:key="dictId">{{ pt }}</div>

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
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_pt, dictId) in dictionary.chinese_tools_pt"
          v-bind:key="dictId"
        >{{ chinese_tools_pt }}</div>
      </div>
    </div>

    <div v-if="type === 'glosbe_pt' && dictionary.glosbe_pt && dictionary.glosbe_pt.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/pt/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - Português</a>
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_pt, dictId) in dictionary.glosbe_pt" v-bind:key="dictId">{{ glosbe_pt }}</div>
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
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_es, dictId) in dictionary.chinese_tools_es"
          v-bind:key="dictId"
        >{{ chinese_tools_es }}</div>
      </div>
    </div>

    <div v-if="type === 'glosbe_es' && dictionary.glosbe_es && dictionary.glosbe_es.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/es/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - Español</a>
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_es, dictId) in dictionary.glosbe_es" v-bind:key="dictId">{{ glosbe_es }}</div>
      </div>
    </div>

    <div v-if="type === 'unihan' && dictionary.unihan">
      <div class="dict-title">
        <a
          :href="'https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=' + dictionary.ideograms"
          target="_blank"
        >Unihan - English</a>
      </div>
      <div class="dict-block">
        <div v-for="(unihan, dictId) in dictionary.unihan" v-bind:key="dictId">{{ unihan }}</div>
      </div>
    </div>

    <div v-if="type === 'cedict' && dictionary.cedict">
      <div class="dict-title">
        <a
          :href="'https://cc-cedict.org/editor/editor.php?handler=QueryDictionary&amp;querydictionary_search=' + dictionary.ideograms"
          target="_blank"
        >CC-CEDICT - English</a>
      </div>
      <div class="dict-block">
        <div v-for="(cedict, dictId) in dictionary.cedict" v-bind:key="dictId">{{ cedict }}</div>
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
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_en, dictId) in dictionary.chinese_tools_en"
          v-bind:key="dictId"
        >{{ chinese_tools_en }}</div>
      </div>
    </div>

    <div v-if="type === 'glosbe_en' && dictionary.glosbe_en && dictionary.glosbe_en.length">
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/en/' + dictionary.ideograms"
          target="_blank"
        >GLOSBE - English</a>
      </div>
      <div class="dict-block">
        <div v-for="(glosbe_en, dictId) in dictionary.glosbe_en" v-bind:key="dictId">{{ glosbe_en }}</div>
      </div>
    </div>

    <div v-if="type === 'en' && dictionary.en && dictionary.en.length">
      <div class="dict-title">English</div>
      <div class="dict-block">
        <div v-for="(en, dictId) in dictionary.en" v-bind:key="dictId">{{ en }}</div>
      </div>
    </div>

    <div v-if="type === 'es' && dictionary.es && dictionary.es.length">
      <div class="dict-title">Español</div>
      <div class="dict-block">
        <div v-for="(es, dictId) in dictionary.es" v-bind:key="dictId">{{ es }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'src/helpers/http';
import User from 'src/domain/user';

export default {
  name: 'dictionary-render',
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
    };
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
  font-size: 18px;
}

.dict-title a {
  color: #000 !important;
}

.dict-block .md-input-container {
  margin-top: 0 !important;
}

.dict-block textarea {
  height: 250px !important;
}
</style>
