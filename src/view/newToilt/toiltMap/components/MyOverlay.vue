<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div v-if="status" @click="handleClick">
      <img
        src="../images/congestion.gif"
        alt=""
        v-if="!active"
        style="width: 73px; height: 127px"
      />
      <img
        src="../images/checked.gif"
        alt=""
        v-if="active"
        style="width: 73px; height: 127px"
      />
    </div>
    <div v-if="!status" @click="handleClick">
      <img
        src="../images/smooth.gif"
        alt=""
        v-if="!active"
        style="width: 73px; height: 127px"
      />
      <img
        src="../images/checked2.gif"
        alt=""
        v-if="active"
        style="width: 73px; height: 127px"
      />
    </div>
  </bm-overlay>
</template>

<script>
import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
export default {
  props: ["status", "position", "active", "allInfo", "index"],
  components: {
    BmOverlay
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true,
    },
  },
  methods: {
    handleClick() {
      // global.alert("Well done.");
      let node = {
        id: this.allInfo.toiletId,
        label: this.allInfo.toiletName,
        regionId: this.allInfo.regionId,
        index: this.index,
        ...this.allInfo
      }
      this.$emit('getDetail', node.id)
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    },
  },
};
</script>

<style>
.sample {
  width: 73px;
  height: 127px;
  position: absolute;
}
/* .sample.active {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
} */
</style>