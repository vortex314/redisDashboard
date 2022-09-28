<template>
  <v-card class="d-flex fill-height justify-center  outlined align-center">
    <span bgcolor="onState ? 'green' : 'red'" style="font-size: 20px">
      {{ config.label }}
    </span>
    <v-container class="px-0" fluid>
      <v-btn-toggle v-model="buttonSelected" background-color="blue"  >
        <v-btn v-for="idx in config.labels.length" 
        :key="idx" 
        :label="config.labels[idx-1]"
        :value="config.values[idx-1]"
        @click="buttonClicked(idx)"
       >
          {{config.labels[idx-1]}}
        </v-btn>
      </v-btn-toggle>
    </v-container>
  </v-card>
</template>

<script>
import { Sub } from "../Sub.js";
import { Redis } from "@/Redis.js";

export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "DUMMY",
        srcTopic: "src/battery/tester/mode",
        dstTopic: "dst/battery/tester/mode",
        values: ["charge", "discharge", "idle"],
        labels: ["Charging", "Discharging", "Ready"],
        repeatSend: false,
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      timedOut: true,
      buttonSelected: "charge",
      idx: 0,
    };
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config, newVal, oldVal);
      this.sub.dispose();
      this.sub = new Sub(
        this.config.srcTopic,
        this.config.timeout,
        this.onMessage,
        this.onTimeout
      );
    },
  },
  mounted() {
    this.sub = new Sub(
      this.config.srcTopic,
      60000,
      this.onMessage,
      this.onTimeout
    );
    console.log(
      "SubSwitch label:" + this.config.label + " topic " + this.config.dstTopic
    );
  },
  methods: {
    onMessage(topic, message) {
      this.timedOut = false;
      let me = this;
      this.config.values.find((value) => {
        if (value == message) {
          me.buttonSelected = message;
        }
      });
    },
    onTimeout() {
      this.timedOut = true;
    },
    buttonClicked(btn) {
      let v =  this.config.values[btn-1];
      Redis.request([
        "publish",
        this.config.dstTopic,
        v,
      ]).then(function (response) {
        console.log("response", response);
      });
    },
  },
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