<template>
  <v-app>
    <div id="app">
      <h1 class="text-h1 font-weight-bold mb-16 hidden-xs-only">
        something<span class="red--text">else</span>
      </h1>
      <h1 class="text-h2 font-weight-bold mb-16 hidden-sm-and-up">
        something<span class="red--text">else</span>
      </h1>
      <br>
      <div v-if="hasVideoAccess">
        <v-row>
          <v-col>
            <v-btn width="320" class="light-blue darken-3" x-large @click="$emit('start-tutorial')">
              Tutorial
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn width="320" class="red lighten-1" x-large @click="$emit('start-game')">
              Singleplayer Game
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn width="320" class="teal" x-large @click="$emit('start-multiplayer-game')">
              Multiplayer Game
            </v-btn>
          </v-col>
        </v-row>

      </div>
      <div class="container" v-if="!hasVideoAccess">
        <lottie-animation class="mb-4" :width="150" :height="150" path="animations/face.json"/>
        <h2>
          Please allow
          <span class="font-weight-bold">something<span class="red--text">else</span></span>
          to access your camera.
        </h2>
        <p>Page reloads every 10 seconds ...</p>
        <vue-typed-js :loop="true" :typeSpeed="50" :strings="['We do not use your images in any kind, promised!', 'We do not store your images in any kind, promised!']">
          <p class="mt-5 typing"></p>
        </vue-typed-js>
      </div>
<!--      <Leaderboard class="mt-8"/>-->
    </div>
  </v-app>
</template>

<script>
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  name: 'Onboarding',
  components: { LottieAnimation },
  data: () => ({
    hasVideoAccess: false
  }),
  mounted () {
    navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;
    navigator.getUserMedia({ video: true },
      stream => this.hasVideoAccess = true,
      err => {
        setTimeout(() => window.location.reload(), 10000);
        console.error(err);
      }
    );
  },
  methods: {
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
