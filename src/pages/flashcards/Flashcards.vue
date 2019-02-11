<template>
  <div>
    <div class="frontside">
      <div class="card" v-for="(card, cardId) in cards" v-bind:key="cardId">
        <span class="ideogram">{{card.ideogram}}</span>
        <span class="img-container">
          <img :src="card.image" referrerpolicy="no-referrer">
        </span>
      </div>
    </div>

    <div class="backside">
      <div class="card" v-for="(card, cardId) in cards" v-bind:key="cardId">
        <span class="pinyin">{{card.pinyin}}</span>
        <span class="translation">{{card.translation}}</span>
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
          ideogram: '鱷魚',
          pinyin: 'Èyú',
          image:
            'https://img.chinatimes.com/newsphoto/2017-12-08/656/20171208003441.jpg',
          translation: 'Jacaré',
        },
      ],
    };
  },
};
</script>

<style>
.frontside,
.backside {
  display: flex;
}

.card {
  display: flex;
  width: 300px;
  height: 200px;
  border: 1px solid #000;
  flex-direction: column;
  align-items: center;
}

.card .ideogram {
  padding: 25px 0;
  width: 100%;
  font-size: 50px;
  height: 50%;
  text-align: center;
  flex-grow: 1;
}

.card .img-container {
  width: 100%;
  text-align: center;
  flex-grow: 1;
}

.card .img-container img {
  height: 130px;
}

.card .pinyin {
  padding-top: 5px;
  width: 100%;
  font-size: 30px;
  height: 50px;
  text-align: center;
  flex-grow: 1;
  background: red;
  justify-content: center;
  align-items: center;
}

.card .translation {
  padding-top: 5px;
  width: 100%;
  font-size: 30px;
  height: 50px;
  text-align: center;
  flex-grow: 1;
  background: blue;
}
</style>
