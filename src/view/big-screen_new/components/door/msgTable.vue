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
import config, { baseURL } from "@/config";
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
      header: ["抓拍照片", "设备名称", "姓名", "识别类型", "识别时间"],
      tableData: [],
      columConfig: {
        oddRowBGC: "rgba(255,255,255,0.04)",
        evenRowBGC: "rgba(255,255,255,0.10)",
      },
      // config: {
      //   header: ["抓拍照片", "设备名称", "姓名", "识别类型", "识别时间"],
      //   data: [],
      //   headerBGC: "rgba(1,39,79,1)",
      //   oddRowBGC: "rgba(255,255,255,0.04)",
      //   evenRowBGC: "rgba(255,255,255,0.1)",
      //   headerHeight: "50",
      //   waitTime: 2000,
      //   carousel: "page",
      // },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let TableData = getLocal("bigScreenNew")["doorAccessPage"]["data"];
      if (TableData && TableData.length) {
        TableData.map((item) => {
          this.tableData.push([
            `<div style='width: 100%;height: 100%;padding: 10px 0'><img src=${
              baseURL || config.baseURL.dev
            }/upload/${
              item.closeupPic
            } style='width: 80%;height: 80%'></img></div>`,
            item.deviceModuleName,
            item.personName,
            item.matchTypeText,
            item.createTime,
          ]);
        });
      }
    },
  },
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
.imgBox {
  width: 57px;
  height: 40px;
  img {
    max-width: 100%;
  }
}
</style>