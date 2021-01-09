<template>
  <div id="game" ref="game">
    <h1 style="cursor: pointer" @click="$emit('stop-multiplayer-game')" class="text-h3 font-weight-bold mb-8">
      something<span class="red--text">else</span> - multiplayer
    </h1>

<!--    Entry Point-->
    <div v-if="this.game.state === null">
      <v-row>
        <v-col>
          <v-text-field color="teal" label="username" v-model="username"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn width="320" v-if="username" class="teal lighten-2" x-large  @click="createGame">New Game</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn width="320" v-if="username" class="teal" x-large  @click="joinGame">Join Game</v-btn>
        </v-col>
      </v-row>
    </div>

    <!--    New Game -->
    <div v-if="this.game.state === 'created'">
      <v-alert v-if="showCopyAlert" dense outlined color="teal">
        <strong>Game ID</strong> copied to clipboard!
      </v-alert>

      <v-row>
        <v-col>
          <h2>Your Game ID: <span style="cursor: pointer" @click="copyText" class="teal--text">{{ gameId }}</span><v-icon class="ml-2" v-if="copiedToClipboard" color="teal">mdi-clipboard-check-outline</v-icon></h2>
          <p>Please share this Game ID with someone to play together.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center" v-for="(client, index) in game.clients" :key="client">
          <strong>Player {{ index+1 }}: </strong> <br>
          <v-btn small outlined dark color="teal">{{ client }}</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="game.clients.length === 2">
        <v-col align="center">
          <v-btn width="320" class="teal" x-large @click="startGame">Start Game</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-icon color="teal" style="cursor: pointer" @click="goBack">mdi-keyboard-backspace</v-icon>
        </v-col>
      </v-row>
    </div>

    <!--    Join Game-->
    <div v-if="this.game.state === 'joining'">
        <v-row>
          <v-col>
            <v-text-field color="teal" label="game id" v-model="gameId"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn width="320" class="teal" x-large @click="searchGame">Search Game</v-btn>
          </v-col>
        </v-row>

      <v-row>
        <v-col align="center">
          <v-icon color="teal" style="cursor: pointer" @click="goBack">mdi-keyboard-backspace</v-icon>
        </v-col>
      </v-row>
    </div>

    <!--    Search Game-->
    <div v-if="this.game.state === 'full' || this.game.state === 'ready' ">
      <v-row>
        <v-col>
          <h2>Joined Game ID: <span class="teal--text">{{ game.id }}</span></h2>
        </v-col>
      </v-row>

      <v-row v-if="game.state === 'full'">
        <v-col align="center" v-for="(client,index) in game.clients" :key="client">
          <strong>Player {{ index+1 }}: </strong> <br>
          <v-btn small outlined dark color="teal">{{ client }}</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="game.state === 'ready'">
        <v-col align="center" v-for="(client,index) in game.clientsReady" :key="client">
          <strong>Player {{ index+1 }}: </strong> <br>
          <v-btn small dark color="teal">{{ client }}</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="game.clients.length === 2">
        <v-col align="center">
          <v-btn width="320" class="teal" x-large @click="startGame">Start Game</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-icon color="teal" style="cursor: pointer" @click="goBack">mdi-keyboard-backspace</v-icon>
        </v-col>
      </v-row>
    </div>

    <div v-if="game.state === 'started'">
<!--      <h2>actual game</h2>-->
<!--      <h1>{{ game.questions }}</h1>-->
<!--      <v-btn @click="count">+</v-btn>-->
      <MultiplayerGame/>
    </div>



  </div>
</template>

<script>

import MultiplayerGame from "@/components/MultiplayerGame";
export default {
name: "Multiplayer",
  components: {MultiplayerGame},
  data: () => ({
    username: null,
    gameId: null,
    step: "start",

    showCopyAlert: false,
    game: {
      "id": null,
      "questions": [],
      "clients": [],
      "state": null, //just to ease up prototyping
      "clientsReady": []
    },
    copiedToClipboard: false,
    message: "test"
  }),
  methods: {

    // Create New Game and get a Game ID
    createGame() {
      this.gameId = Math.random().toString(36).substring(2,8);
      this.step = "new-game"
      this.$socket.client.emit('create_game', this.gameId, this.username)
    },

    // only next step nothing more
    joinGame () {
      //this.$socket.client.emit('join_game',this.gameId,this.username)
      this.game.state = "joining"
    },

    // Search for Game and Join it if available
    searchGame() {
      this.$socket.client.emit('search_game',this.gameId,this.username)
      this.step = "search-game"
    },

    // Cancel Game if Admin
    cancelGame() {
      this.$socket.client.emit('cancel_game',this.gameId,this.username)
      //this.step = "search-game"
    },

    // Remove from Game
    removeGame() {
      this.$socket.client.emit('remove_game',this.gameId,this.username)
      //this.step = "search-game"
    },

    // Start Game
    startGame() {
      this.$socket.client.emit('start_game',this.gameId,this.username)
      //this.step = "search-game"
    },

    goBack() {
      //this.removeGame()
      this.$socket.client.emit('cancel_game', this.gameId, this.username)
      this.gameId = null;
      this.username = null;
    },
    count() {
      //this.removeGame()
      this.$socket.client.emit('counter',this.gameId, this.username)
    },




    copyText() {
      this.showCopyAlert = true;
      setTimeout(() => this.showCopyAlert = false, 2000);
      navigator.clipboard.writeText(this.gameId);
      this.copiedToClipboard = true
    },
  },
  watch: {
    game: {
      handler(val){
        console.log('game state changed to: ' + val.state)
      },
      deep: true
    }
  },
  sockets: {
    /*
     * 👂 Listen to socket events emitted from the socket server
     */
    connect(socket) {
      console.log("check" + socket)
    },

    update_gameState(game) {
      //this.$set(this.game = game)
      this.$set(this.game, 'state', game.state)
      this.$set(this.game, 'id', game.id)
      this.$set(this.game, 'clients', game.clients)
      this.$set(this.game, 'clientsReady', game.clientsReady)
      this.$set(this.game, 'questions', game.questions)
      //this.game = game
      //console.log("new game state received")
      //console.log(game)

    },
    alert_client(msg) {
      this.message = msg;
      console.log("new Alert Message received")
      console.log(msg)
    },

  },
}
</script>

<style scoped>
#game {
  margin: auto;
  padding: 0;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
  position: relative;
}
.v-text-field {
  width: 320px;
}

</style>
