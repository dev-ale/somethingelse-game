<template>
  <div id="game" ref="game">
    <h1 class="text-h3 font-weight-bold mb-8">
      something<span class="red--text">else</span>
    </h1>
    <v-progress-circular indeterminate color="red" :size="70" :width="7"
        v-if="!loaded"/>
    <template v-show="loaded">
      <Score class="mb-16" :score="score"></Score>
      <Detect ref="detect"
          class="mb-5"
          :emoteMap="emoteMap"
          @detected="onDetect"/>
      <Quiz ref="quiz" class="mb-8"
          :emoteMap="emoteMap"
          @end-quiz="endGame"/>
      <v-btn large @click="endGame">Quit</v-btn>
      <div class="videoWrapper">
        <video ref="video"
            @click="capturePhoto" width="250" height="250"
            autoplay muted playsinline/>
      </div>
    </template>
  </div>
</template>

<script>
import Detect from "@/components/Detect.vue";
import Quiz from "@/components/Quiz.vue";
import Score from "@/components/Score"

export default {
  name: 'Game',
  components: { Score, Detect, Quiz },
  data: () => ({
    emoteMap: Object.freeze(new Map([
      ['happy', '😃'],
      ['surprised', '😲'],
      ['angry', '😡'],
      ['sad', '😢'],
      ['neutral', '😶']
    ])),
    nextQuestionTimeout: 2000,
    loaded: false,
    score: 0,
    photos: []
  }),
  mounted() {
    const video = this.$refs.video;
    const detect = this.$refs.detect;
    const quiz = this.$refs.quiz;
    video.addEventListener('play', () => { detect.start(); });
    Promise.all([ quiz.init(), detect.init(video) ])
        .then(() => { quiz.start(); })
        .then(() => { this.startRecording(video); })
        .then(() => { this.loaded = true; })
        .catch(error => { console.warn('init failed', error); });
  },
  methods: {
    startRecording(video) {
      navigator.getUserMedia({ video: true },
        stream => video.srcObject = stream,
        err => {
          this.endGame();
          console.error(err);
        }
      );
    },
    onDetect(expression) {
      if (expression && this.$refs.quiz.isStarted()) {
        this.score += this.$refs.quiz.answer(expression);
        this.$refs.detect.stop();
        this.capturePhoto();
        setTimeout(() => {
          this.$refs.quiz.nextQuestion()
            && this.$refs.detect.start();
        }, this.nextQuestionTimeout);
      }
    },
    endGame() {
      this.$refs.detect.stop();
      this.$refs.quiz.stop();
      this.$emit('end-game', Object.freeze({
        score: this.score,
        photos: Object.freeze(this.photos)
      }));
    },
    capturePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = this.$refs.video.videoWidth;
      canvas.height = this.$refs.video.videoHeight;
      canvas.getContext("2d").drawImage(this.$refs.video, 0, 0);
      this.photos.push(canvas.toDataURL("image/png"));
      console.log("photo taken!");
    }
  }
};
</script>

<style scoped>
#game {
  margin: auto;
  padding: 0;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
  position: relative;
}
#game video {
  width: 250px;
  height: 250px;
  position: absolute;
  top: 50px;
  left: 0px;
  border-radius: 50%;
  margin: 20px;
  object-fit: cover;
  object-position: center;
}
</style>
