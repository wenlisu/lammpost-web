<template>
  <div id="LedLeft" :class="{ componentView: true, show: show }">
    <div class="part_1">
      <ChartTitle partTitle="LED显示屏今日播放情况分析" />
      <LedToday />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="LED显示屏应用场景情况分析" />
      <Application />
    </div>
  </div>
</template>

<script>
import ChartTitle from '../../components/chartTitle/index'
import LedToday from '../../components/LED/today'
import Application from '../../components/LED/application'
export default {
  components: {
    ChartTitle,
    LedToday,
    Application
  }
};
</script>

<style lang="less">
#LedLeft {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_1 {
    width: 100%;
    height: 50%;
  }
  .parat_2 {
    width: 100%;
    height: 50%;
  }
}
</style>