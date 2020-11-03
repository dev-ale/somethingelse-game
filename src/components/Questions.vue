<template>
  <div>
    <v-text-field v-if="!game" label="username" v-model="username"></v-text-field>

    <!--Button only shows when username is not empty
    Button disapears when game Object is defined-->
    <v-btn class="ma-2" dark v-if="!game && username" x-large color="green" @click="newGame">New Game</v-btn>
    <br>
    <v-btn class="ma-2" v-if="!game && username" x-large color="primary" @click="newGame">Join Game</v-btn>
    <div v-if="game">
      <h2>Game ID</h2>
      <h2> {{game.id}}</h2>
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
    username: null
  }),
  methods: {

    newGame() {
      this.$socket.client.emit('new_game',this.username)
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
