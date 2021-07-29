<template>
  <div id="bigScreenNewCor">
    <div
      :class="{
        'inner-header-icon': !contentsHeader,
        'inner-header-icon-click': contentsHeader,
        'inner-header-icon-out': !contentsHeader,
      }"
      @click="
        () => {
          contentsHeader = !contentsHeader;
        }
      "
      v-if="false"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="flexCloumn screen_title" v-if="contentsHeader">
      <div :class="userType === 1 && 'active'" @click="handleChangeUser(1)">
        海南项目
      </div>
      <div :class="userType === 2 && 'active'" @click="handleChangeUser(2)">
        佛山项目
      </div>
      <div :class="userType === 3 && 'active'" @click="handleChangeUser(3)">
        广州项目
      </div>
    </div>
    <div class="flexCenter screenTitleBg">
      <div @click="jumpIndex">城市基础设施管理平台</div>
    </div>
    <div class="srceen_content">
      <el-row :gutter="10" class="centerInfoBox">
        <div class="centerBox">
          <div class="c_center">
            <div class="top_bg">
              <!-- 外层宽高固定了，根据外层宽高偏移 -->
              <div class="totalInfoBox">
                <img src="./images/listBg.png" alt="" class="totalInfoBoxBg" />
                <div
                  v-for="(item, index) in pageData"
                  :key="index"
                  class="infoItem"
                  :class="
                    pageNumber == index && pageNumber + 1 <= 4
                      ? 'infoItemActiveLeft infoItem' + (index + 1)
                      : [
                          pageNumber == index && pageNumber + 1 > 4
                            ? 'infoItemActiveRight infoItem' + (index + 1)
                            : 'infoItem' + (index + 1),
                        ]
                  "
                  @click="jumpTo(item.routerName, item)"
                >
                  <p>{{ item.text }}</p>
                  <countTo
                    :startVal="0"
                    :endVal="Number(item.number)"
                    :duration="3000"
                    separator=""
                  ></countTo>
                  <!-- <p>{{ item.number }}</p> -->
                </div>
              </div>
            </div>
            <div class="center_svg">
              <div class="centerBg">
                <div class="bgImg"></div>
                <LeftTop class="left_top" />
                <RightTop class="right_top" />
                <LeftBotoom class="left_bottom" />
                <RightBottom class="right_bottom" />
              </div>
              <!-- 转动圆圈(切图是正圆，切不了椭圆，不能用背景图，背景图无法压缩) -->
              <img
                v-for="(pageDataItem, index) in pageData"
                :key="index + 1"
                :src="pageNumber + 1 == index + 1 ? circular_active : circular"
                alt=""
                :class="'circularItem' + pageDataItem.id"
                class="circularItem"
              />
              <!-- 箭头 -->
              <img
                src="./images/triangle.gif"
                alt=""
                class="triangle"
                :class="'triangle' + pageData[pageNumber].id"
              />
              <!-- 包围图 -->
              <img
                src="./images/surround.gif"
                alt=""
                class="surround"
                :class="'surround' + pageData[pageNumber].id"
              />
              <!-- 底部圆圈 -->
              <img
                src="./images/bottom_circular.gif"
                alt=""
                class="bottom_circular"
                :class="'bottom_circular' + pageData[pageNumber].id"
              />
              <!-- 人 -->
              <img src="./images/person.gif" alt="" class="person" />
              <!-- 车 -->
              <img src="./images/car.gif" alt="" class="car" />
              <!-- 信息弹框 -->
              <div
                class="infomationCon"
                :class="
                  pageNumber <= 4
                    ? 'infomationConLeft infomationCon' +
                      pageData[pageNumber].id
                    : 'infomationConRight infomationCon' +
                      pageData[pageNumber].id
                "
              >
                <div class="title">
                  {{ pageData[pageNumber] && pageData[pageNumber].text }}
                </div>
                <div class="infoListBox">
                  <p
                    v-for="(item, index) in pageData[pageNumber].infoList"
                    :key="index"
                    v-if="pageData[pageNumber] && pageData[pageNumber].infoList"
                  >
                    <span class="key">{{ item.name }}</span>
                    <span class="value">{{ item.value }}</span>
                  </p>
                </div>
              </div>
              <!-- 模拟大楼点击事件，盖一个透明定位的div盖住大楼绑定点击事件 -->
              <div
                v-for="index in 8"
                :key="index"
                :class="'clickDom' + index"
                class="clickDom"
                @click="resetInterval(index)"
              ></div>
            </div>
            <!-- <slot name="center"></slot> -->
          </div>
        </div>
      </el-row>
      <el-row :gutter="10" class="indexMap">
        <el-col :span="7">
          <div class="c_left">
            <slot name="left"></slot>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="c_center">
            <div class="top_data"></div>
            <div class="center_svg"></div>
            <slot name="center"></slot>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="c_right">
            <slot name="right"></slot>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bigScreenNewApi from "@/mixins/bigScreenNewApi";
import { getLocal } from "util/tool";
import LeftTop from "./components/line/leftTop";
import RightTop from "./components/line/rightTop";
import LeftBotoom from "./components/line/leftBottom";
import RightBottom from "./components/line/rightBottom";
import countTo from "vue-count-to";
import Config from '@/config';
const userTypeOption = {
  1: [
    "LAMP",
    "DOOR_ACCESS",
    "CALL",
    "AMBIENT",
    "SMOKE_DETECTOR",
    "AUDIO",
    "LED",
    "CAMERA",
  ],
  2: ["LAMP", "CALL", "AMBIENT", "AUDIO", "LED"],
  3: ["LAMP", "DOOR_ACCESS", "SMOKE_DETECTOR", "AUDIO", "CAMERA"],
};
export default {
  mixins: [bigScreenNewApi()],
  data() {
    return {
      // pageData数组的元素顺序是根据背景图的顺序所定，尽量不改变其数组元素的顺序
      pageDataItem: [
        {
          id: "LAMP",
          text: "照明灯",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线设备数", value: 0 },
            { name: "离线设备数", value: 0 },
            { name: "总耗电量", value: 0 },
            { name: "节能用电", value: 0 },
          ],
          // routerName: 'lightPoleMap'
          routerName:
            "http://39.108.109.191:8080/#/login?redirect=%2F&username=sanyuan1",
        },
        {
          id: "DOOR_ACCESS",
          text: "门禁",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "告警总数", value: 0 },
            { name: "进出总人次", value: 0 },
          ],
          routerName: "smokeAppMap",
        },
        {
          id: "CALL",
          text: "报警器",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "报警总数", value: 0 },
          ],
          routerName: "wisdomWarnMap",
        },
        {
          id: "AMBIENT",
          text: "环境监测器",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "报警总数", value: 0 },
          ],
          routerName: "superviseMap",
        },
        {
          id: "SMOKE_DETECTOR",
          text: "烟感",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "报警总数", value: 0 },
          ],
          routerName: "smokeAppMap",
        },
        {
          id: "AUDIO",
          text: "广播器",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "正在播放设备数", value: 0 },
            { name: "播放总次数", value: 0 },
          ],
          routerName: "wisdomBroadcastMap",
        },
        {
          id: "LED",
          text: "LED显示屏",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线总数", value: 0 },
            { name: "离线总数", value: 0 },
            { name: "播放总次数", value: 0 },
            { name: "播放任务总数", value: 0 },
          ],
          routerName: "publishPoleMap",
        },
        {
          id: "CAMERA",
          text: "摄像头",
          number: "",
          infoList: [
            { name: "设备总数", value: 0 },
            { name: "在线设备数", value: 0 },
            { name: "离线设备数", value: 0 },
            { name: "告警总数", value: 0 },
          ],
          routerName: "securityMonitoring",
        },
      ],
      pageData: [],
      pageNumber: 0,
      pageTime: null,
      circular_active: require("./images/circular_active.gif"),
      circular: require("./images/circular.gif"),
      userType: 1,
      contentsHeader: false,
    };
  },
  props: {
    handleCurrent: Function,
  },
  components: {
    LeftTop,
    RightTop,
    LeftBotoom,
    RightBottom,
    countTo,
  },
  computed: {
    ...mapGetters(["bigScreenNew", "openPage"]),
  },
  methods: {
    getInit() {
      this.pageData = this.pageDataItem;

      // 想了想还是用setInterval好，毕竟原生封装的
      this.handleSetInterval();
    },
    // 点击切换显示的模块 ，并重新设置定时器
    resetInterval(index) {
      this.pageNumber = index - 1; // pageNumber从0开始，index从1开始，所以减1
      this.$emit("handleCurrent", this.pageData[index - 1]);
      this.handleSetInterval();
    },
    // 提取定时器
    async handleSetInterval() {
      const deviceSumStatistics = (getLocal("bigScreenNew")["deviceSumStatistics"]).map(staticItem => staticItem.deviceType);
      let pageData = await deviceSumStatistics.map((option) => {
        const optionItem = this.pageDataItem.find(
          (data) => data.id === option
        );
        if (optionItem) {
          return optionItem;
        }
        return null;
      });
      pageData = pageData.filter((n) => n);
      this.pageData = pageData;
      this.pageTime && clearInterval(this.pageTime);
      this.pageTime = setInterval(() => {
        this.pageNumber < this.pageData.length - 1
          ? this.pageNumber++
          : (this.pageNumber = 0);

        this.setPageData();
        this.$emit("handleCurrent", this.pageData[this.pageNumber]);
      }, 8000);
    },
    // 改变用户权限
    async handleChangeUser(type) {
      if (type !== this.userType) {
        this.userType = type;
        const typeOptions = userTypeOption[type];
        let pageData = await deviceSumStatistics.map((option) => {
          const optionItem = this.pageDataItem.find(
            (data) => data.id === option
          );
          if (optionItem) {
            return optionItem;
          }
          return null;
        });
        pageData = pageData.filter((n) => n);
        this.pageData = pageData;
        // console.log('pageData', pageData);
        this.pageNumber = 0; // pageNumber从0开始
        this.$emit("handleCurrent", this.pageData[0]);
        this.handleSetInterval();
        this.contentsHeader = !this.contentsHeader;
      }
    },
    jumpIndex() {
      this.$router.push({
        name: Config.homeName,
      });
    },
    setPageData() {
      let deviceSumStatistics = getLocal("bigScreenNew")["deviceSumStatistics"];
      this.pageData.forEach((element) => {
        deviceSumStatistics.forEach((item) => {
          if (element.id == item.deviceType) {
            this.$set(element, "number", item.deviceCount);
          }
        });
        // 报警器
        if (element.id === "CALL") {
          let alarmCallWorkingStats =
            getLocal("bigScreenNew")["alarmCallWorkingStats"];
          // console.log(alarmCallWorkingStats, '报警器');
          this.$set(
            element.infoList[0],
            "value",
            alarmCallWorkingStats.totalCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            alarmCallWorkingStats.onlineCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            alarmCallWorkingStats.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            alarmCallWorkingStats.currentAlarmCllCount || 0
          );
        }
        // 广播器
        if (element.id === "AUDIO") {
          let deviceAudioStatistics =
            getLocal("bigScreenNew")["deviceAudioStatistics"];
          // console.log(deviceAudioStatistics, '广播器');
          this.$set(
            element.infoList[0],
            "value",
            deviceAudioStatistics.deviceInfo.audioDeviceCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            deviceAudioStatistics.deviceInfo.audioOnlineCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            deviceAudioStatistics.deviceInfo.audioFaultCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            deviceAudioStatistics.deviceInfo.playCount || 0
          );
          this.$set(
            element.infoList[4],
            "value",
            deviceAudioStatistics.deviceInfo.audioPlayTotalCount || 0
          );
        }
        // LED
        if (element.id === "LED") {
          let deviceLedStatistics =
            getLocal("bigScreenNew")["deviceLedStatistics"];
          // console.log(deviceLedStatistics, 'LED显示屏');
          this.$set(
            element.infoList[0],
            "value",
            deviceLedStatistics.deviceStatistics.deviceCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            deviceLedStatistics.deviceStatistics.onlineCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            deviceLedStatistics.deviceStatistics.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            deviceLedStatistics.deviceInfo.playTaskCount || 0
          );
          this.$set(
            element.infoList[4],
            "value",
            deviceLedStatistics.deviceInfo.playCount || 0
          );
        }
        // 环境检测器
        if (element.id === "AMBIENT") {
          let ambientMonitoringRunStatus =
            getLocal("bigScreenNew")["ambientMonitoringRunStatus"];
          // console.log(ambientMonitoringRunStatus, '环境监测器');
          this.$set(
            element.infoList[0],
            "value",
            ambientMonitoringRunStatus.totalCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            ambientMonitoringRunStatus.onlineCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            ambientMonitoringRunStatus.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            ambientMonitoringRunStatus.alarmCount || 0
          );
        }
        // 照明灯
        if (element.id === 'LAMP') {
          let deviceLampStatistics = getLocal('bigScreenNew')[
            'deviceLampStatistics'
          ];
          // console.log(deviceLampStatistics, '照明灯');
          this.$set(
            element.infoList[0],
            'value',
            deviceLampStatistics.deviceStatistics.deviceCount || 0
          );
          this.$set(
            element.infoList[1],
            'value',
            deviceLampStatistics.deviceStatistics.onlineCount || 0
          );
          this.$set(
            element.infoList[2],
            'value',
            deviceLampStatistics.deviceStatistics.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            'value',
            deviceLampStatistics.deviceInfo.powerSum || 0
          );
          this.$set(
            element.infoList[4],
            'value',
            deviceLampStatistics.deviceInfo.saveSum || 0
          );
        }
        // 烟感
        if (element.id === "SMOKE_DETECTOR") {
          let smokeDetectorCurrentStatus =
            getLocal("bigScreenNew")["smokeDetectorCurrentStatus"];
          // console.log(smokeDetectorCurrentStatus, '烟感');
          this.$set(
            element.infoList[0],
            "value",
            smokeDetectorCurrentStatus.deviceCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            smokeDetectorCurrentStatus.normalCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            smokeDetectorCurrentStatus.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            smokeDetectorCurrentStatus.alarmCount || 0
          );
        }
        // 门禁
        if (element.id === "DOOR_ACCESS") {
          let doorAccessCurrentStatus =
            getLocal("bigScreenNew")["doorAccessCurrentStatus"];
          // console.log(doorAccessCurrentStatus, '门禁');
          this.$set(
            element.infoList[0],
            "value",
            doorAccessCurrentStatus.totalCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            doorAccessCurrentStatus.normalCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            doorAccessCurrentStatus.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            doorAccessCurrentStatus.alarmCount || 0
          );
          this.$set(
            element.infoList[4],
            "value",
            doorAccessCurrentStatus.todayFlow || 0
          );
        }
        if (element.id === "CAMERA") {
          let cameraOnlineState = getLocal("bigScreenNew")["cameraOnlineState"];
          // console.log(cameraOnlineState, "摄像头");
          this.$set(
            element.infoList[0],
            "value",
            cameraOnlineState.allCount || 0
          );
          this.$set(
            element.infoList[1],
            "value",
            cameraOnlineState.onlineCount || 0
          );
          this.$set(
            element.infoList[2],
            "value",
            cameraOnlineState.offlineCount || 0
          );
          this.$set(
            element.infoList[3],
            "value",
            cameraOnlineState.alarmCount || 0
          );
        }
      });

      // console.log(this.pageData);
    },
    // 点击信息 跳转对应设备地图页面
    jumpTo(name, item) {
      if (item.id == "LAMP") {
        window.open(name, "_blank");
      } else {
        let details = this.$router.resolve({
          name: name,
        });
        // console.log(details)
        window.open(details.href, "_blank");
      }
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {});
  },
  created() {
    this.getInit();
  },
  destroyed() {
    this.pageTime && clearInterval(this.pageTime);
  },
};
</script>
<style lang="less">
@keyframes ball {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
#bigScreenNewCor {
  height: 100%;
  width: 100%; /*no*/
  padding: 34px 30px 49px 30px;
  background: url(~common/images/bigscreen/newBg.png) no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 3px;
    background-color: transparent;
  }
  .inner-header {
    background-color: rgba(0, 0, 0, 1);
    width: 100%;
    height: 50px;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .screenTitleBg {
    height: 72px; /*no*/
    width: 100%;
    background: url(~./images/titleBg.png) no-repeat;
    background-size: contain;
    background-position: center;
    padding-bottom: 12px;
    > div {
      cursor: pointer;
      background-image: linear-gradient(180deg, #ffffff, #d1e5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 66px;
      font-family: YouSheBiaoTiHei;
      text-align: left;
      color: #ffffff;
      line-height: 54px;
    }
  }
  .screen_title {
    position: absolute;
    left: 35px;
    top: 70px;
    width: 138px;
    height: auto;
    background: rgba(34, 41, 85, 0.84);
    border: 1px solid;
    border-image: linear-gradient(180deg, #16a2d7, #0567b7) 1 1;
    padding: 6px;
    z-index: 999;
    > div {
      padding: 6px 14px;
      background: #035b97;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #aedeff;
      margin-bottom: 5px;
      cursor: pointer;
      &.active {
        background: rgba(40, 168, 255, 0.62);
        border: 1px solid #47e6ff; /*no*/
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #ffffff;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        background: rgba(40, 168, 255, 0.62);
        border: 1px solid #47e6ff; /*no*/
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #ffffff;
      }
    }
  }
  .srceen_content {
    height: calc(100% - 120px);
    display: flex;
    flex: 1;
    box-sizing: border-box;
    justify-content: space-between;
    width: 100%;
    position: relative;
    > .el-row {
      width: 100%;
      > .el-col {
        height: 100%;
      }
    }
    .c_left {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .left_slot {
        width: 100%;
      }
    }
    .c_center {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .c_right {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .c_left,
    .c_center,
    .c_right {
      > .el-row {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    .centerInfoBox {
      position: absolute;
      left: 23%;
      top: 0;
      z-index: 2;
      width: 54%;
      height: 100%;
      .centerBox {
        position: relative;
        width: 100%;
        height: 100%;
        .centerBg {
          width: 100%;
          height: 100%;
          .bgImg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("./images/centerBg.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            z-index: 888;
          }
          .left_top {
            position: absolute;
            top: -1%;
            left: 4%;
          }
          .left_bottom {
            position: absolute;
            bottom: 4%;
            left: -1%;
          }
          .right_top {
            position: absolute;
            top: -1%;
            right: 7%;
          }
          .right_bottom {
            position: absolute;
            bottom: 4%;
            right: -1%;
          }
        }
      }
    }
  }
  .componentView {
    // opacity: 0;
    // position: absolute;
    // width: 30%;
    &.show {
      opacity: 1;
      position: relative;
      width: 100%;
    }
  }

  // 中间动画
  .top_data {
    width: 100%;
    height: 30%;
  }
  .top_bg {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    padding-top: 4%;
    z-index: 99999999;
    .totalInfoBox {
      width: 68%;
      position: relative;
      .totalInfoBoxBg {
        width: 100%;
      }
      .infoItem {
        position: absolute;
        background: transparent;
        width: 13.4%;
        height: 5.5vw; //父元素根据宽度自适应，挤变形图片，所以高度根据宽度变化
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 1.2vw 0;
        cursor: pointer;
        p {
          text-align: center;
          color: #fff;
          font-size: 16px;
          font-family: PingFangSC;
        }
        span {
          font-size: 22px;
          font-family: Helvetica;
          text-align: center;
          color: #ffffff;
          line-height: 26px;
          letter-spacing: 1px;
          text-shadow: 0px 4px 4px 0px #0d6379;
        }
        &.infoItemActiveLeft {
          background: url(~./images/left_active.png) no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
        &.infoItemActiveRight {
          background: url(~./images/right_active.png) no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
        &.infoItem1 {
          top: 0;
          left: 7.5%;
        }
        &.infoItem2 {
          top: 0;
          left: 20.5%;
        }
        &.infoItem3 {
          top: 0;
          left: 66%;
        }
        &.infoItem4 {
          top: 0;
          left: 79%;
        }
        &.infoItem5 {
          top: 4vw;
          left: 0.5%;
        }
        &.infoItem6 {
          top: 4vw;
          left: 13.5%;
        }
        &.infoItem7 {
          top: 4vw;
          left: 72.5%;
        }
        &.infoItem8 {
          top: 4vw;
          left: 85.5%;
        }
      }
    }
  }
  .center_svg {
    width: 100%;
    height: 100%;
    position: relative;
    margin-left: 1.1%;
    .circularItem {
      position: absolute;
      width: 3.6%;
      height: 3.3%;
      z-index: 900;
      &.circularItemLAMP {
        top: 22.5%;
        left: 29.2%;
      }
      &.circularItemDOOR_ACCESS {
        top: 46%;
        left: 27%;
      }
      &.circularItemCALL {
        top: 56%;
        left: 38%;
      }
      &.circularItemAMBIENT {
        top: 55%;
        left: 54%;
      }
      &.circularItemSMOKE_DETECTOR {
        top: 50%;
        left: 64.2%;
      }
      &.circularItemAUDIO {
        top: 23.5%;
        left: 69%;
      }
      &.circularItemLED {
        top: 17.8%;
        left: 61%;
      }
      &.circularItemCAMERA {
        top: 8%;
        left: 50.5%;
      }
    }
    .triangle {
      position: absolute;
      width: 5.5%;
      z-index: 900;
      &.triangleLAMP {
        top: 15.5%; //-7
        left: 28.3%; //-0.9
      }
      &.triangleDOOR_ACCESS {
        top: 39%;
        left: 26.1%;
      }
      &.triangleCALL {
        top: 49%;
        left: 37.1%;
      }
      &.triangleAMBIENT {
        top: 48%;
        left: 53.1%;
      }
      &.triangleSMOKE_DETECTOR {
        top: 43%;
        left: 63.3%;
      }
      &.triangleAUDIO {
        top: 16.5%;
        left: 68.1%;
      }
      &.triangleLED {
        top: 10.8%;
        left: 60.1%;
      }
      &.triangleCAMERA {
        top: 1%;
        left: 49.6%;
      }
    }
    .surround {
      position: absolute;
      width: 13.5%;
      z-index: 900;
      &.surroundLAMP {
        top: 25.5%;
        left: 24.2%;
      }
      &.surroundDOOR_ACCESS {
        top: 53.5%;
        left: 22.8%;
      }
      &.surroundCALL {
        top: 60.5%;
        left: 32.8%;
      }
      &.surroundAMBIENT {
        top: 60.5%;
        left: 48.8%;
      }
      &.surroundSMOKE_DETECTOR {
        top: 51.5%;
        left: 59.8%;
        width: 12.5%;
      }
      &.surroundAUDIO {
        top: 28.5%;
        left: 63.2%;
        width: 16.5%;
      }
      &.surroundLED {
        top: 19.5%;
        left: 57%;
        width: 11.5%;
      }
      &.surroundCAMERA {
        top: 20.5%;
        left: 38%;
        width: 29.5%;
      }
    }
    .bottom_circular {
      position: absolute;
      width: 40.5%;
      &.bottom_circularLAMP {
        top: 26.5%;
        left: 10.8%;
      }
      &.bottom_circularDOOR_ACCESS {
        top: 56.5%;
        left: 8.8%;
      }
      &.bottom_circularCALL {
        top: 60.5%;
        left: 19.3%;
      }
      &.bottom_circularAMBIENT {
        top: 60.5%;
        left: 35.3%;
      }
      &.bottom_circularSMOKE_DETECTOR {
        top: 51.5%;
        left: 45.8%;
      }
      &.bottom_circularAUDIO {
        top: 33.5%;
        left: 50.8%;
      }
      &.bottom_circularLED {
        top: 17.5%;
        left: 42.8%;
      }
      &.bottom_circularCAMERA {
        top: 34.5%;
        left: 22.8%;
        width: 60.5%;
      }
    }
    .infomationCon {
      position: absolute;
      width: 223px;
      background-image: url(~./images/infoBg.png);
      background-size: 100% 100%;
      z-index: 999;
      .title {
        font-size: 20px;
        background-image: linear-gradient(180deg, #9bf0ff 18%, #4cddff 70%);
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: 4px;
        font-family: PingFangSC;
        font-weight: 600;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px 0px #1c4696;
      }
      .infoListBox {
        font-size: 16px;
        color: #fff;
        p {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-family: PingFangSC;
        }
      }
      //旋转可以，但翻转不行，放弃背景翻转了
      &.infomationConLeft {
        // padding: 20px 32px 20px 20px;
        padding: 20px 20px 20px 32px;
      }
      &.infomationConRight {
        padding: 20px 20px 20px 32px;
      }
      .infomationBgImg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
      }
      &.infomationConLAMP {
        top: 24%;
        left: 31.2%;
      }
      &.infomationConDOOR_ACCESS {
        top: 47.5%;
        left: 29%;
      }
      &.infomationConCALL {
        top: 57.5%;
        left: 40%;
      }
      &.infomationConAMBIENT {
        top: 56.5%;
        left: 56%;
      }
      &.infomationConSMOKE_DETECTOR {
        top: 51.5%; // + 1.5
        left: 66.2%; // + 2
      }
      &.infomationConAUDIO {
        top: 25%; // + 1.5
        left: 71%; // + 2
      }
      &.infomationConLED {
        top: 19.3%; // + 1.5
        left: 63%; // + 2
      }
      &.infomationConCAMERA {
        top: 9.5%; // + 1.5
        left: 52.5%; // + 2
      }
    }
    .clickDom {
      position: absolute;
      background: transparent;
      cursor: pointer;
      z-index: 999;
      &.clickDom1 {
        width: 15%;
        height: 18%;
        top: 26%;
        left: 23.2%;
      }
      &.clickDom2 {
        width: 7%;
        height: 21%;
        top: 50%;
        left: 25.2%;
      }
      &.clickDom3 {
        width: 6%;
        height: 15%;
        top: 60%;
        left: 36.2%;
      }
      &.clickDom4 {
        width: 6%;
        height: 17%;
        top: 59%;
        left: 52.2%;
      }
      &.clickDom5 {
        width: 5%;
        height: 16%;
        top: 53%;
        left: 63.2%;
      }
      &.clickDom6 {
        width: 6%;
        height: 21%;
        top: 27%;
        left: 68.2%;
      }
      &.clickDom7 {
        width: 5%;
        height: 14%;
        top: 21%;
        left: 60.2%;
      }
      &.clickDom8 {
        width: 14%;
        height: 43%;
        top: 12%;
        left: 45.2%;
      }
    }
    .person {
      position: absolute;
      width: 8.5%;
      top: 49.5%;
      left: 54%;
      z-index: 900;
    }
    .car {
      position: absolute;
      width: 16.5%;
      top: 49.5%;
      left: 37%;
      z-index: 900;
    }
  }
}
</style>
