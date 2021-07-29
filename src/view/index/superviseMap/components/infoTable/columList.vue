<template>
  <!-- <vue-seamless-scroll
    :class-option="defaultOption"
    :data="tabledata"
    class="seamless-box"
  > -->
  <div>
    <div
      class="colum"
      v-for="(item, index) in tabledata"
      :key="index + item[0]"
    >
      <tableColum :config="config" :data="item" :index="index" />
    </div>
  </div>
  <!-- </vue-seamless-scroll> -->
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";
import tableColum from "./content";
import store from "@/store";
export default {
  components: {
    tableColum,
    vueSeamlessScroll,
  },
  props: {
    // 所有数据
    allData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格数据
    tabledata: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 行配置
    config: {
      type: Object,
      default: () => {
        return {
          columnWidth: [], // 列宽
          align: "center", // 对齐方式
          rowHeight: 60, // 行高
          oddRowBGC: "", //奇书行颜色
          evenRowBGC: "", //偶数行颜色
        };
      },
    },
  },
  computed: {
    defaultOption() {
      return {
        step: 0.2, // 数值越大速度滚动越快
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
  data() {
    return {
      activeIndex: -1,
    };
  },
  watch: {
    tabledata(newValue, oldValue) {
      // console.log(newValue);
    },
  },
  created() {
    // console.log(store);
  },
  methods: {
    mapPosition(reginID, index) {
      store.commit("set_toiltReginID", reginID);
      this.activeIndex = index;
      // console.log(this.allData[index]);
      this.$emit("mapPosition", {
        id: this.allData[index]["toiletId"],
        label: this.allData[index]["toiletName"],
        ...this.allData[index],
      });
    },
  },
};
</script>

<style scoped>
.table_content {
  display: flex;
  flex-direction: column;
}
.seamless-box {
  height: calc(100% - 30px);
  overflow: hidden;
}
</style>