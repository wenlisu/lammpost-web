<template>
  <div id="cameraRight" :class="{'componentView': true, 'show': show}">
    <div class="part_1">
      <ChartTitle partTitle="摄像头人流量统计"/>
      <line-chart />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="摄像头告警消息"/>
      <CTable />
    </div>
  </div>
</template>
<script> 
import {
  mapGetters
} from 'vuex';
import ChartTitle from '../../components/chartTitle/index'
import lineChart from '../../components/camera/lineChart'
// 告警类型统计
import warnType from '../../components/camera/warnType'
import CTable from '../../components/camera/scroll'
export default {
  data () {
    return {
     
    };
  },
  components: {
    ChartTitle,
    lineChart,
    warnType,
    CTable
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  },
  created () {
  },
  destroyed () {
  }
};
</script>
<style lang="less">
#cameraRight {
  height: 100%;
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
    overflow: hidden;
  }
}
</style>
