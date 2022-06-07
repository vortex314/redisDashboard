<template>
  <div>

    <v-jsoneditor
      v-model="json"
      :options="options"
      :plus="false"
      height="400px"
      width="600px"
      @error="onError"
    />
    <v-btn @click="saveConfig">Save</v-btn>
    <v-btn @click="cancelConfig">Cancel</v-btn>
  </div>
</template>

<script>
import VJsoneditor from "v-jsoneditor";

export default {
  name: "ConfigEditor",
  components: {
    VJsoneditor,
  },
  props: {
    config: Object,
    widgetList: Array,
  },
  watch: {
    // copy prop to json value of v-jsoneditor
    config: function (newVal) {
      // watch it
      this.json = newVal;
    },
  },
  data() {
    var self = this;
    return {
      json: this.config,
      options: {
        onChangeText(text) {
          try {
            self.json = JSON.parse(text);
          } catch (e) {
            console.log("-");
          }
        },
        mode: "code",
      },
    };
  },
  methods: {
    onError() {
      console.log("error");
    },
    saveConfig() {
      this.$emit("configSave", this.json);
    },
    cancelConfig() {
      this.$emit("configCancel", this.json);
    },

  },
};
</script>

<style>
</style>