<template>
  <v-app-bar class="ma-0 pa-0">
    <v-row class="ma-0 pa-0">
      <v-btn class="pink" :disabled="Redis.connected" @click="Redis.connect()">
        <v-icon >mdi-lan-connect</v-icon>
      </v-btn>
      <v-btn class="pink" :disabled="!Redis.connected" @click="Redis.disconnect()">
        <v-icon>mdi-lan-disconnect</v-icon>
      </v-btn>
      <v-btn @click="Eventbus.$emit('Grid.save')" :disabled="!Redis.connected">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn @click="Eventbus.$emit('Grid.load')" :disabled="!Redis.connected">
        <v-icon>mdi-folder-arrow-down-outline</v-icon>
      </v-btn>
      <v-btn @click="Eventbus.$emit('Grid.add')" :disabled="!Redis.connected">
        <v-icon>mdi-shape-rectangle-plus</v-icon>
      </v-btn>
      <v-btn @click="Eventbus.$emit('Grid.unfreeze')">
        <v-icon >
          mdi-lock-open-variant-outline
        </v-icon>
      </v-btn>
      <v-btn @click="Eventbus.$emit('Grid.freeze')">
        <v-icon>
          mdi-lock
        </v-icon>
      </v-btn>
    </v-row>
  </v-app-bar>
</template>

<script>
import { Redis, Eventbus } from "../Redis.js";
export default {
  name: "RedisConnection",
  props: {
    host: {
      type: String,
      default: "limero.ddns.net",
    },
    port: {
      type: Number,
      default: 9000,
    },
    path: {
      type: String,
      default: "/redis",
    },
  },
  data() {
    return {
      count: 0,
      Redis,Eventbus
    };
  },
  mounted() {
    console.log("RedisConnection host:" + this.host + " port " + this.port);
    console.log(JSON.stringify(this.$props))
  },
  methods: {

  },
};
</script>

<style>
</style>