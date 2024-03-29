<template>
  <div class="ml-0">
    <grid-layout :layout="layout" :col-num="24" :row-height="15" :is-draggable="isDraggable" :is-resizable="isResizable"
      :vertical-compact="true" :margin="[0, 0]" :use-css-transforms="true">
      <grid-item class="m-0 p-0" v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
        :i="item.i" @resize="resizeEvent" @move="moveEvent" @resized="resizedEvent" @moved="movedEvent"
        :style="{ border: border }">
        <component style="{'backgroundColor':'#FC0'}" :is="item.type" v-bind="item.config" :ref="item.i"
          @contextmenu.native="rightClickHandler($event, item)">
        </component>

        <span v-if="isRemovable" class="copy" @click="copyItem(item.i)" ><v-icon x-small>mdi-content-copy</v-icon></span>
        <span v-if="isRemovable" class="remove" @click="removeItem(item.i)" ><v-icon x-small>mdi-trash-can-outline</v-icon></span>
      </grid-item>
    </grid-layout>
    <v-dialog v-model="showSelection" width="400" height="600px">
      Select a widget to add to the grid
      <v-select :items="widgetList" v-model="index" label="Widget" @change="onSelect"></v-select>
    </v-dialog>
    <v-dialog v-model="showEditor">
      Edit widget
      <config-editor :config="currentItemConfig" :widget-list="widgetList" @configSave="configSave"
        @configCancel="configCancel"></config-editor>
    </v-dialog>
  </div>
</template>

<script>
import { Redis, Eventbus } from "../Redis.js";
import VueGridLayout from "vue-grid-layout";
import EmptyGrid from "./EmptyGrid.vue";
import ExtFrame from "./ExtFrame.vue";

import RedisConnection from "./RedisConnection.vue";
import SubLabel from "./SubLabel.vue";
import SubLog from "./SubLog.vue";
import SubAngle from "./SubAngle.vue";
import SubGraph from "./SubGraph.vue";
import SubTable from "./SubTable.vue";
import PubSubSwitch from "./PubSubSwitch.vue";
import ConfigEditor from "./ConfigEditor.vue";
import PubButton from "./PubButton.vue";
import SubButton from "./SubButton.vue";
import TimeSeriesGraph from "./TimeSeriesGraph.vue";
import PubSlider from "./PubSlider.vue";
import SubIframe from "./SubIframe.vue";
import SubGauge from "./SubGauge.vue";
import SubActivity from "./SubActivity.vue";
import PubSubButton from "./PubSubButton.vue";
import PubSubRadioButton from "./PubSubRadioButton.vue";
// import _ from "lodash";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
var testLayout = [
  {
    x: 0,
    y: 0,
    w: 20,
    h: 3,
    i: "item-0",
    type: "RedisConnection",
    config: { config: { host: "pcdell.local", port: 9000, path: "/redis",dashboard:"default" }},
    moved: false,
  },
];

export default {
  name: "GridVue",
  data() {
    return {
      colorPrimary: "success",
      showEditor: false,
      showSelection: false,
      isDraggable: true,
      isResizable: true,
      isDeletable: true,
      isRemovable: true,
      isConfigurable: true,
      border: "1px solid black",
      timer: {},
      count: 0,
      layout: testLayout,
      index: "7",
      currentItemConfig: {},
      newConfig: {},
      currentItem: {},
      widgetList: [
        "ExtFrame",
        "SubActivity",
        "SubAngle",
        "SubButton",
        "SubGraph",
        "SubGauge",
        "SubIframe",
        "SubLabel",
        "SubLog",
        "SubTable",
        "PubSubButton",
        "PubSubSwitch",
        "PubButton",
        "PubSubRadioButton",
        "PubSlider",
        "TimeSeriesGraph"
      ],
    };
  },
  props: {},
  components: {
    GridLayout,
    GridItem,
    ExtFrame,
    RedisConnection,
    SubLabel,
    SubLog,
    SubActivity,
    SubAngle,
    SubGraph,
    SubGauge,
    SubTable,
    ConfigEditor,
    EmptyGrid,
    PubButton,
    PubSubButton,
    PubSubRadioButton,
    PubSubSwitch,
    PubSlider,
    SubButton,
    SubIframe,
    TimeSeriesGraph,
  },
  created() {
    Eventbus.$on("Grid.save", this.saveToRedis);
    Eventbus.$on("Grid.load", this.loadFromRedis);
    Eventbus.$on("Grid.add", this.addGridItem);
    Eventbus.$on("Grid.freeze", this.freezeGrid);
    Eventbus.$on("Grid.unfreeze", this.unfreezeGrid);
    Eventbus.$on("Grid.configSave", this.configSave);
    Eventbus.$on("Grid.configCancel", this.configCancel);
  },
  mounted() {
    Redis.connect();
  },
  methods: {
    /* eslint-disable */
    moveEvent: function (i, newX, newY) {
//      console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizeEvent: function (i, newH, newW) {
 //     console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
    },
    movedEvent: function (i, newX, newY) {
//     console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizedEvent: function (i, newH, newW) {
//      console.log("RESIZED i=" + i + ", H=" + newH + ", W=" + newW);
    },
    /* eslint-enable */
    addGridItem: function () {
      console.log("addGridItem");
      // Add a new item. It must have a unique key!
      var newKey = "item-" + Math.round(Math.random() * 1000000);
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 2,
        h: 2,
        i: newKey,
        type: "EmptyGrid",
        config: {},
      });
      // Increment the counter to ensure key is always unique.
      this.index++;
    },
    removeItem: function (val) {
      const index = this.layout.map((item) => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
    copyItem: function (val) {
      const index = this.layout.map((item) => item.i).indexOf(val);
      var item = JSON.parse(JSON.stringify(this.layout[index])); // deep copy
      item.i = "item-" + Math.round(Math.random() * 1000000)
      this.layout.push(item);
    },
    rightClickHandler(event, item) {
      console.log(event, item);
      this.currentItem = item;
      if (!this.isConfigurable) return;

      if (item.type == "EmptyGrid") {
        this.showSelection = true;
      } else {
        if (Object.keys(this.currentItem.config) == 0) {
          // retrieve default config of widget
          this.vueChild = this.$refs[item.i][0]; // refs are always an array
          this.currentItemConfig = JSON.parse(
            JSON.stringify(this.vueChild._props)
          );
        } else {
          // use current config
          this.currentItemConfig = this.currentItem.config;
        }
        this.showEditor = true;
      }
      event.preventDefault();
    },
    onSelect(v) {
      console.log(v);
      this.currentItem.type = v;
      this.showSelection = false;
    },
    configSave(newConfig) {
      console.log("configSave", newConfig);
      this.currentItem.config = newConfig;
      this.showEditor = false;
    },
    configCancel() {
      console.log("configCancel");
      this.showEditor = false;
    },
    saveToRedis(dashboardName) {
      var serialized = JSON.stringify(this.layout);
      console.log(serialized);
      Redis.request(["set", "dashboard:" + dashboardName, serialized]).then(
        (x) => {
          console.log("Saved to Redis", x);
        }
      );
    },
    loadFromRedis(dashboardName) {
      Redis.request(["get", "dashboard:" + dashboardName]).then((data) => {
        console.log("Loaded from Redis", data);
        console.log("Parsed from Redis", JSON.parse(data[1]));
        this.layout = JSON.parse(data[1]);
        console.log("Grid load", this.layout);
      });
    },
    freezeGrid() {
      console.log("Freeze Grid");
      this.isDraggable = false;
      this.isResizable = false;
      this.isRemovable = false;
      this.isConfigurable = false;
      this.border = "none";
    },
    unfreezeGrid() {
      console.log("Unfreeze Grid");
      this.isDraggable = true;
      this.isResizable = true;
      this.isRemovable = true;
      this.isConfigurable = true;
      this.border = "1px solid black";
    },
  },
};
</script>
<style scoped>
.vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 20px;
  height: 24px;
  bottom: 0;
  right: 0;
  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=");
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  border: 3px solid yellow;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item.static {
  background: #cce;
}

.vue-grid-item {
  overflow: hidden;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 24px;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.remove {
  position: absolute;
  right: 1px;
  top: 0;
  cursor: pointer;
}

.copy {
  position: absolute;
  right: 21px;
  top: 0;
  cursor: pointer;
}
</style>
