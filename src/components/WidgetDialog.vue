<template>
  <v-dialog v-model="show" persistent max-width="600px" dense>
    <v-tabs v-model="tab">
      <v-tab>Type</v-tab>
      <v-tab>Topics</v-tab>
      <v-tab>Settings</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">

      <v-tab-item>
        <v-container class="px-6">
          <v-select :items="items" label="Widget Type" v-model="selectedType" />
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <mqtt-selection @topics="topicsFromSelection" />
      </v-tab-item>

      <v-tab-item>
        <grid-gauge-dialog v-if="selectedType == 'gauge'" ref="widgetSettings" />
        <grid-text-dialog v-if="selectedType == 'text'" ref="widgetSettings" />
        <grid-status-dialog v-if="selectedType == 'status'" ref="widgetSettings" />
      </v-tab-item>

      <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="updateWidget"> Update </v-btn>
    </v-tabs-items>
  </v-dialog>
</template>

<script>
import GridGaugeDialog from "./GridGaugeDialog";
import GridTextDialog from "./GridTextDialog";
import GridStatusDialog from "./GridStatusDialog";
import MqttSelection from "./MqttSelection.vue";
import {cloneDeep,merge} from "lodash";
//import { EventBus } from "./eventbus";
export default {
  name: "GridDialog",
  components: {
    GridGaugeDialog,
    GridTextDialog,
    GridStatusDialog,
    MqttSelection,
  },
  props: {
    value: Boolean,
    widget:{
    }
  },
  data() {
    return {
      items: [
        "gauge",
        "compass",
        "linePlot",
        "status",
        "button",
        "text",
        "table",
      ],
      selectedType: "text",
      topics: [],
      tab: null,
    };
  },
  methods: {
    topicsFromSelection(topics){
      this.topics=topics
    },
    cancel() {
      this.show = false;
    },
    updateWidget() {
      this.show = false;
      console.log(" updating widget ",this.selectedType,cloneDeep(this.topics),cloneDeep(this.$refs.widgetSettings.input))
      let widget = {type:this.selectedType,topics:cloneDeep(this.topics)}
      merge(widget,cloneDeep(this.$refs.widgetSettings.input)) // get child dialog data
      this.$emit('widgetUpdate',widget);
//      EventBus.$emit("gridAdd",widget)
    },
    onTopicsEvent(ev) {
      this.topics = ev;
    },
  },
  computed: {
    showTopics() {
      if (this.topics.length == 0) return "No Topics selected";
      else return JSON.stringify(this.topics);
    },
    show: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      },
    },
  },
};
</script>

<style>
</style>