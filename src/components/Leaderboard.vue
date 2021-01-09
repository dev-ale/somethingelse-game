<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar color="accent-4">
      <v-icon color="red">mdi-star</v-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>Leaderboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon color="red">mdi-star</v-icon>
    </v-toolbar>  
    <v-list>
      <v-list-item
          v-for="entry in loaderboard"
          :key="entry.name">
        <v-list-item-avatar>
          <v-img v-if="entry.photo"
            :alt="entry.title"
            :src="entry.photo"/>
          <v-icon v-if="!entry.photo">
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="entry.name"/>
        </v-list-item-content>
        <v-list-item-icon>
        </v-list-item-icon>
        <v-list-item-action>
          <v-list-item-action-text v-text="entry.score"/>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-if="!loaded">
        <v-list-item-content>
          <v-progress-circular indeterminate color="red" :size="30" :width="3"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios';
const restdbUrl = 'https://somethingelse-5292.restdb.io';
const restdbOptions = Object.freeze({
  headers: Object.freeze({
    'cache-control': 'no-cache',
    'x-apikey': '5fe9ee88ff9d67063814096f'
  })
});

export default {
  name: 'Loaderboard',
  data: () => ({
    loaderboard: [],
    loaded: false
  }),
  mounted() {
    axios.get(restdbUrl + '/rest/leaderboard', restdbOptions)
      .then(response => {
        this.loaderboard = (response.data || []).map(entry => {
          const hasPhoto = entry && entry.photo && entry.photo.length && entry.photo[0];
          entry.photo = hasPhoto ? restdbUrl + '/media/' + entry.photo[0] : null;
          return entry;
        }).sort((a, b) => b.score - a.score);
        this.loaded = true;
      }).catch(error => { console.warn('restdb', error); });
  }
};
</script>

<style scoped>
</style>
