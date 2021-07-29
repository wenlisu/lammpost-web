/* eslint-disable camelcase */
<template>
  <div id="lightPoleMap">
    <mapTitle name="设备实时概况" />
    <lightInfo :items="items" />
    <div id="allmap"></div>
    <dv-loading v-if="!baiduMapShow"></dv-loading>
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
      <Information
        @close="infoShow = false"
        @detail="(item) => handleToDetail(item)"
        :show="infoShow"
        :info="info"
        :collapseActiveNames="collapseActiveNames"
      />
      <lightLabers :light="lamp1" :bad="lamp2" :close="lamp3" />
      <lightTable
        :tableData="tableData"
        :title="tableTitle"
        :activeId="tableActiveId"
        @onSearch="onSearch"
        @onCureent="onCureent"
        :type="tableType"
        :address="address"
      />
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
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :showAddressBar="true"
        :autoLocation="true"
        v-if="baiduMapShow"
      ></bm-geolocation>
    </baidu-map>
    <dialog-cont
      @on-cancel="dialogCancel"
      :bottomShow="false"
      :visible.sync="dialog.show"
      width="80%"
      :title="dialog.title"
      append-to-body
      :customClass="'lightPoleDialog'"
    >
      <LightPoleMap type="template" :imei="tableActiveId" />
    </dialog-cont>
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
import BaiduMap from "vue-baidu-map-v3/components/map/Map.vue";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "@/components/searchForm/searchForm";
import radioType from "@/components/radioType";
import mapTitle from "@/components/mapTitle";
import dialogCont from "@/components/dialog";
import videoAddress from "@/view/smokeDetector/smokeDetectorMap/components/videoAddress";
import LightPoleMap from "@/view/lightPole/lightPoleDetail/index";
import lightTable from "./components/table";
import lightLabers from "./components/labers";
import lightInfo from "./components/info";
import Information from "./components/information";
import img7 from "./images/img7.png";
import img8 from "./images/img8.png";
import img9 from "./images/img9.png";
import img10 from "./images/img10.png";
import lamp1 from "@/common/images/markers/lamp1.png";
import lamp2 from "@/common/images/markers/lamp2.png";
import lamp3 from "@/common/images/markers/lamp3.png";
import {
  getInfo,
  getTerminalCount,
  getRoad,
  queryTerminal,
  getBriefInfo,
} from "api/lightPoleMap";
import { routePush } from "@/util/util";
import { MARKERS_TYPE } from "@/util/constants";
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
const lightTypes = MARKERS_TYPE["LAMP"];

export default {
  name: "lightPoleMap",
  data() {
    return {
      lamp1,
      lamp2,
      lamp3,
      batteryType,
      center: "广东",
      updateTime: undefined,
      items: [
        {
          id: "terminalNo",
          src: img7,
          class: "blue",
          name: "灯杆总数",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "brokenTerminalNo",
          src: img8,
          class: "pink",
          name: "故障总数",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "usingPower",
          src: img9,
          class: "green",
          name: "总耗电量 ",
          unit: "度",
          value: "",
          click: () => {},
        },
        {
          id: "savedPower",
          src: img10,
          class: "orang",
          name: "节能用电",
          unit: "度",
          value: "",
          click: () => {},
        },
      ],
      zoom: 8,
      polylinePath: [],
      bmMarkers: [],
      infoShow: false,
      tableType: 1,
      tableTitle: "",
      tableData: [],
      tableActiveId: null,
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
      collapseActiveNames: ["1"],
      baiduMapShow: false,
      address: "",
      editData: {},
      dialog: {
        show: false,
        title: "设备实时信息",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      // var map = new BMap.Map('bm-view');
      // map.setMapStyleV2({
      //   styleId: '02b81ab7cd95f6aece86c3500bf9b3cf'
      // });
      // var script = document.createElement("script");
      // script.type = "text/javascript";
      // script.src =
      //   "//api.map.baidu.com/api?v=3.0&ak=IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU";
    });
  },
  components: {
    BaiduMap,
    headerTitle,
    searchForm,
    dialogCont,
    lightTable,
    lightLabers,
    lightInfo,
    Information,
    radioType,
    mapTitle,
    BmGeolocation,
    BmMarker,
    videoAddress,
    LightPoleMap,
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      setTimeout(async () => {
        map.setMapStyleV2({
          // styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
        });
        this._getTerminalCount();
        if (this.$store.state.updateTime.lampTime) {
          this.updateTime = setInterval(
            this.cyclingInit,
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
            address: this.editData.address,
          });
          if (queryTerminalStatus) {
            await this.onClickMarker({ imei: this.editData.imei });
          }
          store.commit("set_common", {
            lightPoleMap: {},
          });
        } else {
          this._getRoad(1);
        }
      }, 550);
    },
    cyclingInit() {
      if (this.openPage === "lightPoleMap") {
        this._getTerminalCount();
        this._getInfo();
      } else {
        this.updateTime && clearInterval(this.updateTime);
      }
    },
    onSearch(form) {
      const parames = {
        ...form,
        area: "",
        city: "",
      };
      this.tableActiveId = null;
      if (form.address && form.address !== "") {
        this._queryTerminal(parames);
      } else {
        this._getRoad();
      }
    },
    _queryTerminal(parames) {
      return queryTerminal(parames).then((res) => {
        if (res.code === "200") {
          this.tableTitle = "总耗电TOP10灯杆";
          this.tableType = 2;
          this.zoom = 14;
          this.tableData = res.data;
          const centerData =
            this.tableData[parseInt(this.tableData.length / 2, 10)];
          this.center = {
            lng: +centerData.longitude,
            lat: +centerData.latitude,
          };
          const findActiveBrief = this.tableData.find(
            (table) => table.imei === this.tableActiveId
          );
          if (findActiveBrief) {
            this.activeGetInfo({ imei: this.tableActiveId });
            return false;
          }
          return true;
        }
      });
    },
    onCureent(item) {
      this.tableActiveId = item.imei;
      const parames = {
        address: item.address,
      };
      if (this.tableType === 1) {
        this.tableTitle = "总耗电TOP10灯杆";
        this.onSearch(parames);
      } else {
        this.activeGetInfo(item);
      }
    },
    activeGetInfo(item) {
      this._getBriefInfo(item.imei);
      this.zoomTarget(item);
    },
    zoomTarget(item) {
      const bmMarkers = this.bmMarkers.map((marker) => {
        if (marker.imei === item.imei) {
          this.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat,
          };
          this.info.type = marker.status;
          return {
            ...marker,
            url: lightTypes[marker.status] && lightTypes[marker.status].current,
            size: { width: 45, height: 70 },
          };
        }
        return {
          ...marker,
          url: lightTypes[marker.status] && lightTypes[marker.status].normal,
          size: { width: 17, height: 32 },
        };
      });
      this.bmMarkers = bmMarkers;
    },
    onClickMarker(target) {
      if (this.tableActiveId !== target.imei) {
        this.tableActiveId = target.imei;
        this.activeGetInfo(target);
      }
    },
    onCurrentMarker(target) {
      this.dialog.show = true;
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
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
        serviceAddress: [],
      };
    },
    _getBriefInfo(imei) {
      getBriefInfo(imei).then((res) => {
        if (res.code === "200") {
          // let infos = {};
          // Object.keys(this.info).map(info => {
          //   infos[info] = res.data[info];
          // });
          const deviceAmbientData = res.data.terminalDeviceModuleDtos.find(
            (dto) => dto.deviceTypeNo === "AMBIENT"
          );
          const deviceLampData = res.data.terminalDeviceModuleDtos.find(
            (dto) => dto.deviceTypeNo === "LAMP"
          );
          const deviceCallData = res.data.terminalDeviceModuleDtos.find(
            (dto) => dto.deviceTypeNo === "CALL"
          );
          const deviceCameraData = res.data.terminalDeviceModuleDtos.find(
            (dto) => dto.deviceTypeNo === "CAMERA"
          );
          if (!deviceAmbientData) {
            this.collapseActiveNames = ["2", "3"];
          } else {
            this.collapseActiveNames = ["1", "2"];
          }
          this.info = {
            // ...infos,
            ...res.data,
            deviceCameraData: deviceCameraData || {},
            deviceAmbientData: deviceAmbientData || {},
            deviceAmbientDataDto: deviceAmbientData
              ? deviceAmbientData.deviceAmbientDataDto
              : {},
            deviceLampDto: deviceLampData ? deviceLampData.deviceLampDto : {},
            deviceCallData: deviceCallData || {},
            type: this.info.type,
          };
          this.infoShow = true;
          console.log(this.info.type, this.infoShow);
        }
      });
    },
    _getRoad(type) {
      getRoad().then((res) => {
        if (res.code === "200") {
          this.tableTitle = "总耗电TOP10道路";
          this.tableType = 1;
          this.zoom = 8;
          this.tableData = res.data;
          this.initInfo();
          if (type) {
            this.onCureent(res.data[0]);
          }
        }
      });
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
    // lampStatus 0关灯 1开灯
    // onlineStatus 1 在线
    _getInfo() {
      return getInfo().then((res) => {
        if (res.code === "200") {
          this.bmMarkers = res.data.map((data) => {
            const status = this.getStatus(data);
            return {
              ...data,
              size: { width: 17, height: 32 },
              status,
              url: lightTypes[status] && lightTypes[status].normal,
              zIndex: data.terminalPosition === 2 ? 1 : 2,
              position: {
                lng: +data.longitude,
                lat: +data.latitude,
              },
            };
          });
          // console.log(this.bmMarkers, 'bmMarkers')
          return true;
        }
      });
    },
    _getTerminalCount() {
      getTerminalCount().then((res) => {
        if (res.code === "200") {
          this.items = this.items.map((item) => {
            return {
              ...item,
              value: res.data[item.id] || 0,
            };
          });
        }
      });
    },
    handleToDetail(row) {
      // routePush({
      //   title: '灯杆详情',
      //   name: 'lightPoleDetail',
      //   parames: {
      //     imei: row.imei
      //   }
      // });
      const parames = {
        imei: row.imei,
      };
      store.commit("set_common", {
        lightPoleDetail: parames,
      });
      const detailURL = this.$router.resolve({
        path: `/lightPole/lightPoleDetail`,
        query: {
          imei: row.imei,
        },
      });
      console.log(detailURL);
      window.open(detailURL.href, "_blank");
    },
    dialogCancel() {
      this.dialog.show = false;
    },
  },
  beforeDestroy() {
    this.updateTime && clearInterval(this.updateTime);
    this.updateTime = null;
  },
};
</script>

<style lang="less" scoped>
#lightPoleMap {
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
    height: calc(100% - 115px);
    position: relative;
    visibility: hidden;
    &.readyMap {
      visibility: visible;
    }
  }
}
</style>
