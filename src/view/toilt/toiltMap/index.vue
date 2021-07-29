/* eslint-disable camelcase */
<template>
  <div id="publishPoleMap">
    <!-- <div id="allmap"></div> -->
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <div class="toiltMap-head">
      智能厕所云平台
    </div>
    <baidu-map
      ref="map"
      class="bm-view"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      :class="baiduMapShow && 'readyMap'"
    >
      <!--       <PublishInformation
        @close="infoShow = false"
        @detail="item => handleToDetail(item)"
        :show="infoShow"
        :info="info"
        :effextArray="effextArray"
      /> -->
      <lightTable
        :tableData="tableData"
        :title="'设施详情'"
        :activeId="tableActiveId"
        @onSearch="onSearch"
        @onCureent="onCureent"
        :type="tableType"
        :ledDeviceName="ledDeviceName"
        :imei="tableActiveId"
        :curToiletStatus="curToiletStatus"
      />
      <bm-marker
        v-for="(item, index) in bmMarkersData"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :icon="{ url: item.url, size: item.size }"
        :zIndex="item.zIndex"
        :dragging="false"
        @click="infoWindowOpen(item)"
        :top="item.zIndex === 2 ? true : false"
        :title="item.terminalName"
      >
        <bm-info-window
          style="background: #0d182d;"
          :show="item.isShowInfo"
          :maximize="true"
          @close="infoWindowClose(item)"
          @open="infoWindowOpen(item)"
        >
          <div class="infoWindow" v-if="item.female && item.male">
            <p class="infoText">
              <span class="infoName">{{ item.terminalName }}</span>
              <span
                class="infoStatus"
                :class="curToiletStatus == 2 ? 'crowdActive' : ''"
                >[{{ toiletStatus }}]</span
              >
              <span class="toToiletDetail" @click="toToiletDetail">详情>></span>
            </p>
            <p class="infoPeople">
              今日累计人数：{{ item.female.flowIn + item.male.flowIn }}
            </p>
            <div class="mapInfo">
              <div class="mapInfoItem">
                <p>
                  <i class="infoIcon">
                    <img src="../images/icon_4@2x.png" alt="" />
                  </i>
                  <span>男</span>
                  <span
                    >[{{ maleUsed.length }}/{{ item.male.pit.length }}]</span
                  >
                </p>
                <p>温度：{{ item.male.temperature }}℃</p>
                <p>湿度：{{ item.male.humidity }}%</p>
                <p>氨气：{{ item.male.nh3 }}PPM</p>
                <p>硫化氢：{{ item.male.h2s }}PPM</p>
                <p>排风扇：{{ item.men.exhaust }}</p>
                <p>打扫次数：{{ item.men.num }}</p>
                <p>保洁人员：{{ item.men.worker }}</p>
              </div>
              <div class="mapInfoItem">
                <div>
                  <p>
                    <i class="infoIcon">
                      <img src="../images/icon_6@2x.png" alt="" />
                    </i>
                    <span>女</span>
                    <span
                      >[{{ feMaleUsed.length }}/{{
                        item.female.pit.length
                      }}]</span
                    >
                  </p>
                  <p>温度：{{ item.female.temperature }}℃</p>
                  <p>湿度：{{ item.female.humidity }}%</p>
                  <p>氨气：{{ item.female.nh3 }}PPM</p>
                  <p>硫化氢：{{ item.female.h2s }}PPM</p>
                  <p>排风扇：{{ item.women.exhaust }}</p>
                  <p>打扫次数：{{ item.women.num }}</p>
                  <p>保洁人员：{{ item.women.worker }}</p>
                </div>
              </div>
            </div>
          </div>
        </bm-info-window>
      </bm-marker>
      <!-- <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_LEFT"
        :showAddressBar="true"
        :autoLocation="true"
        v-if="baiduMapShow"
      ></bm-geolocation> -->
    </baidu-map>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import {
  BmlCurveLine,
  // BmGeolocation,
  BmInfoWindow,
  BmMarker
} from "vue-baidu-map-v3/components";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "@/components/searchForm/searchForm";
import radioType from "@/components/radioType";
import lightTable from "./components/table";
import Effect from "./components/effect";
// import PublishInformation from "./components/information";
import { getInfo, getTerminalCount } from "api/lightPoleMap";
// 公厕
import { getToiletList, getDevDataList } from "api/toilt";
import { routePush } from "@/util/util";
import { COMMON_TEMPLATE_SERVICE_TYPE, MARKERS_TYPE } from "@/util/constants";
import icon1 from "./images/map-icon.png";
import { setTimeout } from "timers";
/** 1:灯带、2：灯杆 */
/**
 * 充电桩使用状态：batteryInUse   1:停用；2：闲置；3：使用中
 * 充电桩设备状态：batteryStatus 1:在线，2：故障
 */

/** 灯杆状态 */
const lightTypes = MARKERS_TYPE["LED"];
export default {
  name: "publishPoleMap",
  data() {
    return {
      toiltCode: "",
      center: {
        lng: 113.13255,
        lat: 23.014903
      },
      updateTime: undefined,
      zoom: 16,
      polylinePath: [],
      bmMarkers: [],
      bmMarkersData: [
        {
          isShowInfo: false,
          latitude: "23.014903",
          longitude: "113.13255",
          onlineStatus: 1,
          position: {
            lat: 23.014903,
            lng: 113.13255
          },
          powerStatus: 0,
          serialNumber: "40000814",
          size: {
            height: 32,
            width: 32
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
            num: 3, //打扫次数
            worker: "张峰"
          },
          women: {
            all: 4,
            temperature: "29℃", //温度
            humidity: "66%", // 湿度
            ammonia: "49PPM", //氨气
            PM: 60, //PM2.5
            exhaust: "开", //排风扇
            num: 3, //打扫次数
            worker: "陈燕"
          }
        }
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
        powerText: undefined
      },
      baiduMapShow: false,
      editData: {},
      effextArray: [],
      maleUsed: [], //男厕所蹲坑人
      feMaleUsed: [], //女厕所蹲坑人
      allPitNum: 0, //男厕女厕总坑位
      curToiletStatus: 1 //1:流畅，2：拥堵
      // isShowInfo: false
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
      setTimeout(() => {
        if (!this.baiduMapShow) {
          // this.$refs.map.reset && this.$refs.map.reset();
        }
      }, 30000);
    });
  },
  components: {
    headerTitle,
    searchForm,
    lightTable,
    radioType,
    // BmGeolocation,
    BmMarker,
    BmInfoWindow,
    Effect
    // PublishInformation
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    toiletStatus: function() {
      const usedNum = this.maleUsed.length + this.feMaleUsed.length;
      const allNum = this.allPitNum;
      if (usedNum / allNum >= 0.8) {
        this.curToiletStatus = 2;
        return "拥堵";
      } else {
        this.curToiletStatus = 1;
        return "流畅";
      }
    }
  },
  methods: {
    handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      let points = this.bmMarkersData[0].position;
      setTimeout(async () => {
        /* map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf"
        }); */
        // this._getTerminalCount();
        /* if (this.$store.state.updateTime.ledTime) {
          this.updateTime = setInterval(
            this.cyclingInit,
            this.$store.state.updateTime.ledTime * 1000
          );
        } */
        await this._getToiletList();
        map.setCenter(points);
        this.baiduMapShow = true;
        // this.editData = this.common["publishPoleMap"];
      }, 1000);
    },
    cyclingInit() {
      if (this.openPage === "publishPoleMap") {
        // this._getTerminalCount();
      } else {
        this.updateTime && clearInterval(this.updateTime);
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
      const bmMarkers = this.bmMarkers.map(marker => {
        if (marker.imei === item.imei) {
          this.center = {
            lng: +marker.position.lng,
            lat: +marker.position.lat
          };
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
        name: "toiltDetail",
        query: {
          code: this.toiltCode
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
    _getToiletList() {
      let data = {
        limit: "10",
        skip: "0"
      };
      getToiletList(data).then(res => {
        if (res.code == "200") {
          this.toiltCode = res.data[0].toiletId;
          setTimeout(() => {
            this._getDevDataList();
          }, 500);
        }
      });
    },
    // 公厕下的设备详情
    _getDevDataList() {
      let data = {
        toiletId: this.toiltCode
      };
      getDevDataList(data).then(res => {
        if (res.code == "200") {
          let { male, female } = res.data;
          this.$set(this.bmMarkersData[0], "female", female);
          this.$set(this.bmMarkersData[0], "male", male);
          this.maleUsed = male.pit.filter(e => e.state == 1);
          this.feMaleUsed = female.pit.filter(v => v.state == 1);
          this.allPitNum = female.pit.length + male.pit.length;
        }
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.updateTime);
    this.updateTime = null;
  }
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
#publishPoleMap {
  width: 100%;
  height: 100%;
  .toiltMap-head {
    height: 54px;
    background: linear-gradient(90deg, #285a81 0%, #11244f 100%);
    // opacity: 0.9;
    font-size: 28px;
    font-family: AliHYAiHei-Beta;
    font-weight: 400;
    color: #1ef5fb;
    padding: 0 20px;
    line-height: 54px;
  }
  /* .sample {
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
  } */
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
</style>
