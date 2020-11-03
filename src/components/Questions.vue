<template>
  <div>
    <v-btn v-if="!game" x-large color="green" @click="newGame">New Game</v-btn>
    <div v-if="game">
      <h2>Game ID</h2>
      <h2> {{game.id}}</h2>
      <br>
      <h3>Connected Clients: {{game.clients.length}}</h3>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    counter: null,
    game: null
  }),
  methods: {
    increment() {
      this.$socket.client.emit('increment_counter')
    },
    newGame() {
      this.$socket.client.emit('new_game')
    }

  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    update_game(game) {
      this.game = game
     },
    update_counter(counter) {
      this.counter = counter
    }
  },
  name: "Questions"
  }
</script>

<style scoped>

</style>
