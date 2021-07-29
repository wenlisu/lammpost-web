<template>
  <div class="rightTable">
    <partTitle :title="title" />
    <div class="rightLine">
      <scrollTable />
    </div>
    <div class="pieBox">
      <partTitle :title="bottomTitle" />
      <div class="pieChart">
        <div class="videoContent">
          <videoAddress :srcUrl="videoUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import partTitle from "../../../index/components/commonTitle";
import videoAddress from "@/view/smokeDetector/smokeDetectorMap/components/videoAddress";
import * as echarts from "echarts"; // 引入echarts
import scrollTable from "./scroll";
import { getCameraURLList } from "@/api/wisdomMonitor";

export default {
  data() {
    return {
      title: "告警消息",
      bottomTitle: "摄像头预览",
      videoUrlData: [],
      videoUrl: ""
    };
  },
  props: {
    serialNumber: {
      type: String,
      default: ""
    }
  },
  components: {
    partTitle,
    scrollTable,
    videoAddress
  },
  mounted() {
    this.$nextTick(() => {
      this._getCameraURLList();
    })
  },
  methods: {
    _getCameraURLList() {
      let query = {};
      getCameraURLList(query).then(res => {
        if (res.code === "200") {
          if (res.data && res.data.length) {
            const { data } = res;
            this.videoUrlData = data;
          }
        }
      });
    }
  },
  watch: {
    serialNumber: {
      handler(newValue, oldValue) {
        let item = this.videoUrlData.filter(e => e.serialNumber === newValue);
        this.videoUrl = item[0].url;
        return this.videoUrl;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.rightTable {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 500px;
  height: calc(100% - 10px);
  background: url("../images/right_bg.png") center center no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  padding-top: 60px;
  z-index: 11;
  .rightLine {
    width: 100%;
    height: 300px;
  }
  .pieBox {
    margin-top: 25px;
    .pieChart {
      width: 100%;
      height: 300px;
      .videoContent {
        height: 100%;
        position: relative;
        overflow: hidden;
        #videoAddress {
          width: auto;
          position: absolute;
          top: -48px; /*no*/
          left: 10px; /*no*/
          right: 10px; /*no*/
          height: calc(100% + 96px); /*no*/
          bottom: -48px; /*no*/
        }
      }
    }
  }
}
</style>
