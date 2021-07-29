/* eslint-disable camelcase */
<template>
  <div id="chargingPileMap">
    <mapTitle name="设备实时概况" />
    <lightInfo :items="items" />
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <baidu-map
      ref="map"
      ak="IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="baiduMapShow && 'readyMap'"
    >
      <lightLabers
        :light="light"
        :bad="badlight"
        :close="closelight"
        :lightText="'充电中'"
        :badText="'离线'"
        :closeText="'空闲中'"
        :styles="'width:0.226rem; height: 0.28rem'"
      />
      <lightTable
        :tableData="tableData"
        :title="tableTitle"
        :activeId="tableActiveId"
        @onSearch="onSearch"
        @onCureent="onCureent"
        :type="tableType"
      />
      <bm-marker
        v-for="(item, index) in bmMarkers"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :dragging="false"
        :icon="{ url: item.url, size: item.size }"
        :zIndex="item.zIndex"
        @click="onClickMarker(item)"
        :title="item.imei"
      >
      </bm-marker>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
      <bml-curve-line
        :points="polylinePath"
        stroke-color="#112CE2"
        :stroke-opacity="1"
        :stroke-weight="5"
        @lineupdate="updatePolylinePath"
        v-if="false"
      ></bml-curve-line>
    </baidu-map>
  </div>
</template>
<script>
import {
  BmlCurveLine,
  BmGeolocation,
  BmMarker,
} from "vue-baidu-map-v3/components";
import BaiduMap from "vue-baidu-map-v3/components/map/Map.vue";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "@/components/searchForm/searchForm";
import mapTitle from "@/components/mapTitle";
import lightTable from "view/index/lightPoleMap/components/table";
import lightLabers from "view/index/lightPoleMap/components/labers";
import lightInfo from "view/index/lightPoleMap/components/info";
import { routePush } from "@/util/util";
import light from "./images/img6.png";
import badlight from "./images/img7.png";
import closelight from "./images/img8.png";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import img3 from "./images/img3.png";
import img4 from "./images/img4.png";
import img5 from "./images/img5.png";
import img13 from "./images/img13.gif";
import img14 from "./images/img14.gif";
import img15 from "./images/img15.gif";
import {
  getBatteryCount,
  queryBattery,
  getBatteryInfo,
  getRoad,
} from "api/lightPoleMap";
import mapStyleJson from "../baiduMapStyle";
/** 灯杆状态 */
const lightTypes = {
  1: {
    normal: light,
    current: img13,
  },
  2: {
    normal: badlight,
    current: img14,
  },
  3: {
    normal: closelight,
    current: img15,
  },
};
export default {
  name: "chargingPileMap",
  data() {
    return {
      light,
      badlight,
      closelight,
      center: "广东",
      updateTime: undefined,
      items: [
        {
          id: "batteryNo",
          src: img1,
          class: "blue",
          name: "充电桩总数",
          unit: "个",
          value: "",
          click: () => this.goMonitor({}),
        },
        {
          id: "chargeRate",
          src: img2,
          class: "pink",
          name: "充电率",
          // unit: '%',
          value: "",
          click: () => this.goMonitor({}),
        },
        {
          id: "freeBattery",
          src: img3,
          class: "green",
          name: "空闲电枪 ",
          unit: "个",
          value: "",
          click: () => this.goMonitor({ inUse: "2" }),
        },
        {
          id: "usingRate",
          src: img4,
          class: "orang",
          name: "使用率",
          // unit: '%',
          value: "",
          click: () => this.goMonitor({}),
        },
        {
          id: "disconnectRate",
          src: img5,
          class: "purple",
          name: "离线率",
          // unit: '%',
          value: "",
          click: () => this.goMonitor({}),
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
      baiduMapShow: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // var script = document.createElement("script");
      // script.type = "text/javascript";
      // script.src =
      //   "//api.map.baidu.com/api?v=3.0&ak=IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU";
      setTimeout(() => {
        if (!this.baiduMapShow) {
          // this.$refs.map.reset && this.$refs.map.reset();
        }
      }, 30000);
    });
  },
  components: {
    BaiduMap,
    headerTitle,
    searchForm,
    lightTable,
    lightLabers,
    lightInfo,
    mapTitle,
    BmGeolocation,
    BmMarker,
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      setTimeout(() => {
        map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
        });
        this.baiduMapShow = true;
        this._getBatteryInfo();
        this._getBatteryCount();
        // if (this.$store.state.updateTime.username) {
        //   this.updateTime = setInterval(this._getBatteryCount, this.$store.state.updateTime.username * 1000);
        // }
        this._getRoad(1);
      }, 550);
      // console.log(BMap, map);
    },
    onSearch(form) {
      const parames = {
        ...form,
      };
      this.tableActiveId = null;
      if (form.address !== "") {
        this._queryBattery(parames);
      } else {
        this._getRoad();
      }
    },
    _queryBattery(parames) {
      queryBattery(parames).then((res) => {
        if (res.code === "200") {
          this.tableTitle = "总耗电TOP10充电桩";
          this.tableType = 2;
          this.zoom = 14;
          this.tableData = res.data;
          const centerData =
            this.tableData[parseInt(this.tableData.length / 2, 10)];
          this.center = {
            lng: centerData.longitude,
            lat: centerData.latitude,
          };
        }
      });
    },
    onCureent(item) {
      this.tableActiveId = item.imei;
      const parames = {
        address: item.address,
      };
      if (this.tableType === 1) {
        this.onSearch(parames);
      } else {
        this.zoomTarget(item);
      }
    },
    zoomTarget(item) {
      const bmMarkers = this.bmMarkers.map((marker) => {
        if (marker.imei === item.imei) {
          this.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat,
          };
          setTimeout(() => {
            this.$router.push({
              name: "chargeBaseInfo",
              query: {
                serialNumber: marker.serialNumber,
              },
            });
          }, 3000);
          return {
            ...marker,
            url: lightTypes[marker.status].current,
            size: { width: 45, height: 70 },
          };
        }
        return {
          ...marker,
          url: lightTypes[marker.status].normal,
          size: { width: 17, height: 32 },
        };
      });
      this.bmMarkers = bmMarkers;
    },
    onClickMarker(target) {
      this.tableActiveId = target.imei;
      this.zoomTarget(target);
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    _getRoad(type) {
      getRoad().then((res) => {
        if (res.code === "200") {
          this.tableTitle = "总耗电TOP10道路";
          this.tableType = 1;
          this.zoom = 8;
          this.tableData = res.data;
          this.zoomTarget({ imei: -1 });
          if (type) {
            this.onCureent(res.data[0]);
          }
        }
      });
    },
    _getBatteryInfo() {
      getBatteryInfo().then((res) => {
        if (res.code === "200") {
          this.bmMarkers = res.data.map((data) => {
            let status = data.batteryInUse === 2 ? 3 : 1;
            if (data.batteryStatus === 2) {
              status = 2;
            }
            return {
              ...data,
              size: { width: 17, height: 32 },
              status,
              url: lightTypes[status].normal,
              zIndex: data.batteryPosition,
              position: {
                lng: data.longitude,
                lat: data.latitude,
              },
            };
          });
          // console.log(this.bmMarkers);
        }
      });
    },
    _getBatteryCount() {
      getBatteryCount().then((res) => {
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
    goMonitor(row) {
      routePush({
        name: "chargePileMonitor",
        parames: row,
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.updateTime);
    this.updateTime = null;
  },
};
</script>

<style lang="less" scoped>
#chargingPileMap {
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
