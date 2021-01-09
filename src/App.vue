<template>
  <v-app id="app">
    <v-app-bar
        absolute
        color="transparent"
        elevate-on-scroll
    >
      <v-spacer></v-spacer>
      <v-btn icon href="https://github.com/alejandro-garcia-fhnw/fhnw-sdent-somethingelse">
        <v-icon large class="mr-3" color="#2c3e50">mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <Onboarding v-if="state == State.Onboard"
                @start-tutorial="state = State.Tutorial"
                @start-game="state = State.Game"
                @start-multiplayer-game="state = State.Multiplayer"/>
    <Tutorial v-if="state == State.Tutorial"
              @end-tutorial="state = State.Onboard"
              @start-game="startGame"/>
    <Game v-if="state == State.Game"
          @end-game="endGame"/>
    <EndGame v-if="state == State.End"
             :gameResult="gameResult"
             @onboarding="state = State.Onboard"
             @start-game="startGame"/>
    <Multiplayer
        v-if="state == State.Multiplayer"
        @stop-multiplayer-game="state = State.Onboard"
    ></Multiplayer>
  </v-app>
</template>

<script>
import Tutorial from "@/components/Tutorial";
import Game from "./components/Game.vue";
import EndGame from "./components/EndGame.vue"
import Onboarding from "@/components/Onboarding";
import Multiplayer from "@/components/Multiplayer";

const State = Object.freeze({
  Onboard: 0,
  Tutorial: 1,
  Game: 2,
  End: 3,
  Multiplayer: 4
});

export default {
  name: "App",
  components: {Multiplayer, Onboarding, Tutorial, Game, EndGame },
  data: () => ({
    State,
    state: State.Onboard,
    gameResult: Object.freeze({})
  }),
  methods: {
    setPhotos(photos) {
      this.photos = photos;
    },
    startGame() {
      this.photos = [];
      this.state = State.Game;
    },
    startMultiplayerGame() {
      this.state = State.Multiplayer;
      console.log("asd")
    },
    endGame(gameResult) {
      this.gameResult = gameResult || Object.freeze({});
      this.state = State.End;
    }
  }
};
</script>

<style>
#app {
  align-content: center;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f5f5f5;
}
ul {
  list-style-type: none;
  padding: 0;
}
h2 {
  text-align: center;
}
.hidden {
  display: none;
}
.green {
  background-color: lightgreen;
}
.red {
  background-color: orangered;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
