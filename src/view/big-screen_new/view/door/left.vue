<template>
  <div id="doorLeft" :class="{'componentView': true, 'show': show}">
    <div class="part_1">
      <ChartTitle partTitle="门禁今日进出人流量统计"/>
      <DoorTraffic />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="门禁验证通过类型情况"/>
      <DoorPass />
    </div>
  </div>
</template>

<script>
import ChartTitle from '../../components/chartTitle/index'
import DoorTraffic from '../../components/door/trafficStatistics'
import DoorPass from '../../components/door/pass'
export default {
  components: {
    ChartTitle,
    DoorTraffic,
    DoorPass
  }
}
</script>

<style lang="less">
#doorLeft {
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