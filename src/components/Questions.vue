<template>
  <div>
    <v-text-field v-if="!game && !joinChosen" label="username" v-model="username"></v-text-field>

    <!--Button only shows when username is not empty
    Button disapears when game Object is defined-->
    <v-btn class="ma-2" dark v-if="!game && username && !joinChosen" x-large color="green" @click="newGame">New Game</v-btn>

    <v-btn class="ma-2" v-if="!game && username && !joinChosen" x-large color="primary" @click="joinChosen = true">Join Game</v-btn>
    <br>
    <v-text-field v-if="!game && joinChosen && username" label="game id" v-model="gameId"></v-text-field>
    <v-btn class="ma-2" v-if="!game && joinChosen && username" x-large color="primary" @click="joinGame">Join Game</v-btn>
    <div v-if="game">
      <h2>Game ID <span class="green--text">{{game.id}}</span></h2>
      <br>
      <h3>Connected Players: {{game.clients.length}}</h3>
      <v-list v-for="clientId in game.clients" :key="clientId">
        <v-list-item>
          {{ clientId }}
        </v-list-item>
      </v-list>
      <v-btn x-large dark color="red" v-if="game.clients.length >= 2" @click="startGame"> start game</v-btn>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    counter: null,
    game: null,
    username: null,
    gameId: null,
    joinChosen: false
  }),
  methods: {

    newGame() {
      this.$socket.client.emit('create_game',this.username)
    },

    joinGame() {
      this.$socket.client.emit('join_game',this.gameId,this.username)
    },

    startGame() {
      this.$socket.client.emit('start_game',this.gameId,this.username)
    }

  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    connect(socket) {
      console.log("check" + socket)
    },

    update_game(game) {
      this.game = game
      console.log("new game state received")

    },

  },
  name: "Questions"
  }
</script>

<style scoped>

</style>
