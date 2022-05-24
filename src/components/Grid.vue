<template>
  <div class="ml-0">
    <grid-layout
      :layout="layout"
      :col-num="24"
      :row-height="15"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :margin="[1, 1]"
      :use-css-transforms="true"
    >
      <grid-item
        class="m-0 p-0"
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resize="resizeEvent"
        @move="moveEvent"
        @resized="resizedEvent"
        @moved="movedEvent"
        @contextmenu.native="handler"
        ><span class="remove" @click="removeItem(item.i)">x</span>
        <component
          style="{'backgroundColor':'#FC0'}"
          :is="item.type"
          v-bind="item.params"
        ></component> </grid-item
    ></grid-layout>
  </div>
</template>

<script>
import { Redis, Eventbus } from "../Redis.js";
import VueGridLayout from "vue-grid-layout";
import RedisConnection from "./RedisConnection.vue";
import SubLabel from "./SubLabel.vue";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
var testLayout = [
  {
    x: 0,
    y: 0,
    w: 6,
    h: 2,
    i: "0",
    type: "RedisConnection",
    params: { host: "limero.ddns.net", port: 9000, path: "/redis" },
  },
  {
    x: 2,
    y: 0,
    w: 2,
    h: 4,
    i: "1",
    type: "SubLabel",
    params: { label: "Voltage", topic: "src/hover/motor/voltage", unit: "V" },
  },
  {
    x: 4,
    y: 0,
    w: 2,
    h: 5,
    i: "2",
    type: "SubLabel",
    params: { label: "Angle", topic: "src/hover/motor/angle", unit: "°" },
  },
  { x: 6, y: 0, w: 2, h: 3, i: "3" },
  { x: 8, y: 0, w: 2, h: 3, i: "4" },
  { x: 10, y: 0, w: 2, h: 3, i: "5" },
  { x: 0, y: 5, w: 2, h: 5, i: "6" },
];

export default {
  name: "GridVue",
  data() {
    return {
      Redis,
      Eventbus,
      colorPrimary: "success",
      timer: {},
      count: 0,
      layout: testLayout,
      index:"7"
    };
  },
  props: {},
  components: {
    GridLayout,
    GridItem,
    RedisConnection,
    SubLabel,
  },
  created() {
    Eventbus.$on("Grid.save", this.saveToRedis);
    Eventbus.$on("Grid.load", this.loadFromRedis);
    Eventbus.$on("Grid.add", this.addGridItem);
  },
  mounted() {
    Redis.connect();
  },
  methods: {
    moveEvent: function (i, newX, newY) {
      console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizeEvent: function (i, newH, newW) {
      console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
    },
    movedEvent: function (i, newX, newY) {
      console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizedEvent: function (i, newH, newW) {
      console.log("RESIZED i=" + i + ", H=" + newH + ", W=" + newW);
    },
    addGridItem: function () {
      // Add a new item. It must have a unique key!
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 2,
        h: 2,
        i: this.index,
      });
      // Increment the counter to ensure key is always unique.
      this.index++;
    },
    removeItem: function (val) {
      const index = this.layout.map((item) => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
    handler(event) {
      console.log("rightClickHandler", event.srcElement.__vue__, event);
      event.preventDefault();
    },
    saveToRedis() {
      var serialized = JSON.stringify(this.layout);
      console.log(serialized);
      Redis.request(["set", "dashboard", serialized]).then((x) => {
        alert("saveToRedis", x);
      });
    },
    loadFromRedis() {
      Redis.request(["get", "dashboard"]).then((data) => {
        this.layout = JSON.parse(data[1]);
        alert("loadFromRedis", data);
      });
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
  border: 1px solid black;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item.static {
  background: #cce;
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
  right: 2px;
  top: 0;
  cursor: pointer;
}
</style>
