<template>
  <iframe id="ifrm" name="subFrame" :src="config.iframeSource" style="-webkit-transform:scale(1.0);border: 4px solid black;"
    FRAMEBORDER="yes" BORDER="1" SCROLLING="yes" />
</template>

<script>
/*jshint esversion: 6 */

import { Redis, Eventbus, Timer, newKey } from "../Redis.js";
export default {
  name: "ExtFrame",
  props: {
    config: {
      type: Object,
      default: () => ({
        label: "LABELDUMMY",
        iframeSource: "https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_1280.jpg",
      }),
    },
  },
  data() {
    return {
      key: newKey(),
      count: 0,
      value: 0,
      classState: "m-0 p-0 text-center dead",
      Redis,
      Eventbus,
      Timer,
    };
  },

  watch: {
    config: function (newConfig, oldConfig) {
      console.log(
        this.name + "watch config newVal:" + newConfig + " oldVal:" + oldConfig
      );
      this.key = newKey();

    },
  },
  mounted() {
    console.log(document.getElementById("ifrm").contentWindow.document);
    document.getElementById("ifrm").contentWindow.document.body.oncontextmenu = function () {
      console.log("iframe loaded");
      return false;
    };
   /* window.frames["ifrm"].document.oncontextmenu = function () {
      console.log("disable context menu");
      return false;
    };*/
  },
  methods: {
    rightClickHandler(event, item) {
      console.log("Right click ", event, item);
    }
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

iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>