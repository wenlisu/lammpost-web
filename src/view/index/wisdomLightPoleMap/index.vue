<template>
  <div id="wisdomLightPoleMap">
    <mapTitle name="设备实时概览" />
    <baidu-map
      ak="IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU"
      id="bm-view"
      ref="map"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="baiduMapShow && 'readyMap'"
    >
      <!-- <left-component />
      <right-component />
      <center-component /> -->
      <bm-marker
        v-for="(item, index) in bmMarkers"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :icon="{ url: item.url, size: item.size }"
        :zIndex="item.zIndex"
        :dragging="false"
        @click="onCurrentMarker(item)"
        @mouseover="onClickMarker(item)"
        :top="item.zIndex === 2 ? true : false"
        :title="item.terminalName"
      >
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";
import mapTitle from "@/components/mapTitle";
import {
  BmlCurveLine,
  BmGeolocation,
  BmMarker
} from "vue-baidu-map-v3/components";
import {
  getInfo,
  getTerminalCount,
  getRoad,
  queryTerminal,
  getBriefInfo
} from "api/lightPoleMap";
import BaiduMap from "vue-baidu-map-v3/components/map/Map.vue";
import LeftComponent from "./components/leftComponent"
import RightComponent from "./components/rightComponent"
import CenterComponent from "./components/centerComponent"
import { MARKERS_TYPE } from "@/util/constants";
/** 灯杆状态 */
const lightTypes = MARKERS_TYPE["LAMP"];
export default {
  data() {
    return {
      bmMarkers: [],
      tableActiveId: null,
      baiduMapShow: false,
      center: "广东",
      updateTime: undefined,
      editData: {},
      infoShow: false,
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
        serviceAddress: []
      }
    };
  },
  computed: {
    ...mapGetters(["common", "openPage"])
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      setTimeout(async () => {
        map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf"
        });
        // this._getTerminalCount();
        if (this.$store.state.updateTime.lampTime) {
          this.updateTime = setInterval(
            // this.cyclingInit,
            this.$store.state.updateTime.lampTime * 1000
          );
        }
        const infoStatus = await this._getInfo();
        this.baiduMapShow = true;
        this.editData = this.common["lightPoleMap"];
        if (infoStatus && this.editData && this.editData.imei) {
          this.address = this.editData.address;
          this.tableActiveId = this.editData.imei;
          const queryTerminalStatus = await this._queryTerminal({
            address: this.editData.address
          });
          if (queryTerminalStatus) {
            await this.onClickMarker({ imei: this.editData.imei });
          }
          store.commit("set_common", {
            lightPoleMap: {}
          });
        } else {
          this._getRoad(1);
        }
      }, 550);
    },
    _queryTerminal(parames) {
      return queryTerminal(parames).then(res => {
        if (res.code === "200") {
          /* this.tableTitle = "总耗电TOP10灯杆";
          this.tableType = 2; */
          this.zoom = 14;
          // this.tableData = res.data;
          const centerData = res.data[parseInt(res.data.length / 2, 10)];
          this.center = {
            lng: +centerData.longitude,
            lat: +centerData.latitude
          };
          const findActiveBrief = res.data.find(
            table => table.imei === this.tableActiveId
          );
          if (findActiveBrief) {
            this.activeGetInfo({ imei: this.tableActiveId });
            return false;
          }
          return true;
        }
      });
    },
    _getRoad(type) {
      getRoad().then(res => {
        if (res.code === "200") {
          /* this.tableTitle = "总耗电TOP10道路";
          this.tableType = 1; */
          this.zoom = 8;
          // this.tableData = res.data;
          this.initInfo();
          /* if (type) {
            this.onCureent(res.data[0]);
          } */
        }
      });
    },
    cyclingInit() {
      if (this.openPage === "lightPoleMap") {
        this._getTerminalCount();
        this._getInfo();
      } else {
        this.updateTime && clearInterval(this.updateTime);
      }
    },
    initInfo() {
      this.zoomTarget({ imei: -1 });
      this.infoShow = false;
      this.info = {
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
        serviceAddress: []
      };
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    onCurrentMarker(target) {
      this.dialog.show = true;
    },
    onClickMarker(target) {
      if (this.tableActiveId !== target.imei) {
        this.tableActiveId = target.imei;
        this.activeGetInfo(target);
      }
    },
    activeGetInfo(item) {
      // this._getBriefInfo(item.imei);
      this.zoomTarget(item);
    },
    zoomTarget(item) {
      const bmMarkers = this.bmMarkers.map(marker => {
        if (marker.imei === item.imei) {
          this.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat
          };
          this.info.type = marker.status;
          return {
            ...marker,
            url: lightTypes[marker.status] && lightTypes[marker.status].current,
            size: { width: 45, height: 70 }
          };
        }
        return {
          ...marker,
          url: lightTypes[marker.status] && lightTypes[marker.status].normal,
          size: { width: 17, height: 32 }
        };
      });
      this.bmMarkers = bmMarkers;
    },
    getStatus(data) {
      let status = 1;
      if (
        data.onlineStatus !== 1 ||
        (data.onlineStatus === 1 && data.powerStatus === 0)
      ) {
        status = 3;
      }
      if (data.callAlarmStatus > 1) {
        status = 2;
      }
      return status || 1;
    },
    _getTerminalCount() {
      getTerminalCount().then(res => {
        if (res.code === "200") {
          this.items = this.items.map(item => {
            return {
              ...item,
              value: res.data[item.id] || 0
            };
          });
        }
      });
    },
    _getInfo() {
      return getInfo().then(res => {
        if (res.code === "200") {
          this.bmMarkers = res.data.map(data => {
            const status = this.getStatus(data);
            return {
              ...data,
              size: { width: 17, height: 32 },
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude
              }
            };
          });
          // console.log(this.bmMarkers, 'bmMarkers')
          return true;
        }
      });
    }
  },
  destroyed () {
    this.updateTime && clearInterval(this.updateTime);
  },
  components: {
    mapTitle,
    BmlCurveLine,
    BmGeolocation,
    BmMarker,
    BaiduMap,
    LeftComponent,
    RightComponent,
    CenterComponent
  }
};
</script>

<style lang="less" scoped>
#wisdomLightPoleMap {
  .bm-view {
    width: 100%;
    // height: calc(100% - 115px);
    height: 100%;
    position: relative;
    visibility: hidden;
    &.readyMap {
      visibility: visible;
    }
  }
}
</style>