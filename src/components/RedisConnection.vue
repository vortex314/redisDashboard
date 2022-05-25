<template>
  <div class="mx-1">
    <b-btn class="button"
      :disabled="Redis.connected"
      v-on:click="connect"
      >Connect</b-btn
    >
    <b-btn class="button"
      :disabled="!Redis.connected"
      v-on:click="disconnect"
      >Disconnect</b-btn
    >
    <b-btn class="button"  v-on:click="saveGrid" :disabled="!Redis.connected">
      <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
    </b-btn>
    <b-btn class="button"  v-on:click="loadGrid" :disabled="!Redis.connected"
      ><b-icon icon="folder" aria-hidden="true"/></b-btn>
    <b-btn class="button"  v-on:click="addGridItem">
      <b-icon icon="plus" aria-hidden="true"
    /></b-btn>
  </div>
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
      Redis,
    };
  },
  mounted() {
    console.log("RedisConnection host:" + this.host + " port " + this.port);
  },
  methods: {
    saveGrid() {
      console.log("emitting ");
      Eventbus.$emit("Grid.save");
    },
    loadGrid() {
      Eventbus.$emit("Grid.load");
    },
    addGridItem() {
      Eventbus.$emit("Grid.add");
    },
    connect() {
      Redis.connect();
    },
    disconnect(){
      Redis.disconnect();
    },
  },
};
</script>
.button {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}
<style>
</style>