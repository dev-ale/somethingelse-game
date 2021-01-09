<template>
  <div id="tutorial" ref="tutorial">
    <h1 class="text-h3 font-weight-bold mb-8">
      something<span class="red--text">else</span>
    </h1>
    <p>In this
      <span class="font-weight-bold">quiz</span>
      you'll answer with your
      <span class="font-weight-bold red--text">face</span>!
    </p>
    <p>Try to express all of these emotions:</p>
    <v-stepper v-model="step" class="wizard" align="center">

      <v-stepper-header class="mb-6">
        <template v-for="(expression, index) in expressions">
          <v-stepper-step :key="expression"
                          :step="index + 1"
                          :complete="step > index + 1" color="red">
            {{ expression.charAt(0).toUpperCase() + expression.slice(1) }}
          </v-stepper-step>
          <v-divider :key="index"></v-divider>
        </template>
        <v-stepper-step :step="endStep" :complete="step >= endStep" color="red">
          End
        </v-stepper-step>
      </v-stepper-header>

      <v-progress-circular indeterminate color="red" :size="70" :width="7"
                           v-if="!loaded"/>
      <div class="input pa-5 ma-5" v-show="loaded && step < endStep" :class="coloring">
        <div class="videoWrapper">
          <video ref="video" width="250" height="250"
                 autoplay muted playsinline/>
        </div>
        <Detect ref="detect"
                class="ml-16"
                :emoteMap="emoteMap"
                @detected="onDetect"/>
      </div>

      <v-stepper-items>
        <v-stepper-content v-for="index in endStep" :key="index" :step="index" class="pt-0">
          <div v-show="index == endStep" class="mb-5">
            <p><span class="font-weight-bold red--text">Congrats</span>, you've finished the tutorial!</p>
            <p>Now let's get <span class="font-weight-bold">started</span> ...</p>
          </div>
          <div class="footer">
            <v-btn class="mr-2" text color="red lighten-2" @click="cancel">
              Quit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="ml-2" color="red" dark @click="next">
              {{ endStep > index ? 'Skip' : 'Start' }}
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>

    </v-stepper>
  </div>
</template>

<script>
import Detect from "@/components/Detect.vue";

export default {
  name: 'Tutorial',
  components: { Detect },
  data: () => ({
    emoteMap: Object.freeze(new Map([
      ['happy', '😃'],
      ['surprised', '😲'],
      ['angry', '😡'],
      ['sad', '😢']
    ])),
    step: 1,
    loaded: false,
    coloring: null,
  }),
  computed: {
    expressions() {
      return Array.from(this.emoteMap.keys());
    },
    emotes() {
      return Array.from(this.emoteMap.values());
    },
    endStep() {
      return this.expressions.length + 1;
    }
  },
  mounted() {
    const video = this.$refs.video;
    const detect = this.$refs.detect;
    video.addEventListener('play', () => { detect.start(); });
    Promise.all([ detect.init(video) ])
        .then(() => { this.startRecording(video); })
        .then(() => { this.loaded = true; })
        .catch(error => { console.warn('init failed', error); });
  },
  methods: {
    startRecording(video) {
      navigator.getUserMedia({ video: true },
          stream => video.srcObject = stream,
          err => {
            this.cancel();
            console.error(err);
          }
      );
    },
    onDetect(expression) {
      if (expression) {
        this.$refs.detect.stop();
        const correct = expression === this.expressions[this.step - 1];
        this.coloring = correct ? 'green' : 'red';
        setTimeout(() => {
          if (correct) this.next();
          this.coloring = null;
          this.$refs.detect.start();
        }, 2000);
      }
    },
    next() {
      this.step++;
      if (this.step == this.endStep) {
        this.$refs.detect.stop();
      } else if (this.step > this.endStep) {
        this.$emit('start-game');
      }
    },
    cancel() {
      this.$refs.detect.stop();
      this.$emit('end-tutorial');
    }
  },
}
</script>

<style scoped>
#tutorial {
  margin: auto;
  padding: 0;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.wizard {
  min-width: 800px;
}
.no-transition .stepper__content {
  transition: none;
}
.input {
  display: flex;
  justify-content: center;
  align-items: center;
}
video {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
