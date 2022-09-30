<template>
  <v-card height="200px">
      <v-toolbar card>
        <v-toolbar-title>{{ config.label }}</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text :style="config.style" :key="key">
        <v-list>
          <template v-for="i in logs.length"  >
            <v-list-tile :key="i">
              <v-list-tile-content>
                <div>{{ logs[i-1] }}</div>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card-text>

      <v-footer class="pa-2">Footer</v-footer>
    </v-card>
</template>
<script>
/*jshint esversion: 6 */

class LogRecord {
  constructor(topic, message, timestamp) {
    this.topic = topic;
    this.message = message;
    this.timestamp = timestamp;
  }
}

import { Redis, Eventbus, Timer,newKey  } from "../Redis.js";
import { Sub } from "../Sub.js";
export default {
  name: "SubLabel",
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "LABELDUMMY",
        topic: "src/device/object/property",
        style:"font-size:20px;background-color:greeen;text-align:center;",
        decimals:3,
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      logs:[],
      key:newKey(),
      value: 0,
      classState: "m-0 p-0 text-center dead",
      Redis,
      Eventbus,
      Timer,
    };
  },
  mounted() {
    this.sub = new Sub(this.config.topic, 60000, this.onMessage, this.onTimeout);
    console.log("SubLabel label:" + this.config.label + " topic " + this.config.topic);
  },
  unmounted() {
    this.sub.unsubscribe(this.config.topic, this.onMessage);
    this.chart.dispose();
  },
  watch: {
    config: function (newConfig, oldConfig) {
      console.log(
        this.name + "watch topic newVal:" + newConfig + " oldVal:" + oldConfig
      );
      this.key = newKey();
      this.sub.unsubscribe(oldConfig.topic, this.onMessage);
      this.sub.subscribe(newConfig.topic, this.onMessage);
    },
  },
  methods: {
    onMessage(topic, message) {
      this.logs.push(new LogRecord(topic, message, new Date().getTime()))
      this.classState = "m-0 p-0 text-center alive";
    },
    onTimeout() {
      this.classState = "m-0 p-0 text-center dead";
    },
  },
  computed: {},
};
</script>

<style>
.alive {
  background-color: #fff;
  color: #084480;
}
.dead {
  background-color: #888;
  color: #fff;
}
</style>