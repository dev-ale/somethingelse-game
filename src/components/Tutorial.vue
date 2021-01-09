<template>
  <v-app>
    <div class="container" align="center">
      <h1 style="font-size: 3rem">something<span class="red--text">else</span> - Tutorial</h1>

    </div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step
            :complete="e1 > 1"
            step="1"
        >
          How to
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
            :complete="e1 > 2"
            step="2"
        >
          Happy
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          Sad
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="4">
          Surprised
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5">
          Angry
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card
              class="mb-12"
              color="grey lighten-3"
              height="600px"
          >

          </v-card>
          <div style="display: flex;
              justify-content: space-between; ">
              <v-btn text class="red darken-2 mr-2" dark @click="cancel">
                X
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  class="ml-2"
                  color="primary"
                  @click="e1 = 2"
              >
                Skip
              </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card
              class="mb-12"
              color="grey lighten-3"
              height="600px"
          >

          </v-card>
          <div style="display: flex;
              justify-content: space-between; ">
            <v-btn text class="red darken-2 mr-2" dark @click="cancel">
              X
            </v-btn>
            <v-progress-linear
                color="primary"
                rounded
                value="50"
            ></v-progress-linear>
            <v-btn
                class="ml-2"
                color="primary"
                @click="e1 = 3"
            >
              Skip
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
              class="mb-12"
              color="grey lighten-3"
              height="600px"
          >

          </v-card>
          <div style="display: flex;
              justify-content: space-between; ">
            <v-btn text class="red darken-2 mr-2" dark @click="cancel">
              X
            </v-btn>
            <v-progress-linear
                color="primary"
                rounded
                value="50"
            ></v-progress-linear>
            <v-btn
                class="ml-2"
                color="primary"
                @click="e1 = 4"
            >
              Skip
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card
              class="mb-12"
              color="grey lighten-3"
              height="600px"
          >

          </v-card>
          <div style="display: flex;
              justify-content: space-between; ">
            <v-btn text class="red darken-2 mr-2" dark @click="cancel">
              X
            </v-btn>
            <v-progress-linear
                color="primary"
                rounded
                value="50"
            ></v-progress-linear>
            <v-btn
                class="ml-2"
                color="primary"
                @click="e1 = 5"
            >
              Skip
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-card
              class="mb-12"
              color="grey lighten-3"
              height="600px"
          >

          </v-card>
          <div style="display: flex;
              justify-content: space-between; ">
            <v-btn text class="red darken-2 mr-2" dark @click="cancel">
              X
            </v-btn>
            <v-progress-linear color="primary" rounded value="50"/>
            <v-btn class="ml-2" color="primary" @click="$emit('start-game')">
              Start
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-app>

</template>

<script>
export default {
  name: 'Tutorial',
  data: () => ({
    e1: 1,
  }),
  methods: {
    cancel() {
      this.$emit('end-tutorial');
    }
  },
}
</script>

<style scoped>

</style>
