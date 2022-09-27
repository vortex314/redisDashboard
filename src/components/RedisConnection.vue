<template>
  <v-card class="d-flex fill-height justify-center outlined align-center">
    <v-btn color="primary" :disabled="RedisState.connected" @click="connect()">
      <v-icon>mdi-lan-connect</v-icon>
    </v-btn>
    <v-btn
      color="primary"
      :disabled="!RedisState.connected"
      @click="disconnect()"
    >
      <v-icon>mdi-lan-disconnect</v-icon>
    </v-btn>
    <v-btn @click="gridSave" :disabled="!RedisState.connected" color="primary">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn @click="gridLoad" :disabled="!RedisState.connected" color="primary">
      <v-icon>mdi-folder-arrow-down-outline</v-icon>
    </v-btn>
    <v-btn @click="gridAdd" color="primary">
      <v-icon>mdi-shape-rectangle-plus</v-icon>
    </v-btn>
    <v-btn @click="gridUnfreeze" color="primary">
      <v-icon> mdi-lock-open-variant-outline </v-icon>
    </v-btn>
    <v-btn @click="gridFreeze" color="primary">
      <v-icon> mdi-lock </v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    Dashboard <v-text-field v-model="dashboardName"></v-text-field>
  </v-card>
</template>

<script>
import { Redis, Eventbus, RedisState } from "../Redis.js";
export default {
  name: "RedisConnection",
  props: {
    config: {
      type: Object,
      default: () => ({
        host: "localhost",
        port: 9000,
        path: "/redis",
        dashboard:"default"
      }),
    },
  },
  data() {
    return {
      count: 0,
      dashboardName: "default",
      dashboardNames: ["default"],
      RedisState,
    };
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config,newVal, oldVal);
      Redis.autoConnect = false;
      Redis.disconnect();
      Redis.configure(this.config.host, this.config.port, this.config.path);
      Redis.connect();
      Redis.autoConnect = true;
      this.dashboardName = this.config.dashboard;
    },
  },
  mounted() {
    console.log("RedisConnection host:" + this.config.host + " port " + this.config.port);
    console.log(JSON.stringify(this.$props));
    Redis.configure(this.config.host, this.config.port, this.config.path);
    Eventbus.$on("Redis.connected", (connected) => {
      if (connected) {
        this.loadDashboards();
      }
    });
  },
  methods: {
    loadDashboards() {
      Redis.request(["keys", "dashboard:*"]).then((data) => {
        console.log("dashboard names:", data);
        var dashboards = data[1];
        if (Array.isArray(dashboards)) {
          dashboards.forEach((element) => {
            if (typeof element === "string") {
              this.dashboardNames.push(element.replace("dashboard:", ""));
            }
          });
        } else {
          this.dashboardNames.push(dashboards.string.replace("dashboard:", ""));
        }
      });
    },
    connect() {
      Redis.connect();
    },
    disconnect() {
      Redis.disconnect();
    },
    gridSave() {
      Eventbus.$emit("Grid.save", this.dashboardName);
    },
    gridLoad() {
      Eventbus.$emit("Grid.load", this.dashboardName);
    },
    gridAdd() {
      Eventbus.$emit("Grid.add");
    },
    gridFreeze() {
      Eventbus.$emit("Grid.freeze");
    },
    gridUnfreeze() {
      Eventbus.$emit("Grid.unfreeze");
    },
  },
};
</script>

<style>
</style>