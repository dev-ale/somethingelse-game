<template>
  <div class="videostream">

    <img id="image" src="" alt="blub">
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: 'Counter',
  data() {
    return {
      value: 0
    }
  },
  methods: {

  },
  created() {
    this.socket = io("http://localhost:3000")
  },
 mounted() {
   this.socket.on("image", (image) => {
     const imageElm = document.getElementById('image')
     imageElm.src = `data:imagejpeg;base64,${image}`
   });
 }
}
</script>

<style scoped>

</style>
