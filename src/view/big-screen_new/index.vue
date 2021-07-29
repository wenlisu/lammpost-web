<template>
  <div id="bigScreenNew">
    <IndexCor @handleCurrent="handleCurrent">
      <template v-slot:left>
        <component :is="partLeft"></component>
        <!-- <AmbientLeft :show="currentPage === 'AMBIENT'" />
        <SmokeLeft :show="currentPage === 'SMOKE_DETECTOR'"/>
        <LedLeft :show="currentPage === 'LED'" />
        <DoorLeft :show="currentPage === 'DOOR_ACCESS'" />
        <CallLeft :show="currentPage === 'CALL'" />
        <AudioLeft :show="currentPage === 'AUDIO'" />
        <CallLeft :show="currentPage === 'LED'" />
        <LampLeft :show="currentPage === 'LAMP'" />
        <CameraLeft :show="currentPage === 'CAMERA'" /> -->
      </template>
      <template v-slot:center>
        <Center :list="currentList" />
      </template>
      <template v-slot:right>
        <component :is="partRight"></component>
        <!-- <AmbientRight :show="currentPage === 'AMBIENT'" />
        <SmokeRight :show="currentPage === 'SMOKE_DETECTOR'" />
        <LedRight :show="currentPage === 'LED'" />
        <DoorRight :show="currentPage === 'DOOR_ACCESS'" />
        <CallRight :show="currentPage === 'CALL'" />
        <AudioRight :show="currentPage === 'AUDIO'" />
        <CallRight :show="currentPage === 'LED'" />
        <LampRight :show="currentPage === 'LAMP'" />
        <CameraRight :show="currentPage === 'CAMERA'" /> -->
      </template>
    </IndexCor>
  </div>
</template>
<script>
import { getLocal } from "util/tool";
import { mapGetters, mapMutations } from "vuex";
import IndexCor from "./indexCor";
import CallLeft from "./view/call/left";
import CallRight from "./view/call/right";
import LampLeft from "./view/lamp/left";
import LampRight from "./view/lamp/right";
import AudioRight from "./view/audio/right";
import AudioLeft from "./view/audio/left";
import LedLeft from "./view/led/left";
import LedRight from "./view/led/right";
import CameraLeft from "./view/camera/left";
import CameraRight from "./view/camera/right";
import DoorLeft from "./view/door/left";
import DoorRight from "./view/door/right";
import SmokeLeft from "./view/smoke/left";
import SmokeRight from "./view/smoke/right";
import AmbientLeft from "./view/ambient/left";
import AmbientRight from "./view/ambient/right";
import Center from "./view/center";
import { centerList } from "./util";
export default {
  data() {
    return {
      currentPage: "CALL",
      currentList: centerList("CALL"),
      time: 0,
      partLeft: CallLeft,
      partRight: CallRight,
      fileName: {
        CALL: "call",
        AUDIO: "audio",
        LAMP: "lamp",
        LED: "led",
        AMBIENT: "ambient",
        SMOKE_DETECTOR: "smoke",
        DOOR_ACCESS: "door",
        CAMERA: "camera"
      }
    };
  },
  components: {
    IndexCor,
    Center,
    // 广播器
    AudioRight,
    AudioLeft,
    // 报警器
    CallLeft,
    CallRight,
    // 照明灯
    LampLeft,
    LampRight,
    // LED
    LedLeft,
    LedRight,
    // camera
    CameraLeft,
    CameraRight,
    // 门禁
    DoorLeft,
    DoorRight,
    // 烟感
    SmokeLeft,
    SmokeRight,
    // ambient
    AmbientLeft,
    AmbientRight
  },
  computed: {
    ...mapGetters(["bigScreenNew", "openPage"])
  },
  created() {
    /* this.partLeft = () => {
      return new Promise((resolve) => {
        const imstance = import(`./view/call/left`);
        imstance.then((res) => {
          resolve(res);
        });
        imstance.catch(() => {});
      });
    };
    this.partRight = () => {
      return new Promise((resolve) => {
        const imstance = import(`./view/call/right`);
        imstance.then((res) => {
          resolve(res);
        });
        imstance.catch(() => {});
      });
    }; */
  },
  methods: {
    handleCurrent(val) {
      this.currentPage = val.id;
      this.currentList = centerList(val.id);
      console.log(this.currentList)
      this.getPublicInfo(val);
      this.partLeft = () => {
        return Promise.resolve(require(`./view/${this.fileName[val.id]}/left`))
        // return new Promise(resolve => {
        //   // const imstance = resolve => (require([`./view/${this.fileName[val.id]}/left`], resolve))
        //   const imstance = import(`./view/${this.fileName[val.id]}/left`);
        //   imstance.then(res => {
        //     resolve(res);
        //   });
        //   imstance.catch(() => {});
        // });
      };
      this.partRight = () => {
        return Promise.resolve(require(`./view/${this.fileName[val.id]}/right`))
        // return new Promise(resolve => {
        //   // const imstance = resolve => (require([`./view/${this.fileName[val.id]}/right`], resolve))
        //   const imstance = import(`./view/${this.fileName[val.id]}/right`);
        //   imstance.then(res => {
        //     resolve(res);
        //   });
        //   imstance.catch(() => {});
        // });
      };
    },
    // 获取中间公共信息列表数据
    getPublicInfo(val) {
      // 报警器
      if (val.id == "CALL" && val.text == "报警器") {
        let data = getLocal("bigScreenNew")["alarmCallStats"];
        this.currentList.map(e => {
          this.$set(e, "value", data[e.query]);
        });
      }
      // 摄像头
      if (val.id == "CAMERA" && val.text == "摄像头") {
        let data = getLocal("bigScreenNew")["cameraEventStat"];
        this.currentList.map(e => {
          this.$set(e, "value", data[e.query]);
        });
      }
      // 环境监测器
      if (val.id == "AMBIENT" && val.text == "环境监测器") {
        let data = getLocal("bigScreenNew")["ambientAlarmAnalysis"];
        this.currentList.map(e => {
          this.$set(e, "value", data[e.query]);
        });
      }
      // 门禁
      if (val.id == "DOOR_ACCESS" && val.text == "门禁") {
        let data = getLocal("bigScreenNew")["doorAccessInfo"];
        this.currentList.map(e => {
          this.$set(e, "value", data[e.query]);
        });
      }
      // 照明
      if (val.id == "LAMP" && val.text == "照明灯") {
        let data = getLocal("bigScreenNew")["deviceLamp"];
        this.currentList.map(e => {
          this.$set(e, "value", data.deviceInfo[e.query]);
        });
      }
      // LED
      if (val.id == "LED" && val.text == "LED显示屏") {
        let data = getLocal("bigScreenNew")["deviceLed"];
        let lData = getLocal("bigScreenNew")["ledprogram"];
        this.currentList.map(e => {
          this.$set(e, "value", data.deviceInfo[e.query]);
          lData.map(i => {
            if (e.query == "policyCount" && i.programScenario == 1) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "cultureCount" && i.programScenario == 2) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "publicGoodCount" && i.programScenario == 3) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "emergencyCount" && i.programScenario == 4) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "trafficCount" && i.programScenario == 5) {
              this.$set(e, "value", i.programCount);
            }
          });
        });
      }
      // 广播器
      if (val.id == "AUDIO" && val.text == "广播器") {
        let data = getLocal("bigScreenNew")["deviceAudio"];
        let lData = getLocal("bigScreenNew")["ledprogram"];
        this.currentList.map(e => {
          this.$set(e, "value", data.deviceInfo[e.query]);
          lData.map(i => {
            if (e.query == "policyCount" && i.programScenario == 1) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "cultureCount" && i.programScenario == 2) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "publicGoodCount" && i.programScenario == 3) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "emergencyCount" && i.programScenario == 4) {
              this.$set(e, "value", i.programCount);
            }
            if (e.query == "trafficCount" && i.programScenario == 5) {
              this.$set(e, "value", i.programCount);
            }
          });
        });
      }
      // 烟感
      if (val.id == "SMOKE_DETECTOR" && val.text == "烟感") {
        let data = getLocal("bigScreenNew")["smokeDetectorStatistics"];
        this.currentList.map(e => {
          this.$set(e, "value", data[e.query]);
        });
      }
    }
  },
  watch: {},
  mounted() {},
  destroyed() {}
};
</script>
<style lang="less">
#bigScreenNew {
  height: 100%;
  min-width: 1200px; /*no*/
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // background-image: url(./bg.jpg);
  background-repeat: no-repeat;
  background-size: 100%;
  .left_wrap {
    width: 100%;
  }
}
</style>
