<template>
  <div class="hanzi-container">
    <div id="hanzi-controls">
      <span v-for="(item, itemId) in items" v-bind:key="itemId" @click="changeIdeogram(itemId)" :class="item.classActive"></span>
    </div>

    <div id="hanzi-writer"></div>
    <md-button class="md-icon-button md-dense md-raised md-primary" @click.native="animate">
      <md-icon>play_arrow</md-icon>
    </md-button>

    <!-- <md-button class="md-icon-button md-dense md-raised md-primary" @click.native="test">
      <md-icon>chevron_right</md-icon>
    </md-button> -->
  </div>
</template>
<script>
import axios from 'axios';
import HanziWriter from 'hanzi-writer';

export default {
  name: 'dictionary-stroke-order',
  watch: {
    ideograms() {
      this.update();
    },
  },
  data() {
    return {
      items: [],
      hanziWriterCache: {},
    };
  },
  mounted() {
    this.writer = new HanziWriter('hanzi-writer', '', {
      onLoadCharDataSuccess: a => {
        console.log('onLoadCharDataSuccess', a);
      },
      // this method doesn't work async
      charDataLoader: (char, onComplete) => {
        if (!char) {
          return;
        }

        if (!this.hanziWriterCache[char]) {
          axios
            .get(
              `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`,
            )
            .then(response => {
              if (response.data) {
                onComplete(response.data);
                this.hanziWriterCache[char] = response.data;
              }
            });
        } else {
          onComplete(this.hanziWriterCache[char]);
        }
      },
      showOutline: true,
      showCharacter: true,
      width: 230,
      height: 230,
      padding: 0,
      strokeAnimationDuration: 300, // duration of each stroke in ms
      delayBetweenStrokes: 300, // delay between drawing subsequent strokes in ms
      strokeFadeDuration: 400,
      delayBetweenStrokes: 200,
      strokeColor: '#555',
      radicalColor: '#143dd9',
      highlightColor: '#AAF', // color used to highlight strokes as a hint during quizzing
      outlineColor: '#DDD',
      drawingColor: '#333', // color of the line drawn by the user during quizzing
      showHintAfterMisses: 3, // give a hint after this many subsequent mistakes during quizzing
      highlightOnComplete: true, // flash the character when the quiz is successfully completed
      leniency: 1,
    });
    this.update();
  },
  methods: {
    animate() {
      this.writer.animateCharacter({
        onComplete: () => {},
      });
    },
    // test() {
    //   const svgObject = this.writer.getScalingTransform(230, 230, 0);

    //   console.log('svgObject', svgObject);
    // },
    changeIdeogram(itemId) {
      this.items.forEach((item, i) => {
        this.items[i].classActive = '';
      });
      this.items[itemId].classActive = 'active';
      this.writer.setCharacter(this.items[itemId].ideogram);

      // HanziWriter.loadCharacterData(this.items[itemId].ideogram).then(
      //   charData => {
      //     const target = document.getElementById('target');
      //     for (var i = 0; i < charData.strokes.length; i++) {
      //       const strokesPortion = charData.strokes.slice(0, i + 1);
      //       console.log({ strokesPortion });
      //       //  renderFanningStrokes(target, strokesPortion);
      //     }
      //   },
      // );
    },
    update() {
      this.items = [];
      if (!this.ideograms) {
        return;
      }
      for (let i = 0; i < this.ideograms.length; i += 1) {
        this.items.push({
          classActive: '',
          ideogram: this.ideograms[i],
        });

        if (i === 0) {
          this.changeIdeogram(i);
        }
      }
    },
  },
  props: {
    ideograms: {},
  },
};
</script>

<style>
.hanzi-container {
  width: 240px;
  text-align: center;
  position: relative;
}

#hanzi-writer svg {
  min-height: 240px;
}

#hanzi-controls {
  top: 20px;
  left: 240px;
  position: absolute;
  width: 30px;
  height: 100px;
}

#hanzi-controls span {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background: #007aff;
  display: block;
  margin-bottom: 22px;
  background: #000;
  opacity: 0.2;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
}

#hanzi-controls span.active {
  background: #007aff;
  opacity: 1;
}
</style>
