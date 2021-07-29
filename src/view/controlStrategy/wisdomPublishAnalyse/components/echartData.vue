<template>
  <div id="echartData" @click="onClick">
    <card :title="userOptions.title" :labers="userOptions.labers">
      <div :ref="id" id="echartTable" />
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
      default: '450px'
    },
    userOptions: {
      type: Object,
      default: () => {}
    },
    onClick: {
      type: Function,
      default: () => {}
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
      let _this = this
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

<style lang="less">
  #echartData {
    width: 100%;
    // background: rgba(32,45,85,.49);
    position: relative;

    #chart {
      width: 100%;
      height: 450px;
    }

    #echartTable {
      height: 450px;
    }
  }
</style>
