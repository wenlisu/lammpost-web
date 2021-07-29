<template>
  <div id="ledRight" :class="{ componentView: true, show: show }">
    <div class="part_1">
      <ChartTitle partTitle="LED显示屏近7天播放情况分析" />
      <LampUsage />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="LED显示屏本年度播放情况分析" />
      <LedYear />
    </div>
  </div>
</template>

<script>
import ChartTitle from '../../components/chartTitle/index'
import LedYear from '../../components/LED/year'
import LampUsage from '../../components/LED/week'
export default {
  components: {
    ChartTitle,
    LedYear,
    LampUsage
  }
};
</script>

<style lang="less">
#ledRight {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
   height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_1 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
  .parat_2 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
}
</style>