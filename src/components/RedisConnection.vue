<template>
<v-container>
  <v-row >
    <v-btn color="primary" :disabled="RedisState.connected" @click="connect()">
      <v-icon>mdi-lan-connect</v-icon>
    </v-btn>
    <v-btn color="primary" :disabled="!RedisState.connected" @click="disconnect()">
      <v-icon>mdi-lan-disconnect</v-icon>
    </v-btn>
    <v-btn @click="gridSave" :disabled="!RedisState.connected" color="primary">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn @click="gridLoad" :disabled="!RedisState.connected" color="primary">
      <v-icon>mdi-folder-arrow-down-outline</v-icon>
    </v-btn>
    <v-btn @click="gridAdd" :disabled="!RedisState.connected" color="primary">
      <v-icon>mdi-shape-rectangle-plus</v-icon>
    </v-btn>
    <v-btn @click="gridUnfreeze" color="primary">
      <v-icon>
        mdi-lock-open-variant-outline
      </v-icon>
    </v-btn>
    <v-btn @click="gridFreeze" color="primary">
      <v-icon>
        mdi-lock
      </v-icon>
    </v-btn>
  </v-row>
  </v-container>
</template>

<script>
import { Redis, Eventbus ,RedisState} from "../Redis.js";
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
      RedisState
    };
  },
  mounted() {
    console.log("RedisConnection host:" + this.host + " port " + this.port);
    console.log(JSON.stringify(this.$props))
  },
  methods: {
    connect() {
      Redis.connect(this.host, this.port, this.path);
    },
    disconnect() {
      Redis.disconnect();
    },
    gridSave() {
      Eventbus.$emit('Grid.save');
    },
    gridLoad() {
      Eventbus.$emit('Grid.load');
    },
    gridAdd() {
      Eventbus.$emit('Grid.add');
    },
    gridFreeze() {
      Eventbus.$emit('Grid.freeze');
    },
    gridUnfreeze() {
      Eventbus.$emit('Grid.unfreeze');
    },
  },
  watch:{
    
  }
};
</script>

<style>
</style>