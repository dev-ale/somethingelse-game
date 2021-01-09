<template>
  <div align="center">
    <v-row>
      <v-col>
        <h1 class="text-h3 font-weight-bold mt-8 mb-8">
          game<span class="red--text">over</span>
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <v-btn class="mr-4" x-large @click="$emit('onboarding')">Back to Start</v-btn>
          <v-btn class="mr-4" x-large @click="$emit('start-game')">Play again</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm-3>
        <div style="width: 150px">
          <Score :score="gameResult.score"></Score>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Leaderboard />
      </v-col>
    </v-row>
    <v-row>
      <v-col lg12 v-for="(photo, index) in gameResult.photos" :key="index">
        <div class="polaroid mt-8">
          <p>Question {{ index + 1}}</p>
          <img :src="photo" :alt="index" height="250"/>
        </div>
      </v-col>
    </v-row>
<v-footer>

</v-footer>
  </div>
</template>

<script>
import Score from "@/components/Score"
import Leaderboard from "@/components/Leaderboard";

export default {
  name: 'EndGame',
  components: { Score, Leaderboard },
  props: {
    gameResult: Object
  },
  methods: {
  }
}
</script>

<style scoped>
.v-card {
  width: fit-content;
}
.polaroid {
  position: relative;
  width: 320px;
}

.polaroid img {
  border: 10px solid #fff;
  border-bottom: 45px solid #fff;
  -webkit-box-shadow: 3px 3px 3px #777;
  -moz-box-shadow: 3px 3px 3px #777;
  box-shadow: 3px 3px 3px #777;
}

.polaroid p {
  position: absolute;
  text-align: center;
  width: 100%;
  bottom: 0px;
  font: 400 18px/1 'Kaushan Script', cursive;
  color: #888;
}
</style>
