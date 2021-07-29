<template>
  <div id="echartData" @click="onClick">
    <card :title="userOptions.title" :labers="userOptions.labers">
      <div class="charTitle" v-if="isTime">
        <slot name="time" />
      </div>
      <div :ref="id" id="echartTable" :style="{height: height}"/>
    </card>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import card from './card';
export default {
  name: 'echartData',
  data () {
    return {};
  },
  props: {
    id: '',
    height: {
      type: [String, Number],
      default: '100%'
    },
    userOptions: {
      type: Object,
      default: () => {}
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    isTime: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    propsUpdate () {
      const {
        userOptions
      } = this;
      return {
        userOptions
      };
    }
  },
  watch: {
    propsUpdate: {
      deep: true,
      handler (newval, oldval) {
        if (newval) {
          this.$nextTick(() => {
            this.init();
          });
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  components: {
    card
  },
  methods: {
    init () {
      let _this = this;
      var myChart = echarts.init(this.$refs[this.id]);
      myChart.setOption(this.userOptions.options);
      myChart.on('click', function (param) {
        _this.clickChart(param)
      });
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    clickChart (param) {
      this.$emit('click', param)
    }
  }
};
</script>

<style lang="less" scoped>
  #echartData {
    width: 100%;
    // background: rgba(32,45,85,.49);
    position: relative;
    #card {
      height: 100%;
    }
    #chart {
      width: 100%;
      height: 450px;
    }

    #echartTable {
      // height: 450px;
      height: 100%;
    }

    .charTitle{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      >.flexRow{
        background: #273875;
        border-radius: 5px;/*no*/
        padding: 2px;/*no*/
      }
      span{
        width: auto;/*no*/
        height: auto;/*no*/
        display: flex;
        padding: 3px 20px;/*no*/
        align-items: center;
        justify-content: center;
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #7383B2;
        cursor: pointer;
        &.is-active{
          background: linear-gradient(277deg, #25A8CB 0%, #58A0FF 100%);
          border-radius: 4px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }
      }
    }
  }
</style>
