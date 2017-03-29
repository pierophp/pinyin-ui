<template>
  <div class="bottom-bar" v-if="show">
    <span class="ideogram-link" v-for="data in printData" @click.prevent="openModal(data.character)">{{data.character}}</span>
    <!-- span @click.prevent="openPinyinList()">{{ block.pinyin }}</span -->

    <md-menu md-size="2"  md-direction="top left" md-offset-y="-52">
      <md-button md-menu-trigger class="md-2">
        {{ block.pinyin }}
      </md-button>

      <md-menu-content>
        <md-menu-item>Item 1</md-menu-item>
        <md-menu-item>Item 2</md-menu-item>
        <md-menu-item>Item 3</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-button class="md-icon-button md-primary" @click.native="loadDictionary()">
      <md-icon>find_in_page</md-icon>
    </md-button>

    <md-dialog ref="dialogDictionary">
      <md-dialog-title>{{ block.character }} - {{ block.pinyin }}</md-dialog-title>

      <md-dialog-content>

        <div v-if="dictionary.chinese_tools_pt">
          <div class="dict-title">Chinese Tools - PT</div>
          <div class="dict-block">
            <div v-for="chinese_tools_pt in dictionary.chinese_tools_pt">{{ chinese_tools_pt }}</div>
          </div>
        </div>

        <div v-if="dictionary.chinese_tools_es">
          <div class="dict-title">Chinese Tools - ES</div>
          <div class="dict-block">
            <div v-for="chinese_tools_es in dictionary.chinese_tools_es">{{ chinese_tools_es }}</div>
          </div>
        </div>

        <div v-if="dictionary.unihan">
          <div class="dict-title">Unihan</div>
          <div class="dict-block">
            <div v-for="unihan in dictionary.unihan">{{ unihan }}</div>
          </div>
        </div>

        <div v-if="dictionary.cedict">
          <div class="dict-title">CC-CEDICT</div>
          <div  class="dict-block">
            <div v-for="cedict in dictionary.cedict">{{ cedict }}</div>
          </div>
        </div>

      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('dialogDictionary')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>


    <md-button class="md-icon-button md-primary" @click.native="close()">
      <md-icon>clear</md-icon>
    </md-button>
  </div>
</template>

<script>
  import http from 'src/helpers/http';

  import {
    mapMutations,
    mapGetters,
  } from 'vuex';

  import {
    FILE_MUTATION_SET_MY_CJK_TEMP,
    FILE_GETTER_MY_CJK,
  } from 'src/data/file/types';

  export default {
    name: 'file-bottom-bar',
    data() {
      return {
        show: false,
        block: {},
        printData: {},
        dictionary: {
          pt: null,
          unihan: null,
          cedict: null,
          chinese_tools_pt: null,
          chinese_tools_es: null,
        },
      };
    },
    computed: {
      ...mapGetters({
        myCjk: FILE_GETTER_MY_CJK,
      }),
    },

    methods: {
      ...mapMutations({
        setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
      }),

      close() {
        this.show = false;
      },

      open(block) {
        this.show = true;
        this.block = block;
        const chars = block.character.toString();
        const printData = [];
        for (let i = 0; i < chars.length; i += 1) {
          printData.push({
            character: chars[i],
          });
        }
        this.printData = printData;
      },

      openModal(character) {
        let add = true;
        if (this.myCjk.indexOf(character) > -1) {
          add = false;
        }

        this.setMyCjkTemp(character);
        this.$emit('open-modal', add);
      },

      loadDictionary() {
        http
        .post('unihan/dictionary', {
          ideograms: this.block.character,
        })
        .then((response) => {
          this.dictionary = response.data;
          this.openDialog('dialogDictionary');
        });
      },

      openPinyinList() {
        http
        .post('unihan/to_pinyin_all', {
          ideograms: [this.block.character],
        })
        .then((response) => {
          console.log(response.data);
        });
      },

      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        console.log('Opened');
      },

      onClose(type) {
        console.log('Closed', type);
      },
    },
  };
</script>

<style>
.bottom-bar {
  border-top: 2px #ccc solid;
  background: #fff;
  font-size: 22px;
  padding: 0 10px;
  line-height: 40px;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
}
.ideogram-link {
  cursor: pointer;
}

.dict-title {
  font-weight: bold;
  font-size:18px;
}

.dict-block{
  padding-bottom: 10px;
}

.bottom-bar .md-button{
  min-width: auto;
}
</style>
