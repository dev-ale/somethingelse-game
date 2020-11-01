<template>
<div>
  <div align="center" v-if="currentQuestion">
    <h1>Questions</h1>
    <h3>{{ currentQuestion.question }}</h3>
    <v-list>
        <v-btn
            class="ma-2"
            color="green"
            dark
            v-for="answers in currentQuestion.allAnswers"
            :key="answers"
            @click="guess(answers)"
        >{{ answers }}
        </v-btn>
    </v-list>

  </div>
  <br>
  <div align="center">
    <h1 v-if="player">{{player}}</h1>
    <br>
    <v-btn v-if="player === null" class="ma-2" dark color="red" @click="selectPlayer(1)">Player 1</v-btn>
    <v-btn v-if="player === null" class="ma-2" dark color="blue" @click="selectPlayer(2)">Player 2</v-btn>
    <br>
    <v-btn  x-large v-if="player" color="green" dark class="ma-2" @click="getServerQuestion()">Start</v-btn>
    <v-btn x-large v-if="currentQuestion" color="green" dark class="ma-2" @click="getServerQuestion()">Next</v-btn>
  </div>
  <v-container v-if="currentQuestion">
    <v-row>
      <v-col md="4">
        <h3 class="blue--text">Player 1</h3>
        <h1>{{player1Score}}</h1>
      </v-col>
      <v-col md="4" offset-md="4">
        <h3 class="red--text">Player 2</h3>
        <h1>{{player2Score}}</h1>
      </v-col>
    </v-row>
  </v-container>

</div>

</template>

<script>

export default {
  data: () => ({
    currentQuestion: null,
    player1Score: 0,
    player2Score: 0,
    readyToPlay: false,
    player: null
  }),
  methods: {
    getServerQuestion() {
      console.log("getServerQuestion")
      this.$socket.client.emit('next_question')
    },

    guess(option) {
      if (option === this.currentQuestion.correct_answer) {
        alert("correct");
        this.getServerQuestion()
        this.$socket.client.emit('increment_score1')
      }else {
        alert("wrong");
        this.getServerQuestion()
      }
    },

    selectPlayer(player) {
      if (player === 1){
        console.log("Player 1 selected")
        this.player = "Player 1"
      }else {
        console.log("Player 2 selected")
        this.player = "Player 2"
      }
    }
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    update_score1(score1) {
      this.player1Score = score1
    },
    update_score2(score2) {
      this.player1Score = score2
    },
    update_question(question) {
      this.currentQuestion = question
    }
  },
  name: "Questions"
  }
</script>

<style scoped>

</style>
