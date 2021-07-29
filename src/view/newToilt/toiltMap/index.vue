/* eslint-disable camelcase */
<template>
  <div id="toiltMap">
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <div class="toiltMap-header">智能厕所云平台</div>
    <div class="toilMap-body">
      <div class="body-left">
        <div class="left-title">
          <span>设施详情</span>
        </div>
        <div class="table-wrap">
          <vue-seamless-scroll
            :class-option="defaultOption"
            :data="leftTableData"
          >
            <info-table
              v-for="(item, index) in leftTableData"
              :key="index + item.parkId"
              :parkName="item.parkName"
              :totalNum="item.toiletCount"
              :tableData="item.toiletInfo"
              @showInfo="mapZoom"
            ></info-table>
          </vue-seamless-scroll>
        </div>
      </div>
      <div class="body-right">
        <baidu-map
          ref="map"
          class="bm-view"
          ak="IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          @ready="handler"
          @zoomend="onZoomend"
          :class="baiduMapShow && 'readyMap'"
        >
          <div class="treeSelectBox">
            <AddressSelect @mapZoom="mapZoom" />
          </div>
          <div class="detailBox">
            <detailBox :detailData="detailData" />
          </div>
          <div class="tipIcon">
            <div class="smooth">
              <img src="./images/icon-smooth.png" alt="" srcset="" />
              <span>流畅</span>
            </div>
            <div class="crowd">
              <img src="./images/icon-crowded.png" alt="" srcset="" />
              <span>拥挤</span>
            </div>
          </div>
          <my-overlay
            v-for="(item, index) in markerData"
            :key="index + item.regionId"
            :position="{
              lng: Number(item.regionId.split('-')[0]),
              lat: Number(item.regionId.split('-')[1]),
            }"
            :status="item.status"
            :active="currentMarkIndex == item.regionId"
            :allInfo="item"
            :index="index"
            @getDetail="_newDevDataList"
          >
          </my-overlay>
        </baidu-map>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import {
  BmlCurveLine,
  // BmGeolocation,
  BmInfoWindow,
  BmMarker,
} from "vue-baidu-map-v3/components";
import bMap from "vue-baidu-map-v3/components/map/Map.vue";
import MyOverlay from "./components/MyOverlay";
import vueSeamlessScroll from "vue-seamless-scroll";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "@/components/searchForm/searchForm";
import radioType from "@/components/radioType";
import lightTable from "./components/table";
import Effect from "./components/effect";
import InfoTable from "./components/infoTable/table";
import AddressSelect from "./components/select.vue";
import detailBox from "./components/detail";
// import PublishInformation from "./components/information";
import { getInfo, getTerminalCount } from "api/lightPoleMap";
// 公厕
import {
  getNewToiletList,
  newDevDataList,
  queryNewAllToiletList,
} from "api/toilt";
import { routePush } from "@/util/util";
import { COMMON_TEMPLATE_SERVICE_TYPE, MARKERS_TYPE } from "@/util/constants";
import icon1 from "./images/map-icon.png";
import { setTimeout } from "timers";
import themeJson from "../js/custom_map_config.json";
import Index from "../../../components/electricLine/index.vue";
/** 1:灯带、2：灯杆 */
/**
 * 充电桩使用状态：batteryInUse   1:停用；2：闲置；3：使用中
 * 充电桩设备状态：batteryStatus 1:在线，2：故障
 */

/** 灯杆状态 */
const lightTypes = MARKERS_TYPE["LED"];

// 局部引入百度地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
  name: "publishPoleMap",
  data() {
    return {
      currentMarkIndex: 0,
      markerData: [],
      detailData: {},
      leftTableData: [],
      active: false,
      toiltCode: "",
      center: {
        lng: 0,
        lat: 0,
      },
      updateTime: undefined,
      zoom: 12,
      polylinePath: [],
      bmMarkers: [],
      bmMarkersData: [
        {
          isShowInfo: false,
          latitude: "22.719641",
          longitude: "113.15292",
          onlineStatus: 1,
          position: {
            lat: 22.719641,
            lng: 113.15292,
          },
          powerStatus: 0,
          serialNumber: "40000814",
          size: {
            height: 32,
            width: 32,
          },
          terminalName: "公园公厕",
          toiletName: "WS02120",
          toiletPeople: 420,
          allToiletNum: 7,
          url: icon1,
          zIndex: 2,
          men: {
            all: 3,
            temperature: "28℃", //温度
            humidity: "55%", // 湿度
            ammonia: "48PPM", //氨气
            PM: 63, //PM2.5
            exhaust: "开", //排风扇
            num: 5, //打扫次数
            worker: "江福",
          },
          women: {
            all: 4,
            temperature: "29℃", //温度
            humidity: "66%", // 湿度
            ammonia: "49PPM", //氨气
            PM: 60, //PM2.5
            exhaust: "开", //排风扇
            num: 4, //打扫次数
            worker: "林红",
          },
        },
      ],
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
      effextArray: [],
      maleUsed: [], //男厕所蹲坑人
      feMaleUsed: [], //女厕所蹲坑人
      allPitNum: 0, //男厕女厕总坑位
      curToiletStatus: 1, //1:流畅，2：拥堵
      // isShowInfo: false
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//api.map.baidu.com/api?v=3.0&ak=IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU";
      document.head.appendChild(script);
      this._queryNewAllToiletList();
      setTimeout(() => {
        if (!this.baiduMapShow) {
          // this.$refs.map.reset && this.$refs.map.reset();
        }
      }, 30000);
    });
  },
  components: {
    BaiduMap,
    bMap,
    MyOverlay,
    vueSeamlessScroll,
    detailBox,
    AddressSelect,
    InfoTable,

    headerTitle,
    searchForm,
    lightTable,
    radioType,
    // BmGeolocation,
    BmMarker,
    BmInfoWindow,
    Effect,
    Index,
    // PublishInformation
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    toiletStatus: function () {
      const usedNum = this.maleUsed.length + this.feMaleUsed.length;
      const allNum = this.allPitNum;
      if (usedNum / allNum >= 0.8) {
        this.curToiletStatus = 2;
        return "拥堵";
      } else {
        this.curToiletStatus = 1;
        return "流畅";
      }
    },
    defaultOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  methods: {
    // 点击公厕 地图放大, 获取公厕详情
    mapZoom(node) {
      console.log("mapZoom", node);
      this.currentMarkIndex = node.regionId;
      this.toiletId = node.id;
      this.$set(this.detailData, "name", node.label);
      this.$set(this.detailData, "id", node.id);
      let point = node.regionId.split("-");
      this.$set(this.center, "lng", Number(point[0]));
      this.$set(this.center, "lat", Number(point[1]));
      this.zoom = 18;
      this._newDevDataList(node.id);
    },
    // 左边总览请求
    _queryNewAllToiletList() {
      queryNewAllToiletList({}).then((res) => {
        if (res.code == "200") {
          this.leftTableData = [...res.data];
          // 默认初始化第一个表格覆盖物
          if (res.data.length) {
            res.data.map((item) => {
              this.markerData = [...this.markerData, ...item.toiletInfo];
              let point = this.markerData[0].regionId.split("-");
              this.center.lng = Number(point[0]);
              this.center.lat = Number(point[1]);
              this.mapZoom({
                id: this.markerData[0].toiletId,
                label: this.markerData[0].toiletName,
                ...this.markerData[0],
              });
            });
          }
        }
      });
    },
    // 绘制覆盖物
    draw({ el, BMap, map }, regionId) {
      const point = regionId.split("-");
      const pixel = map.pointToOverlayPixel(new BMap.Point(point[0], point[1]));
      el.style.left = pixel.x - 36 + "px";
      el.style.top = pixel.y - 63 + "px";
      // el.style.left = pixel.x - 60 + "px";
      // el.style.top = pixel.y - 20 + "px";
    },
    handler({ BMap, map }) {
      setTimeout(async () => {
        map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
        });
        // if (this.markerData.length) {
        //   let point = this.markerData[0].regionId.split("-");
        //   this.center.lng = Number(point[0]);
        //   this.center.lat = Number(point[1]);
        //   this.mapZoom({
        //     id: this.markerData[0].toiletId,
        //     label: this.markerData[0].toiletName,
        //     ...this.markerData[0],
        //   });
        // } else {
        //   this.center.lng = 113.23333;
        //   this.center.lat = 23.16667;
        // }
        // this.zoom = 15;
        this.baiduMapShow = true;
      }, 550);
    },
    cyclingInit() {
      if (this.openPage === "publishPoleMap") {
        // this._getTerminalCount();
      } else {
        this.updateTime = null;
        clearInterval(this.updateTime);
      }
    },
    onSearch(form) {},
    onCureent(item) {
      this.tableActiveId = item.imei;
      this.ledDeviceName = item.ledDeviceName;
      // this.activeGetInfo(item);
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
      // this.activeGetInfo(target);
    },
    infoWindowClose(item) {
      item.isShowInfo = false;
    },
    infoWindowOpen(item) {
      item.isShowInfo = true;
    },
    toToiletDetail() {
      this.$router.push({
        name: "newToiltDetail",
        query: {
          code: this.toiltCode,
        },
        params: {
          code: this.toiltCode
        }
      });
    },
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    // 公厕列表
    _getNewToiletList() {
      let data = {
        limit: "10",
        skip: "0",
        regionId: "22222",
      };
      getNewToiletList(data).then((res) => {
        console.log(res, "+++--00888");
        if (res.code == "200") {
          this.toiltCode = res.data[0].toiletId;
          setTimeout(() => {
            this._newDevDataList();
          }, 500);
        }
      });
    },
    // 公厕下的设备详情
    _newDevDataList(id) {
      let data = {
        toiletId: id,
      };
      newDevDataList(data).then((res) => {
        if (res.code == "200") {
          let { male, female } = res.data;
          this.$set(this.detailData, "male", male);
          this.$set(this.detailData, "female", female);
          // this.$set(this.bmMarkersData[0], "female", female);
          // this.$set(this.bmMarkersData[0], "male", male);
          // this.maleUsed = male.pit.filter((e) => e.state == 1);
          // this.feMaleUsed = female.pit.filter((v) => v.state == 1);
          // this.allPitNum = female.pit.length + male.pit.length;
        }
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
/deep/.BMap_shadow {
  display: none;
}
/deep/.BMap_pop {
  div:nth-child(odd) {
    div {
      background: #0d182d !important;
    }
  }
  div:nth-child(8) {
    display: none;
  }
  .BMap_top {
    background: #0d182d;
  }
  .BMap_center {
    background: #0d182d;
  }
  .BMap_bottom {
    background: #0d182d;
  }
}
/* 去掉百度地图左下角logo */
/deep/.BMap_cpyCtrl {
  display: none;
}
/deep/.anchorBL {
  display: none;
}

#toiltMap {
  width: 100%;
  height: 100vh;
  background-image: url(../images/mapBg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .toiltMap-header {
    height: 97px;
    background-image: url(../images/header_new.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .toilMap-body {
    display: flex;
    width: 100%;
    height: calc(100% - 97px);
    margin-top: 18px;
    padding: 0 30px;
    .body-left {
      flex: 1;
      min-width: 500px;
      margin-right: 26px;
      z-index: 1000;
      .left-title {
        width: 100%;
        // height: 62px;
        padding: 12px 0 12px 0;
        background-image: url(../images/deviceTitle.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        span {
          font-size: 26px;
          font-family: YouSheBiaoTiHei;
          text-align: left;
          color: #ffffff;
          letter-spacing: 1px;
          text-shadow: 0px 2px 4px 0px #1c4696;
          margin-left: 41px;
        }
      }
      .table-wrap {
        height: calc(100% - 65px);
        overflow: hidden;
      }
    }
    .body-right {
      flex: 3;
      .treeSelectBox {
        z-index: 1000;
        position: absolute;
        top: 21px;
        left: 0;
        width: 410px;
        height: 48px;
        background-image: url(./images/selectBorder.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .detailBox {
        position: absolute;
        right: 26px;
        top: 23px;
        z-index: 1000;
      }
      .tipIcon {
        z-index: 1000;
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0 0 20px 20px;
        .smooth {
          margin-right: 20px;
        }
        .smooth,
        .crowd {
          img {
            width: 30px;
            height: 30px;
            vertical-align: bottom;
          }
          span {
            font-size: 20px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #61b1e1;
            margin-right: 10px;
          }
        }
      }
    }
  }
  /* 树形选择 start */
  /deep/.vue-treeselect {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #85c5ff;
  }
  /deep/.vue-treeselect__control {
    background: transparent;
    border: unset;
    border-radius: 0;
    .vue-treeselect__control-arrow-container {
      width: 50px;
    }
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      left: 84px;
    }
    .vue-treeselect__placeholder {
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #85c5ff;
      font-size: 16px;
      line-height: 30px;
    }
    .vue-treeselect__input {
      padding-left: 84px;
      color: #ffffff !important;
    }
  }
  /deep/.vue-treeselect:not(.vue-treeselect--disabled)
    .vue-treeselect__control-arrow-container:hover
    .vue-treeselect__control-arrow {
    color: transparent;
  }
  /deep/.vue-treeselect__control-arrow {
    color: transparent;
  }
  /deep/.vue-treeselect--open-below .vue-treeselect__menu {
    margin-top: 26px;
  }
  /deep/.vue-treeselect__menu {
    border: unset;
    margin-left: 60px;
    background: linear-gradient(180deg, rgba(0, 82, 141, 0.15), #003461);
    border: 1px solid;
    border-image: linear-gradient(180deg, #04a8f3, rgba(85, 182, 255, 0.34)) 1 1;
  }
  /deep/.vue-treeselect__label-container {
    height: 32px;
  }
  /deep/.vue-treeselect__tip {
    color: #ffffff;
  }
  /deep/.vue-treeselect__list {
    .vue-treeselect__option {
      height: 32px;
      width: 346px;
    }
    .vue-treeselect__list-item {
      // height: 32px;
      .vue-treeselect__label {
        color: #ffffff;
        font-size: 16px;
      }
      .vue-treeselect__option--highlight {
        background: rgba(29, 69, 129, 0.7);
        height: 100%;
      }
    }
    .vue-treeselect__option-arrow {
      color: #ffffff;
    }
    .vue-treeselect__list-item.vue-treeselect__indent-level-1 {
      height: 32px;
    }
    // .vue-treeselect__list-item.vue-treeselect__indent-level-0 {
    //   height: 32px;
    // }
  }
  /deep/.vue-treeselect__single-value {
    color: #ffffff;
  }
  /deep/.vue-treeselect--single .vue-treeselect__option--selected {
    background: rgba(29, 69, 129, 0.7);
    font-weight: 400;
  }
  /deep/.vue-treeselect--single .vue-treeselect__input {
    width: 80%;
  }
  /* 树形选择 end */

  .bm-view {
    width: 100%;
    height: calc(100% - 54px);
    // height: 800px;
    position: relative;
    visibility: hidden;
    &.readyMap {
      visibility: visible;
    }
    /* .BMap_pop {
      div {
        background: #0d182d !important;
      }
    } */
  }
  .infoWindow {
    background: #0d182d;
    .infoText {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .infoName {
        font-size: 18px;
        font-family: Arial;
        font-weight: 400;
        color: #5cf4f5;
      }
      .infoStatus {
        font-size: 14px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #0ad687;
      }
      .crowdActive {
        color: #fe3a20;
      }
      .toToiletDetail {
        font-size: 14px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: #e4fdff;
        cursor: pointer;
      }
    }
    .infoPeople {
      font-size: 14px;
      font-family: Adobe Heiti Std;
      font-weight: normal;
      color: #e4fdff;
    }
    .mapInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mapInfoItem {
        p {
          font-size: 14px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          color: #e4fdff;
          .infoIcon {
            display: inline-block;
            width: 16px;
            height: 16px;
            img {
              max-width: 100%;
            }
          }
        }
      }
    }
  }
}
.sample {
  width: 73px;
  height: 127px;
  position: absolute;
  img {
    width: 100%;
    height: 100%;
  }
}
// .sample.active {
//   background: rgba(0, 0, 0, 0.75);
//   color: #fff;
// }
</style>
