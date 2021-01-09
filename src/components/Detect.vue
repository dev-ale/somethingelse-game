<template>
  <div class="detect">
    <v-progress-circular
        id="progressbar"
        class="amber--text"
        size="190"
        width="12"
        :value="this.progress">
      <div id="expression" ref="expression">
        {{ currentEmote }}
      </div>
    </v-progress-circular>
  </div>
</template>

<script>
import * as faceapi from '@/plugins/face-api.js';

export default {
  name: 'Detect',
  props: {
    emoteMap : Map
  },
  data: () => ({
    detect: Object.freeze({
      options: new faceapi.TinyFaceDetectorOptions(),
      interval: 100,
      minScore: 0.7,
      lockCount: 10
    }),
    input: null,
    interval: null,
    scores: Object.freeze({}),
    currentExpression: 'neutral',
    counter: Object.freeze({}),
    progress: 0
  }),
  computed: {
    currentEmote() {
      return this.emoteMap.get(this.currentExpression) || this.emoteMap.get('neutral');
    }
  },
  methods: {
    init(input) {
      return Promise.all([
        new Promise((resolve, reject) => input ? resolve() : reject('illegal detect input')),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]).then(() => this.input = input);
    },
    start() {
      if (!this.interval) {
        this.scores = Object.freeze({});
        this.interval = setInterval(this.detectAndUpdateScores, this.detect.interval);
        console.debug('started');
      }
    },
    async detectAndUpdateScores() {
      const detection = await faceapi
          .detectSingleFace(this.input, this.detect.options)
          .withFaceExpressions();
      if (detection && detection.expressions) {
        this.scores = Object.freeze(detection.expressions);
      } else {
        console.log('unable to detect any expressions');
        this.scores = Object.freeze({});
      }
    },
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
        console.debug('stopped');
      }
    }
  },
  watch: {
    scores: function() {
      this.currentExpression = Object.keys(this.scores)
          .filter(key => this.scores[key] >= this.detect.minScore)
          .filter(key => key !== 'neutral')
          .reduce((a, b) => this.scores[a] >= this.scores[b] ? a : b, '') || '';
      let count = this.counter[this.currentExpression] || 0;
      this.counter = Object.freeze({ [this.currentExpression] : ++count });
      this.progress = (100 / this.detect.lockCount) * (this.currentExpression ? count : 0)
      if (!this.currentExpression || count > this.detect.lockCount) {
        this.$emit("detected", this.currentExpression);
      }
      console.debug(this.counter[this.currentExpression], this.currentExpression);
    }
  }
};
</script>

<style scoped>
.detect {
  display: flex;
  justify-content: center;
  align-items: center;
}
#expression {
  font-size: 200px;
}
</style>
<style>
#progressbar .v-progress-circular__overlay {
  transition: all 0.1s ease-in-out;
}
</style>
