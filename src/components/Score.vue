<template>
  <div align="center">
    <v-card>
      <v-card-text>
        <h1 class="mt-5 mb-5">
          {{ score }}
        </h1>
      </v-card-text>
    </v-card>
    <h4 v-if="player">{{ player }}</h4>
  </div>
</template>

<script>
export default {
  name: 'Score',
  props: {
    score: Number,
    player: String
  }
}
</script>

<style scoped>
.v-card {
  padding: 10px;
  font-family: Arial;
}
h1 {
  font-size: 7rem;
}
</style>
