<template>
  <div id="app" class="ml-0">
    <RedisWs />
  </div>
</template>

<script>
import RedisWs from "./components/RedisWs.vue";
export default {
  name: "App",
  components: { RedisWs },
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
