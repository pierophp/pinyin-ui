<template>
  <div class="line" :class="[type]" v-if="!loading">
    <template v-for="(block, blockIndex) in blocks">
      <!-- @click is on FilePrint because performance  -->
      <div
        :key="blockIndex"
        class="block"
        :data-line="lineIndex"
        :data-block="blockIndex"
        ref="block"
      >
        <div
          class="character"
          :data-line="lineIndex"
          :data-block="blockIndex"
          :class="[block.classBold, block.classItalic]"
          v-if="!block.small && !block.footnote && !block.noIdeogram"
        >
          <template
            v-for="data in block.printDataCharacters"
            v-if="!ideogramsToLearn[block.character]"
          >
            <template>{{ data.character }}</template>
          </template>

          <template
            v-for="data in block.printDataCharacters"
            v-if="ideogramsToLearn[block.character]"
            >&nbsp;&nbsp;&nbsp;&nbsp;</template
          >

          <span
            class="tip-pinyin"
            v-if="ideogramsToLearn[block.character] && block.pinyin"
            >({{ block.pinyin }})</span
          >
        </div>
      </div>
    </template>
    <div class="clearfix"></div>
  </div>
</template>

<script lang="ts">
import separatePinyinInSyllables from "@/helpers/separate-pinyin-in-syllables";
import ideogramsShow from "@/helpers/ideograms.show";
import OptionsManager from "@/domain/options-manager";

export default {
  name: "file-row-quiz",
  components: {},
  data() {
    return {
      type: "",
      loading: true,
      ideogramsToLearn: {
        喜樂: 1,
        耶和華: 1,
        哪里: 1,
        关心: 1,
        快樂: 1,
        回答: 1,
        考驗: 1,
        不過: 1,
      },
    };
  },
  props: {
    line: {
      type: Array,
      default: () => [],
    },
    lineIndex: {
      default: 0,
    },
  },
  async created() {
    this.type = "";
    if (this.line[0] !== undefined && this.line[0].line !== undefined) {
      const type = this.line[0].line.type;
      this.type = `type-${type}`;
    }
  },

  async mounted() {
    await this.updateRender();
  },
  methods: {
    async updateBlockRender(blockIndex) {
      const newBlock = await this.generateBlock(this.line[blockIndex]);
      this.blocks[blockIndex] = newBlock;
      this.$forceUpdate();
    },

    async updateRender() {
      this.loading = true;
      let blockIndex = 0;
      this.blocks = [];
      for (const block of this.line) {
        this.blocks[blockIndex] = await this.generateBlock(block);

        blockIndex++;
      }
      this.loading = false;
    },
    async generateBlock(block) {
      const generatedBlock = {};
      generatedBlock.small = block.small;
      generatedBlock.large = block.large;
      generatedBlock.noIdeogram = block.noIdeogram;

      const optionsManager = new OptionsManager(this.$i18n);
      const options = optionsManager.getOptions();
      generatedBlock.classBold = "";
      if (block.isBold === 1) {
        generatedBlock.classBold = "bold";
      }

      generatedBlock.classItalic = "";
      if (block.isItalic === 1) {
        generatedBlock.classItalic = "italic";
      }

      generatedBlock.classExtra = "";

      const chars = block.c.toString();

      let withoutPinyn = true;
      const pinyin = separatePinyinInSyllables(block.p, true);

      generatedBlock.character = block.c;
      generatedBlock.pinyin = pinyin.join("");
      generatedBlock.printDataCharacters = ideogramsShow({
        character: block.c,
        pinyin: block.p,
        useSpaces: true,
      });

      return generatedBlock;
    },
  },
};
</script>

<style>
.tip-pinyin {
  color: red;
  font-size: 16px !important;
}
</style>
