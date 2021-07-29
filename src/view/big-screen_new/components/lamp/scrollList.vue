<template>
  <vue-seamless-scroll :class-option="defaultOption" :data="dataList" class="seamless-box">
    <div v-for="(item, index) in dataList" :key="index">
      <item :itemInfo="item" :index="index"/>
    </div>
  </vue-seamless-scroll>
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";
import item from './scrollItem'
import { getLocal } from "util/tool";
export default {
  components: {
    vueSeamlessScroll,
    item
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
      dataList: [],
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData () {
      let dataList = getLocal("bigScreenNew")["lampRanking"][
        "lampStaticsFaultDto"
      ];
      if(dataList) {
        this.dataList = [...dataList]
      }
    }
  },
};
</script>

<style scoped>
.seamless-box {
  height: calc(100% - 50px);
  overflow: hidden;
  margin-top: 5px;
}
</style>