<template>
  <v-container>
    <v-row>
      <v-list>
        <v-list-item v-for="(training, index) in trainings" :key="index">
          {{training.name}}
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TrainingList',
  data() {
    return {
      trainings: [{
        name: 'Beginner, level 1'
      }, {
        name: 'Beginner, level 2'
      }, {
        name: 'Beginner, level 3'
      }]
    }
  }
})
</script>