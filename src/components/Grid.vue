<template>
  <div class="ml-0">
    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="20"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :margin="[1, 1]"
      :use-css-transforms="true"
    >
      <grid-item
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
      >
        >
        {{ item.i }}
        <redis-connection></redis-connection>
      </grid-item></grid-layout
    >
  </div>
</template>

<script>
import { Redis } from "../redis.js";
import { Timer } from "../timer.js";
import VueGridLayout from "vue-grid-layout";
import RedisConnection from "./RedisConnection.vue";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
var testLayout = [
  {
    x: 0,
    y: 0,
    w: 12,
    h: 1,
    i: "0",
    type: "RedisConnection",
    params: { host: "localhost", port: 9000 },
  },
  { x: 2, y: 0, w: 2, h: 4, i: "1" },
  { x: 4, y: 0, w: 2, h: 5, i: "2" },
  { x: 6, y: 0, w: 2, h: 3, i: "3" },
  { x: 8, y: 0, w: 2, h: 3, i: "4" },
  { x: 10, y: 0, w: 2, h: 3, i: "5" },
  { x: 0, y: 5, w: 2, h: 5, i: "6" },
  { x: 2, y: 5, w: 2, h: 5, i: "7" },
  { x: 4, y: 5, w: 2, h: 5, i: "8" },
  { x: 6, y: 4, w: 2, h: 4, i: "9" },
  { x: 8, y: 4, w: 2, h: 4, i: "10" },
  { x: 10, y: 4, w: 2, h: 4, i: "11" },
  { x: 0, y: 10, w: 2, h: 5, i: "12" },
  { x: 2, y: 10, w: 2, h: 5, i: "13" },
  { x: 4, y: 8, w: 2, h: 4, i: "14" },
  { x: 6, y: 8, w: 2, h: 4, i: "15" },
  { x: 8, y: 10, w: 2, h: 5, i: "16" },
  { x: 10, y: 4, w: 2, h: 2, i: "17" },
  { x: 0, y: 9, w: 2, h: 3, i: "18" },
  { x: 2, y: 6, w: 2, h: 2, i: "19" },
];

export default {
  name: "RedisWs",
  data() {
    return {
      Redis,
      Timer,
      colorPrimary: "success",
      timer: {},
      count: 0,
      layout: testLayout,
    };
  },
  props: {},
  components: {
    GridLayout,
    GridItem,
    RedisConnection
  },
  created() {
    this.timer = Timer.create(this.expired, 5000);
    Redis.subscribe(this.update, "src/hover/system/loopback");
    setInterval(this.update, 7000, "XXXX");
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
    update(v) {
      console.log(v);
      this.resumed();
    },
    expired() {
      console.log("expired");
      this.colorPrimary = "danger";
    },
    resumed() {
      this.colorPrimary = "success";
      this.timer.reset();
    },
  },
};
</script>
<style scoped>
.vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 20px;
  height: 20px;
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
  background: #ccc;
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
</style>
