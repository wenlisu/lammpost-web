/* eslint-disable camelcase */
<template>
  <div id="lightMap">
    <div id="allmap"></div>
    <dv-loading v-if="!show || loading"></dv-loading>
    <baidu-map
      id="bm-view"
      ref="map"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="show && !loading && 'readyMap'"
    >
      <slot name="content" />
      <bm-marker
        v-for="(item, index) in bmMarkers"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :icon="{ url: item.url, size: item.size }"
        :zIndex="item.zIndex"
        :dragging="false"
        @click="onCurrentMarker(item)"
        @mouseover="onClickMarker(index)"
        :top="item.zIndex === 2 ? true : false"
        :title="item.terminalName"
      >
      </bm-marker>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :showAddressBar="true"
        :autoLocation="true"
        v-if="show"
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
import radioType from "@/components/radioType";
import lightTable from "./components/table";
import lightLabers from "./components/labers";
import lightInfo from "./components/info";
import img7 from "./images/img7.png";
import img8 from "./images/img8.png";
import img9 from "./images/img9.png";
import img10 from "./images/img10.png";
import bMap from "vue-baidu-map-v3/components/map/Map.vue";
import {
  getInfo,
  getTerminalCount,
  getRoad,
  queryTerminal,
  getBriefInfo,
} from "api/lightPoleMap";
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
/** 空气质量 */
const airQuality = {
  优: "green",
  良好: "greent",
  轻度污染: "yellow",
  重度污染: "orange",
};
/** 灯杆状态 */

export default {
  name: "lightPoleMap",
  data() {
    return {
      batteryType,
      center: "广东",
      zoom: 8,
      polylinePath: [],
      bmMarkers: [],
      infoShow: false,
      tableType: 1,
      show: false,
      info: {
        type: 1,
        imei: "",
        terminalName: "",
        longitude: "",
        latitude: "",
        warnContent: "",
        updateTime: "",
        personInCharge: "",
        personInChargeTel: "",
        groupName: "",
        address: "",
        slampOn: "",
        sbatteryInUse: "",
        stemperatureValue: "",
        shumidityValue: "",
        swindSpeedValue: "",
        swindValue: "",
        snoiseValue: "",
        satmosphereValue: "",
        spmValue: "",
        slampSavingLevelText: "",
        sairQualityLevel: "",
        sairQualityRange: "",
        serviceAddress: [],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      
    });
  },
  props: {
    nodeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    init: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    marker: {
      type: String,
      default: "LAMP",
    },
  },
  watch: {
    nodeData(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.bmMarkers)) {
        this.bmMarkers = JSON.parse(JSON.stringify(val));
      }
    },
    // 'nodeData': {
    //   deep: true,
    //   handle (val) {
    //     this.bmMarkers = val;
    //   }
    // }
  },
  components: {
    bMap,
    lightTable,
    lightLabers,
    lightInfo,
    radioType,
    BmGeolocation,
    BmMarker,
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      setTimeout(async () => {
        map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
        });
        this.bmMarkers = this.nodeData;
        this.show = true;
      }, 550);
    },
    onCurrentMarker(index) {
      this.$emit("click", this.bmMarkers[index]);
    },
    onClickMarker(index) {
      this.$emit("mouseover", this.bmMarkers[index]);
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    getStatus(data) {
      let status = 1;
      if (data.onlineStatus !== 1) {
        status = 3;
      }
      return status || 1;
    },
    // lampStatus 0关灯 1开灯
    // onlineStatus 1 在线
  },
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
#lightMap {
  height: 100%;
  .sample {
    width: 120px;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    box-shadow: 0 0 5px #000;
    color: #fff;
    text-align: center;
    padding: 10px;
    position: absolute;
  }
  .sample.active {
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
  }
  .bm-view {
    width: 100%;
    height: calc(100%);
    position: relative;
    visibility: hidden;
    &.readyMap {
      visibility: visible;
    }
    .info {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
      #radioType {
        justify-content: flex-start;
      }
      > div {
        padding: 35px 36px 35px 25px;
      }
      button {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0;
        border-radius: 0;
        width: 20px;
        height: 20px;
        background: rgba(103, 112, 148, 1);
        /deep/i {
          color: #fff;
          font-size: 12px;
        }
      }
      > div > div {
        margin-bottom: 10px;
        font-size: 12px; /*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        &.title {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          font-size: 14px; /*no*/
          cursor: pointer;
          img {
            width: 17px;
            height: 12px;
            margin-left: 8px;
          }
        }
        &:last-child {
        }
      }
      .error {
        background: url("./images/img6.png") no-repeat center;
        background-size: 100% 100%;
      }
      .correct {
        min-width: 333px; /*no*/
        background: url("./images/img11.png") no-repeat center;
        background-size: 100% 100%;
        color: #fff;
        .orange {
          color: #ff720d;
        }
        .warn {
          color: #ff3c30;
        }
        > div {
          width: 100%;
          // color: #fff;
          > div {
            flex: 1;
            text-align: left;
            // color: #fff;
          }
          span.diamond {
            font-size: 12px; /*no*/
            color: #fff;
            padding: 1px 7px; /*no*/
            background: linear-gradient(
              141deg,
              rgba(49, 205, 151, 1) 0%,
              rgba(31, 171, 142, 1) 100%
            );
            border-radius: 50px;
            &.greent {
              background: linear-gradient(
                141deg,
                rgba(135, 199, 68, 1) 0%,
                rgba(94, 147, 48, 1) 100%
              );
            }
            &.yellow {
              background: linear-gradient(
                141deg,
                rgba(251, 186, 69, 1) 0%,
                rgba(233, 156, 33, 1) 100%
              );
            }
            &.orange {
              background: linear-gradient(
                141deg,
                rgba(251, 115, 69, 1) 0%,
                rgba(233, 86, 33, 1) 100%
              );
            }
          }
        }
        .updateTime {
          color: rgba(135, 145, 190, 1);
          margin-bottom: 0;
        }
        .address {
          align-items: center;
          img {
            width: 14px;
            height: 16px;
            margin-right: 6px;
          }
        }
        .imgList {
          min-width: 256px;
          max-width: 500px;
          img,
          video {
            width: calc(50% - 3px); /*no*/
            height: 79px;
            &:first-child {
              margin-right: 6px; /*no*/
            }
          }
        }
        .el-switch {
          width: 29px; /*no*/
          height: 13px; /*no*/
          /deep/.el-switch__core {
            height: 100%;
            &::after {
              top: 0;
              width: 11px; /*no*/
              height: 11px; /*no*/
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 7px 0px rgba(27, 104, 126, 0.5);
            }
          }
          &.is-checked {
            /deep/.el-switch__core {
              &::after {
                margin-left: -12px; /*no*/
              }
            }
          }
        }
      }
      .tabTitle {
        font-size: 12px; /*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        padding: 8px 10px;
        position: relative;
        border-bottom: 1px solid rgba(46, 61, 107, 1); /*no*/
        &::after {
          content: "";
          width: 3px; /*no*/
          height: 12px; /*no*/
          background: rgba(216, 216, 216, 1)
            linear-gradient(
              138deg,
              rgba(62, 210, 240, 1) 0%,
              rgba(58, 104, 211, 1) 100%
            );
          border-radius: 1px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }
      .el-collapse {
        border: none;
        .el-collapse-item {
          width: 100%;
          padding-right: 0;
          /deep/.el-collapse-item__header {
            height: auto;
            line-height: initial;
            border-bottom: none;
            background-color: transparent;
            position: relative;
            margin-bottom: 10px;
            .tabTitle {
              width: 100%;
            }
            i {
              position: absolute;
              color: #fff;
              right: 0px;
            }
          }
          /deep/.el-collapse-item__wrap {
            background: transparent;
            border-bottom: none;
            .el-collapse-item__content {
              padding-bottom: 0px;
              > div {
                background: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
