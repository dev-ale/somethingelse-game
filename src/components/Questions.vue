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
    <br>
    <v-btn v-if="currentQuestion === null" color="green" dark class="ma-2" @click="getServerQuestion()">Start</v-btn>
    <v-btn v-if="currentQuestion" color="green" dark class="ma-2" @click="getServerQuestion()">Next</v-btn>
  </div>

</div>

</template>

<script>

export default {
  data: () => ({
    currentQuestion: null,
    questions: [
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"In past times, what would a gentleman keep in his fob pocket?",
            "correct_answer":"Watch",
            "incorrect_answers":[
              "Money",
              "Keys",
              "Notebook"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"Area 51 is located in which US state?",
            "correct_answer":"Nevada",
            "incorrect_answers":[
              "Arizona",
              "New Mexico",
              "Utah"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"Which sign of the zodiac is represented by the Crab?",
            "correct_answer":"Cancer",
            "incorrect_answers":[
              "Libra",
              "Virgo",
              "Sagittarius"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"What is the name of the Jewish New Year?",
            "correct_answer":"Rosh Hashanah",
            "incorrect_answers":[
              "Elul",
              "New Year",
              "Succoss"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"What is the Spanish word for &quot;donkey&quot;?",
            "correct_answer":"Burro",
            "incorrect_answers":[
              "Caballo",
              "Toro",
              "Perro"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"Which of the following presidents is not on Mount Rushmore?",
            "correct_answer":"John F. Kennedy",
            "incorrect_answers":[
              "Theodore Roosevelt",
              "Abraham Lincoln",
              "Thomas Jefferson"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"What is Tasmania?",
            "correct_answer":"An Australian State",
            "incorrect_answers":[
              "A flavor of Ben and Jerry&#039;s ice-cream",
              "A Psychological Disorder",
              "The Name of a Warner Brothers Cartoon Character"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"The likeness of which president is featured on the rare $2 bill of USA currency?",
            "correct_answer":"Thomas Jefferson",
            "incorrect_answers":[
              "Martin Van Buren",
              "Ulysses Grant",
              "John Quincy Adams"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"What is the name of NASA&rsquo;s most famous space telescope?",
            "correct_answer":"Hubble Space Telescope",
            "incorrect_answers":[
              "Big Eye",
              "Death Star",
              "Millenium Falcon"
            ]
          },
          {
            "category":"General Knowledge",
            "type":"multiple",
            "difficulty":"easy",
            "question":"Which country has the union jack in its flag?",
            "correct_answer":"New Zealand",
            "incorrect_answers":[
              "South Africa",
              "Canada",
              "Hong Kong"
            ]
          }
    ]
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
      }else {
        alert("wrong");
        this.getServerQuestion()
      }
    }
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    update_question(question) {
      this.currentQuestion = question
      console.log(question)
    }
  },
  name: "Questions"
  }
</script>

<style scoped>

</style>
