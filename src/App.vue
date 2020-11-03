<template>
  <v-app>
    <div id="app">
      <div class="container">
        <h1>sdent - <span class="red--text">somethingelse</span></h1>
        <div hidden>
          <h3 :style="isConnected ? 'color: green' : 'color: red'" v-html="`Connected: ${isConnected}`"/>
          <ClientList />
          <Counter />
          <BlockGame/>
        </div>
        <br>
        <Questions v-if="!started"></Questions>
        <Game v-if="started"></Game>
      </div>
    </div>
  </v-app>

</template>

<script>
import ClientList from './components/ClientList.vue'
import Counter from './components/Counter.vue'
import BlockGame from "@/components/BlockGame"
import Questions from "@/components/Onboarding"
import Game from "@/components/Game";
export default {
  name: 'App',
  data() {
    return {
      isConnected: false,
      game: null,
      started: false
    }
  },
  components: {
    Game,
    BlockGame,
    ClientList,
    Counter,
    Questions
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    connect() {
      console.log('Connected to the socket server.')
      this.isConnected = true
    },
    update_game(game) {
      this.game = game
      console.log("new game state received")
      if (game.status === "started") {
        this.started = true
      }
    },
  }
}
</script>

<style>
body,
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
