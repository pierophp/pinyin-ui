<template>
  <div>
  <div v-if="dictionary.pt">
    <div class="dict-title">PT</div>
    <div class="dict-block">
      <div v-for="pt in dictionary.pt">{{ pt }}</div>
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
  export default {
    name: 'dictionary-details',
    props: {
      dictionary: {

      },
    },
  };
</script>
