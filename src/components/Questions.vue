<template>
  <div>
    <v-text-field v-if="!game" label="username" v-model="username"></v-text-field>

    <!--Button only shows when username is not empty
    Button disapears when game Object is defined-->
    <v-btn class="ma-2" dark v-if="!game && username" x-large color="green" @click="newGame">New Game</v-btn>
    <br>
    <v-text-field v-if="username && !game" label="game id" v-model="gameId"></v-text-field>
    <v-btn class="ma-2" v-if="!game && username" x-large color="primary" @click="joinGame">Join Game</v-btn>
    <div v-if="game">
      <h2>Game ID <span class="green--text">{{game.id}}</span></h2>
      <br>
      <h3>Connected Clients: {{game.clients.length}}</h3>
      <v-list v-for="clientId in game.clients" :key="clientId">
        <v-list-item>
          {{ clientId }}
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    counter: null,
    game: null,
    username: null,
    gameId: null
  }),
  methods: {

    newGame() {
      this.$socket.client.emit('new_game',this.username)
    },

    joinGame() {
      this.$socket.client.emit('join_game',this.gameId,this.username)
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
    }

  },
  name: "Questions"
  }
</script>

<style scoped>

</style>
