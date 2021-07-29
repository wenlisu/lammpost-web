/* eslint-disable camelcase */
<template>
  <div id="publishPoleMap">
    <mapTitle name="设备实时概况" />
    <lightInfo :items="items" />
    <div id="allmap"></div>
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <baidu-map
      ak="IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU"
      ref="map"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="baiduMapShow && 'readyMap'"
    >
      <PublishInformation
        @close="infoShow = false"
        @detail="(item) => handleToDetail(item)"
        :show="infoShow"
        :info="info"
        :effextArray="effextArray"
      />
      <lightLabers :light="led1" :bad="led2" :close="led3" />
      <lightTable
        :tableData="tableData"
        :title="'LED设备列表'"
        :activeId="tableActiveId"
        @onSearch="onSearch"
        @onCureent="onCureent"
        :type="tableType"
        :ledDeviceName="ledDeviceName"
        :imei="tableActiveId"
      />
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
import BaiduMap from "vue-baidu-map-v3/components/map/Map.vue";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "@/components/searchForm/searchForm";
import radioType from "@/components/radioType";
import mapTitle from "@/components/mapTitle";
import lightTable from "./components/table";
import lightLabers from "./components/labers";
import lightInfo from "./components/info";
import Effect from "./components/effect";
import PublishInformation from "./components/information";
import img7 from "./images/img7.png";
import img8 from "./images/img8.png";
import img9 from "./images/img9.png";
import img10 from "./images/img10.png";
import led1 from "@/common/images/markers/led1.png";
import led2 from "@/common/images/markers/led2.png";
import led3 from "@/common/images/markers/led3.png";
import {
  getInfo,
  getTerminalCount,
  getRoad,
  queryTerminal,
  getBriefInfo,
} from "api/lightPoleMap";
import {
  getLedMap,
  selectRunningLedProgram,
  getLedDeviceCount,
} from "api/screen";
import { routePush } from "@/util/util";
import { COMMON_TEMPLATE_SERVICE_TYPE, MARKERS_TYPE } from "@/util/constants";
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
const lightTypes = MARKERS_TYPE["LED"];

export default {
  name: "publishPoleMap",
  data() {
    return {
      led1,
      led2,
      led3,
      batteryType,
      center: "广东",
      updateTime: undefined,
      items: [
        {
          id: "ledDeviceCount",
          // src: img7,
          icon: "iconfont icon-zongshu",
          class: "blue",
          name: "LED屏总数",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "ledOnlineCount",
          // src: img8,
          icon: "iconfont icon-zaixianshu",
          class: "green",
          name: "在线数",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "ledFaultCount",
          // src: img9,
          icon: "iconfont icon-lixianshu",
          class: "gray",
          name: "离线数 ",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "ledDevicePlayCount",
          // src: img10,
          icon: "iconfont icon-bofangcishu1",
          class: "pink",
          name: "日均播放次数",
          unit: "次",
          value: "",
          click: () => {
            routePush({
              name: "wisdomPublishAnalyse",
              parames: {},
            });
          },
        },
        {
          id: "ledDevicePlayTime",
          // src: img10,
          icon: "iconfont icon-bofangshichang",
          class: "purple",
          name: "日均播放时长",
          unit: "小时",
          value: "",
          click: () => {
            routePush({
              name: "wisdomPublishAnalyse",
              parames: {},
            });
          },
        },
        {
          id: "ledProragmCount",
          // src: img10,
          icon: "iconfont icon-renwu",
          class: "orang",
          name: "播放任务数",
          unit: "个",
          value: "",
          click: () => {
            routePush({
              name: "wisdomPublishTaskPage",
              parames: {},
            });
          },
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
      ledDeviceName: "",
      show: false,
      info: {
        ledDeviceName: undefined,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        imei: undefined,
        power: undefined,
        ledRects: [],
        powerText: undefined,
      },
      baiduMapShow: false,
      editData: {},
      collapseActiveNames: ["1"],
      effextArray: [],
    };
  },
  created() {
    // if (JSON.stringify(this.$route.params) !== '{}') {
    //   this.onCureent(this.$route.params);
    // }
    // console.log(this.$route.params);
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
    radioType,
    mapTitle,
    BmGeolocation,
    BmMarker,
    Effect,
    PublishInformation,
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
        this._getTerminalCount();
        if (this.$store.state.updateTime.ledTime) {
          this.updateTime = setInterval(
            this.cyclingInit,
            this.$store.state.updateTime.ledTime * 1000
          );
        }
        const infoStatus = await this._getInfo();
        this.baiduMapShow = true;
        this.editData = this.common["publishPoleMap"];
      }, 550);
    },
    cyclingInit() {
      if (this.openPage === "publishPoleMap") {
        this._getTerminalCount();
      } else {
        this.updateTime && clearInterval(this.updateTime);
      }
    },
    onSearch(form) {
      if (form.imei && form.ledDeviceName) {
        this.tableActiveId = form.imei;
        const findActiveBrief = this.tableData.find(
          (table) => table.imei === this.tableActiveId
        );
        if (findActiveBrief) {
          this.center = {
            lng: +findActiveBrief.longitude,
            lat: +findActiveBrief.latitude,
          };
          this.activeGetInfo({ ...form, ...findActiveBrief });
          return false;
        }
      } else {
        this.tableActiveId = "";
        this.ledDeviceName = "";
        this.initInfo();
        this.zoom = 14;
        const centerData =
          this.tableData[parseInt(this.tableData.length / 2, 10)];
        this.center = {
          lng: +centerData.longitude,
          lat: +centerData.latitude,
        };
      }
    },
    onCureent(item) {
      this.tableActiveId = item.imei;
      this.ledDeviceName = item.ledDeviceName;
      this.activeGetInfo(item);
    },
    activeGetInfo(item) {
      this._getBriefInfo(item);
      this.zoomTarget(item);
    },
    zoomTarget(item) {
      this.zoom = 14;
      const bmMarkers = this.bmMarkers.map((marker) => {
        if (marker.imei === item.imei) {
          this.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat,
          };
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
      this.tableActiveId = target.imei;
      this.ledDeviceName = target.ledDeviceName;
      this.activeGetInfo(target);
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    initInfo() {
      this.zoomTarget({ imei: -1 });
      this.infoShow = false;
      this.info = {
        ledDeviceName: undefined,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        imei: undefined,
        power: undefined,
        ledRects: [],
        powerText: undefined,
      };
    },
    _getBriefInfo(item) {
      selectRunningLedProgram(item.imei).then((res) => {
        if (res.code === "200") {
          this.info = {
            ...item,
            power: res.data.power,
            rectType: res.data && res.data.ledRects[0].rectType,
            ledRects: res.data && res.data.ledRects,
            powerText: res.data && res.data.powerText,
          };
          const effextArray =
            this.info.ledRects &&
            this.info.ledRects[0].ledMedias.map((medias) => {
              const { types } = this.$_useTypes(COMMON_TEMPLATE_SERVICE_TYPE);
              return {
                ...medias,
                Type: types[medias.mediaType],
                Src: medias.source,
              };
            });
          this.effextArray = effextArray;
          this.infoShow = true;
        }
      });
    },
    _getInfo() {
      return getLedMap().then((res) => {
        if (res.code === "200") {
          this.bmMarkers = res.data.map((data) => {
            const status = data.power;
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
          console.log(this.bmMarkers, "bm");
          this.tableData = this.bmMarkers;
          return true;
        }
      });
    },
    _getTerminalCount() {
      getLedDeviceCount().then((res) => {
        if (res.code === "200") {
          this.items = this.items.map((item) => {
            return {
              ...item,
              value: res.data[item.id],
            };
          });
        }
      });
    },
    handleToDetail(row) {
      routePush({
        title: "一键控屏",
        name: "fastScreen",
        parames: {
          ...row,
        },
        query: {
          activeNumber: row.serialNumber,
        },
      });
    },
  },
  beforeDestroy() {
    this.updateTime && clearInterval(this.updateTime);
    this.updateTime = null;
  },
};
</script>

<style lang="less" scoped>
#publishPoleMap {
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
