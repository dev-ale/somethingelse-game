<template>
  <v-card class="quiz-card mb-2" width="800px" align="center"
      v-if="currentTrivia">
    <v-card-title>
      <v-spacer></v-spacer>
      <span v-html="currentTrivia.question"/>
<!--        Funktioniert immernonig :-) has jetzt uf mehreri Arte Probiert, es lauft nur bim erste mol.

      <vue-typed-js :stringsElement="'#test'" :showCursor="false" :contentType="'html'">
          <p class="typing"></p>
        </vue-typed-js>
        <div id="test" style="display: none">
          <p>{{ currentTrivia.question }}</p>
        </div>
-->
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col lg12>
          <v-btn class="answer ml-1 mb-1 text-h6" width="380" x-large
              v-for="(answer, index) in currentTrivia.all_answers"
              :key="index"                    
              :class="revealAnswer(index)">
            {{ emotes[index] }}
            <span v-html="answer"/>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="ml-2">
      <v-btn text color="red lighten-2"
          :disabled="!enabledNext"
          @click="nextQuestion">
        Skip Question
      </v-btn>
      <v-card-text align="right">
        {{ maxTrivia - triviaCount + 1 }} remaining
      </v-card-text>
    </v-card-actions>
  </v-card>
</template>

<script>
import opentdb from 'opentdb-api';

export default {
  name: 'Quiz',
  props: {
    emoteMap: Map
  },
  data: () => ({
    triviaOptions: Object.freeze({
      amount: 1,
      category: 'general', // or 'any'
      difficulty: 'easy',
      type: 'multiple'
    }),
    triviaLoader: null,
    currentTrivia: null,
    triviaCount: 0,
    maxTrivia: 10,
    enabledNext: false
  }),
  computed: {
    expressions() {
      return Array.from(this.emoteMap.keys());
    },
    emotes() {
      return Array.from(this.emoteMap.values());
    }
  },
  methods: {
    init() {
      return opentdb.getToken()
        .then(token => this.triviaOptions = Object.freeze(
            Object.assign({token: token}, this.triviaOptions)))
        .then(() => this.triviaLoader = this.getTriviaLoader());
    },
    reset() {
      return opentdb.resetToken(this.triviaOptions.token);
    },
    getTriviaLoader() {
      return opentdb.getTrivia(this.triviaOptions).then(results => results[0]);
    },
    isStarted() {
      return this.currentTrivia;
    },
    start() {
      if (!this.isStarted()) {
        this.nextQuestion();
      }
    },
    stop() {
      if (this.isStarted()) {
        this.currentTrivia = null;
        this.$emit('end-quiz');
      }
    },
    nextQuestion() {
      this.enabledNext = false;
      if (this.triviaCount < this.maxTrivia) {
        this.triviaLoader
            .then(trivia => this.currentTrivia = this.buildTrivia(trivia))
            .then(() => this.triviaCount++)
            .then(() => this.triviaLoader = this.getTriviaLoader()) // preload the next trivia
            .then(() => this.enabledNext = true); // enable next after trivia has loaded
        return true;
      } else {
        this.stop();
      }
    },
    buildTrivia(trivia) {
      trivia.all_answers = Object.freeze(this.shuffle([
        ...trivia.incorrect_answers,
        trivia.correct_answer
      ]));
      // find correct answer index again after shuffle of all possible answers
      trivia.correct_answer_index = trivia.all_answers
          .map((answer, index) => (answer === trivia.correct_answer) ? index : -1)
          .find(index => index >= 0);
      console.log('nextQuestion:', trivia);
      return trivia;
    },
    answer(response) {
      let points = 0;
      if (this.currentTrivia && !this.currentTrivia.given_answer) {
        console.log('given answer:', response);
        this.enabledNext = false;
        this.$set(this.currentTrivia, 'given_answer', response);
        if (response === this.expressions[this.currentTrivia.correct_answer_index]) {
          points = 1;
        } else {
          console.log("wrong answer");
        }
      }
      return points;
    },
    revealAnswer(index) {
      if (this.currentTrivia.given_answer) {
        if (this.currentTrivia.correct_answer_index == index) {
          return 'green';
        } else if (this.currentTrivia.given_answer === this.expressions[index]) {
          return 'red';
        }
      }
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }
};
</script>

<style scoped>
.answer {
  text-transform: none;
  cursor: default;
  /* TODO no hover effect */ 
}
</style>
