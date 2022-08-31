<template>
  <v-card class="d-flex fill-height justify-center  outlined align-center" >
    <v-btn :color="color"  elevation="3" width="98%" height="95%" >{{
      config.label
    }}</v-btn>
  </v-card>
</template>

<script>
import { Sub } from "../Sub.js";

export default {
  name: "SubButton",
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "LABELDUMMY",
        topic: "src/device/object/prop",
        timeout: 3000,
      }),
    },
  },
  data() {
    return {
      color: "red",
    };
  },
  watch: {
    config: function (newVal, oldVal) {
      console.log(this.config.label, newVal, oldVal);
      this.sub.dispose();
      this.sub = new Sub(
        this.config.topic,
        this.config.timeout,
        this.onMessage,
        this.onTimeout
      );
    },
  },
  mounted() {
    this.sub = new Sub(
      this.config.topic,
      this.config.timeout,
      this.onMessage,
      this.onTimeout
    );
    console.log(
      "SubSwitch label:" + this.config.label + " topic " + this.config.dstTopic
    );
  },
  methods: {
    onMessage() {
        this.color = "green";
        this.sub.resetTimer();
    },
    onTimeout() {
      this.color = "red";
    },
  },
};
</script>

<style>
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;

  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }

  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

.v-input--expand .v-input__slot {
  .v-label {
    display: block;
    flex: 1;
  }
}

.container {
  max-width: 360px;
}
</style>