<template>
  <div
      @keyup.right="move('right')"
      @keyup.left="move('left')"
      @keyup.up="move('up')"
      @keyup.down="move('down')">
    <h1>BlockGame</h1>

    <canvas
        ref="game"
        width="650"
        height="480"
        style="border: 1px solid black"
    >
    </canvas>
    <p>
      <button @click="move('right')">Right</button>
      <button @click="move('left')">Left</button>
      <button @click="move('up')">Up</button>
      <button @click="move('down')">Down</button>
    </p>
  </div>
</template>

<script>
import io from "socket.io-client"
export default {
  name: 'BlockGame',
  data() {
    return {
      socket: {},
      context: {},
      position: {
        x: 0,
        y: 0
      }
    }
  },
  //before View rendered
  created() {
    this.socket = io("http://localhost:3000")
  },
  //after View rendered
  mounted() {
    this.context = this.$refs.game.getContext("2d");
    this.socket.on("position", data => {
      this.position = data;
      this.context.clearRect(0,0, this.$refs.game.width, this.$refs.game.height);
      this.context.fillRect(this.position.x, this.position.y, 20, 20);
    });

  },
  methods: {
    move (direction) {
      this.socket.emit("move", direction);
      console.log("move pressed" + direction)
    }
  }
}
</script>


<style scoped>

</style>
