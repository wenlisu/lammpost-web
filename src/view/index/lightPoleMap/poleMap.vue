/* eslint-disable camelcase */
<template>
  <div id="poleMap">
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <baidu-map
      ref="map"
      class="bm-view"
      ak="ZyKWZjnDOAUE4WEq9Qu9SMT4b9v8iUGM"
      :center="center"
      :zoom="zoomIndex"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="baiduMapShow && 'readyMap'"
    >
      <bm-marker
        v-for="(item, index) in bmMarkers"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :icon="{ url: item.url, size: item.size }"
        :zIndex="item.zIndex"
        :dragging="false"
        @click="onClickMarker(item)"
        :top="item.zIndex === 2 ? true : false"
        :title="item.terminalName"
      >
      </bm-marker>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :showAddressBar="true"
        :autoLocation="true"
        v-if="baiduMapShow"
      ></bm-geolocation>
    </baidu-map>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import {
  BmlCurveLine,
  BmGeolocation,
  BmMarker,
} from "vue-baidu-map-v3/components";
import lamp1 from "@/common/images/markers/lamp1.png";
import lamp2 from "@/common/images/markers/lamp2.png";
import lamp3 from "@/common/images/markers/lamp3.png";
import img7 from "./images/img7.png";
import img8 from "./images/img8.png";
import img9 from "./images/img9.png";
import img10 from "./images/img10.png";
import { routePush } from "@/util/util";
/** 1:灯带、2：灯杆 */
/**
 * 充电桩使用状态：batteryInUse   1:停用；2：闲置；3：使用中
 * 充电桩设备状态：batteryStatus 1:在线，2：故障
 */
const batteryType = {
  1: "停用",
  2: "闲置",
  3: "使用中",
};
/** 灯杆状态 */
const lightTypes = {
  1: {
    normal: lamp1,
    current: lamp1,
  },
  2: {
    normal: lamp2,
    current: lamp2,
  },
  3: {
    normal: lamp3,
    current: lamp3,
  },
};

export default {
  name: "poleMap",
  data() {
    return {
      batteryType,
      center: "广东",
      bmMarkers: [],
      baiduMapShow: false,
      zoomIndex: this.zoom,
    };
  },
  props: {
    zoom: {
      type: Number,
      default: 8,
    },
    marker: {
      type: Array,
      default: () => {
        return [];
      },
    },
    styleId: {
      type: String,
      default: "02b81ab7cd95f6aece86c3500bf9b3cf",
    },
  },
  watch: {
    marker(val) {
      this.setInfo(val);
    },
    zoom(val) {
      if (val !== this.zoomIndex) {
        this.zoomIndex = val;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  components: {
    BmGeolocation,
    BmMarker,
  },
  computed: {
    ...mapGetters(["common"]),
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      setTimeout(async () => {
        if (this.styleId !== "") {
          map.setMapStyleV2({
            styleId: this.styleId,
          });
        }
        await this.setInfo(this.marker);
        this.baiduMapShow = true;
      }, 550);
    },
    onClickMarker(target) {
      this.$emit("onClick", target);
    },
    getStatus(data) {
      let status = data.lampStatus === 2 ? 3 : data.lampEquipStatus;
      if (data.lampEquipStatus === 2) {
        status = 2;
      }
      return status || 1;
    },
    setInfo(resData) {
      if (resData && resData.length > 0) {
        this.center = {
          lng: +resData[0].longitude,
          lat: +resData[0].latitude,
        };
        const bmMarkers = resData.map((data) => {
          return {
            ...data,
            size: { width: 17, height: 32 },
            status,
            url: lightTypes[data.status] && lightTypes[data.status].normal,
            zIndex: data.terminalPosition === 2 ? 1 : 2,
            position: {
              lng: +data.longitude,
              lat: +data.latitude,
            },
          };
        });
        this.bmMarkers = bmMarkers;
      }
    },
    onZoomend({ target }) {
      this.zoomIndex = target.Na;
    },
  },
};
</script>

<style lang="less" scoped>
#poleMap {
  .bm-view {
    width: 100%;
    height: calc(100% - 115px);
    position: relative;
    visibility: hidden;
    &.readyMap {
      visibility: visible;
    }
  }
}
</style>
