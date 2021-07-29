<template>
  <div class="scrollTable">
    <!-- <dv-scroll-board :config="config" style="width: 100%; height: 350px" /> -->
    <tableHeader :header="header" :config="headerConfig" />
    <div class="scroll_body">
      <vue-seamless-scroll :class-option="defaultOption" :data="tableData">
        <tableColumList :tabledata="tableData" :config="columConfig" />
      </vue-seamless-scroll>
    </div>
  </div>
</template>

<script>
import { getLocal } from "util/tool";
// import config, { baseURL } from "@/config";
import tableHeader from "../scrollTable/header";
import tableColumList from "../scrollTable/columList";
import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  components: {
    tableHeader,
    tableColumList,
    vueSeamlessScroll,
  },
  computed: {
    defaultOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  data() {
    return {
      headerConfig: {
        headerHeight: 50,
      },
      header: ["设备名称", "报警位置", "开始时间", "结束时间"],
      tableData: [],
      columConfig: {
        oddRowBGC: "rgba(255,255,255,0.04)",
        evenRowBGC: "rgba(255,255,255,0.10)",
      },
      config: {
        header: ["设备名称", "报警位置", "开始时间", "结束时间"],
        data: [],
        headerBGC: "rgba(1,39,79,1)",
        oddRowBGC: "rgba(255,255,255,0.04)",
        evenRowBGC: "rgba(255,255,255,0.1)",
        headerHeight: "50",
        waitTime: 2000,
        carousel: "page"
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let tableData = getLocal("bigScreenNew")["alarmCallRecordForPage"][
        "data"
      ];
      if (tableData && tableData.length) {
        tableData.map(item => {
          this.tableData.push([
            item.deviceName,
            // item.installAddress,
            '禅城文华公园',
            item.callTime,
            item.finishedTime
          ]);
        });
      }
    }
  }
};
</script>

<style lang="less">
// .dv-scroll-board {
//   .header {
//     box-shadow: 0px 0px 8px 0px #00656c inset;
//     color: #c0d2ff;
//     font-size: 14px;
//     font-family: PingFangSC;
//     font-weight: 600;
//     line-height: 12px;
//   }
//   .row-item[style] {
//     height: 70px !important;
//     line-height: 70px !important;
//   }
// }
// .imgBox {
//   width: 60px;
//   img {
//     max-width: 100%;
//   }
// }

.scrollTable {
  height: 100%;
  .scroll_body {
    height: calc(100% - 50px);
    overflow: hidden;
  }
}
</style>
