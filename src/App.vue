<template>
  <v-app>
    <v-main>
      <grid-vue/>
    </v-main>
  </v-app>
</template>

<script>
import GridVue from "./components/Grid.vue";
export default {
  name: "App",
  components: { GridVue },
  methods: {
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
  margin-left: 0px;
}
</style>
