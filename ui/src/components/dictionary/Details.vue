<template>
  <div>
  <div v-if="dictionary.pt">
    <div class="dict-title">PT</div>
    <div class="dict-block">
      <div v-if="!editing" >
        <div v-for="pt in dictionary.pt">{{ pt }}</div>
        <md-button v-if="user.admin" class="md-raised md-primary" @click.native="edit()">
          {{$t('edit')}}
        </md-button>
      </div>
      <div v-if="editing">
        <md-input-container>
          <md-textarea v-model="dictionaryEntry"/>
        </md-input-container>
        <md-button class="md-raised md-primary" @click.native="save()">{{$t('save')}}</md-button>
        <md-button class="md-raised md-accent" @click.native="cancelEdit()">{{$t('cancel')}}</md-button>
      </div>
    </div>
  </div>

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

  <div v-if="dictionary.chinese_tools_en">
    <div class="dict-title">Chinese Tools - EN</div>
    <div class="dict-block">
      <div v-for="chinese_tools_en in dictionary.chinese_tools_en">{{ chinese_tools_en }}</div>
    </div>
  </div>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import User from 'src/domain/user';

  export default {
    name: 'dictionary-details',
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
      getDictionaryEntry() {
        let dictionaryEntry = '';
        if (!this.dictionary.pt) {
          this.dictionary.pt = [];
        }

        this.dictionary.pt.forEach((entry) => {
          dictionaryEntry += `${entry}\n`;
        });

        dictionaryEntry = dictionaryEntry.trim('\n');

        return dictionaryEntry;
      },
      cancelEdit() {
        this.editing = false;
      },
      edit() {
        this.editing = true;
      },
      save() {
        http
        .post('unihan/save', {
          ideograms: this.dictionary.ideograms,
          dictionary: this.dictionaryEntry.split('\n'),
        });
      },
    },
    props: {
      ideograms: {

      },
      dictionary: {

      },
    },
  };
</script>

<style>
.dict-block .md-input-container{
  margin-top: 0 !important;
}

.dict-block textarea{
  height: 250px !important;
}
</style>
