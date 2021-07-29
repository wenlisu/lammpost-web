<template>
  <div id="callRight" :class="{ componentView: true, show: show }">
    <div class="part_3">
      <ChartTitle partTitle="广播器应用场景分析"/>
      <RadioScenarios />
    </div>
    <div class="parat_4">
      <ChartTitle partTitle="广播器本年度播放情况分析"/>
      <RadioYear />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import ChartTitle from '../../components/chartTitle/index'
import RadioYear from '../../components/radio/year'
import RadioScenarios from '../../components/radio/scenarios'

// import './js/aframe.min.js';
import { Chart } from "highcharts-vue";
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(highcharts)
import store from "@/store";
import electricLine from "@/components/electricLine";
import DvBorderBox1 from "@/components/test";
import Map from "@/view/index/lightPoleMap/map";
import Information from "@/view/index/lightPoleMap/components/information";
import SuperviseInformation from "@/view/index/superviseMap/components/information";
import PublishInformation from "@/view/index/publishPoleMap/components/information";
import WarnInformation from "@/view/index/wisdomWarnMap/components/information";
import BroadcastInformation from "@/view/index/wisdomBroadcastMap/components/information";
import LightPoleMap from "@/view/index/lightPoleMap/index";
import SmokeDetectorMap from "@/view/smokeDetector/smokeDetectorMap";

import WisdomParkReport from "@/view/index/wisdomPark/report/index";

import SecurityMonitoring from "@/view/monitoring/securityMonitoring";
import SmokeAlarmLink from "@/view/smokeDetector/smokeManage/cameraEvent";
import LongRangControl from "@/view/adminLight/lightingControl/longRangControl";
import LightLabers from "@/view/index/lightPoleMap/components/labers";
import LedLabers from "@/view/index/publishPoleMap/components/labers";
import AmbientLabers from "@/view/index/superviseMap/components/labers";
import AudioLabers from "@/view/index/wisdomBroadcastMap/components/labers";
import CallLabers from "@/view/index/wisdomWarnMap/components/labers";
import videoAddress from "@/view/smokeDetector/smokeDetectorMap/components/videoAddress";
import Labers from "@/components/labers";
import pieBgImg from "common/images/bigscreen/img7.png";

import {
  screenBatteryByWeekAvg,
  screenDayLampByWeek,
  screenEnergyConsump,
  screenHourIndex,
  screenOneHourAvgPm,
  screenStatisticsDtoMap,
  screenTemperatureAndHumidity,
  screenTerminalListMap,
  getDeviceRealTimeAlarmTrendCount,
  getCameraMap,
} from "api/screen/index";
let GD = require("common/js/map/guangdong.json");

export default {
  data() {
    return {
      contentsHeader: false,
      city: "",
      area: "",
      data_1: [],
      data_2: [],
      data_3: [],
      data_4: [],
      data_5: [],
      data_6: [],
      data_7: [],
      data_8: [],
      data_9: [],
      data_10: [],
      data_T: {},
      curr_1: 1,
      alarmTrendId: null,
      trendId: null,
      onLoadId: null,
      lightTime: null,
      alarmTime: null,
      searchModuleShow: false,
      searchModule: [
        {
          id: "LAMP",
          icon: "dengpao-tianchong",
          title: "照明灯",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_lamp",
        },
        {
          id: "BATTERY",
          icon: "chongdianzhuang",
          title: "充电桩",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_battery",
        },
        {
          id: "CAMERA",
          icon: "jiankong",
          title: "监控视频",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_video",
        },
        {
          id: "AMBIENT",
          icon: "huanjingjiance1",
          title: "环境监测器",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_wind",
        },
        {
          id: "LED",
          icon: "led",
          title: "LED显示屏",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_led",
        },
        {
          id: "AUDIO",
          icon: "yinxiang",
          title: "广播器",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_broadcast",
        },
        {
          id: "CALL",
          icon: "baojingqi",
          title: "报警器",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_call",
        },
        {
          id: "WIFI",
          icon: "wifi1",
          title: "智能WIFI",
          startColor: "#4c99d0",
          endColor: "#D093FF",
          normal: 100,
          abnormal: 365,
          searchId: "s_wifi",
        },
      ],
      map: {
        show: false,
        infoShow: false,
        collapseActiveNames: ["1"],
        effextArray: [],
        info: {},
        title: "地图",
        labers: undefined,
        center: {},
        nodeData: [],
        LAMP: [],
        AMBIENT: [],
        CAMERA: [],
        LED: [],
        CALL: [],
        AUDIO: [],
      },
      activeFrame: undefined,
      chart1Options: {
        chart: {
          className: "chartBg",
          backgroundColor: "transparent",
          // plotBackgroundImage: pieBgImg,
          type: "pie",
          height: "215px",
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0,
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          align: "center",
        },
        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "{series.value}",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 25,
            dataLabels: {
              enabled: true,
              format: "{y}",
              connectorColor: "#1B6CCC",
              color: "#fff",
              style: {
                fontSize: "16px",
              },
            },
          },
        },
        series: [],
      },
      rItem2: {
        totalData: 0,
        alarmData: 0,
      },
    };
  },
  components: {
    RadioScenarios,
    RadioYear,
    ChartTitle,
    electricLine,
    Map,
    LightLabers,
    AmbientLabers,
    LedLabers,
    CallLabers,
    AudioLabers,
    Information,
    PublishInformation,
    SuperviseInformation,
    WarnInformation,
    BroadcastInformation,
    LightPoleMap,
    SmokeDetectorMap,
    WisdomParkReport,
    SecurityMonitoring,
    SmokeAlarmLink,
    LongRangControl,
    videoAddress,
    DvBorderBox1,
    Labers,
    highcharts: Chart,
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations(["set_common"]),
    getInit() {
      this._screenEnergyConsump();
    },
    // 灯杆能耗状态
    _screenEnergyConsump() {
      let params = {
        area: "",
        city: "",
        type: null,
      };
      screenEnergyConsump(params).then((res) => {
        const { data } = res;
        this.data_2 = {
          ...data,
          // statisticsTime: moment(data.statisticsTime).format('YYYY-MM-DD HH:mm:ss')
        };
        this.$nextTick(() => {
          this.init2();
        });
      });
    },
    init2() {
      let option = null;

      let colors = ["#FFA81C", "#EA2E18", "#42E3FF", "#9035DF"];
      let chartData = [
        ["节能能耗/度", parseInt(this.data_2.energySaving)],
        ["总能耗/度", parseInt(this.data_2.totalEnergy)],
        ["节能率", parseInt(this.data_2.energySavingRate)],
        ["故障率", parseInt(this.data_2.failureRate)],
      ];
      option = {
        ...this.chart1Options,
        colors: colors,
        series: [
          {
            type: "pie",
            name: "能耗状态",
            data: chartData,
          },
        ],
      };
      this.chart1Options = option;
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getInit();
    });
  },
  created() {},
  destroyed() {},
};
</script>
<style lang="less">
#callRight {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_3 {
    width: 100%;
    height: 50%;
  }
  .parat_4 {
    width: 100%;
    height: 50%;
  }
}
</style>
