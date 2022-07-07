<template>
  <div class="flashcards-container">
    <div class="frontside">
      <div class="card" v-for="(card, cardId) in cards" v-bind:key="cardId">
        <span class="ideogram">{{ card.ideogram }}</span>

        <span class="img-container">
          <img :src="card.image" referrerpolicy="no-referrer" />
        </span>
      </div>
    </div>

    <div class="backside">
      <div
        class="card reversed"
        v-for="(card, cardId) in cards"
        v-bind:key="cardId"
      >
        <span class="pinyin">{{ card.pinyin }}</span>

        <span class="definition">{{ card.translation }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-cjk-list',
  data() {
    return {
      cards: [
        {
          ideogram: '鱷魚 / 鳄鱼',
          pinyin: 'èyú',
          image:
            'https://img.chinatimes.com/newsphoto/2017-12-08/656/20171208003441.jpg',
          translation: 'Jacaré',
        },
        {
          ideogram: '獅子 / 狮子',
          pinyin: 'shīzi',
          image:
            'https://www.infoescola.com/wp-content/uploads/2017/04/leao-126767138.jpg',
          translation: 'Leão',
        },
        {
          ideogram: '長頸鹿 / 长颈鹿',
          pinyin: 'chángjǐnglù',
          image:
            'https://www.stickdecor.com.br/wp-content/uploads/2017/05/painel-fotografico-girafa-an-003-1.jpg',
          translation: 'Girafa',
        },

        {
          ideogram: '中間',
          pinyin: 'chángjǐnglù',
          image:
            'https://www.stickdecor.com.br/wp-content/uploads/2017/05/painel-fotografico-girafa-an-003-1.jpg',
          translation: 'Girafa',
        },
      ],
    };
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'SentyWen';
  src: url('/public/fonts/senty_wen.woff2') format('woff2');
}

@font-face {
  font-family: 'HuaKangBaoFengTraditional';
  src: url('/public/fonts/hua_kang_bao_feng_traditional.woff2') format('woff2');
}

.flashcards-container {
  width: 900px;
  padding-bottom: 65px;
  display: block;
}

.frontside,
.backside {
  display: flex;
}

.card {
  display: flex;
  width: 320px;
  height: 194px;
  border: 1px dotted #cfcfcf;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.card .ideogram {
  width: 100%;
  font-size: 30px;
  line-height: 30px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'HuaKangBaoFengTraditional';
}

.card .img-container {
  width: 100%;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card .img-container img {
  max-width: 100%;
  max-height: 100%;
  height: 95px;
}

.card .pinyin {
  width: 100%;
  font-size: 30px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card .definition {
  width: 100%;
  font-size: 30px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #706c6c;
}

.reversed {
  /* transform: rotate(180deg); */
}
</style>
