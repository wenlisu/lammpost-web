<!-- 饼图1 -->
<template>
  <div class="pieChart1_chart_item">
    <div :id="chartId" class="pieChart1_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "pieChart1",
    props: {
      chartData: {
        type: Array,
        default () {
          return [];
        }
      },
      chartId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {};
    },
    mounted() {
      this.initpieChart1();
    },
    methods: {
      initpieChart1() {
        this.pieChart1 = echarts.init(document.getElementById(this.chartId));
        this.pieChart1.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.pieChart1.resize(), true)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        //计算传过来的参数
        let nameList = []; //x左边值
        let dataOneList = []; //数据
        let dataTwoList = []; //数据
        for (var i = 0; i < newValue.length; i++) {
          nameList.push(newValue[i].name);
          if (newValue[i].value[0] == undefined || newValue[i].value[0] == null) {
            dataOneList.push(0)
          } else {
            dataOneList.push(newValue[i].value[0]);
          }
          if (newValue[i].value[1] == undefined || newValue[i].value[1] == null) {
            dataTwoList.push(0)
          } else {
            dataTwoList.push(newValue[i].value[1]);
          }
        }
        // 数据模拟展示，后面可直接删除
        /* nameList = ['数字电器', '以太网专线', 'MPLS-VPN', '互联网专线(DIA)', '语音中继电路', '裸光纤', '数据基础'];
        dataOneList = [1800, 1800, 1800, 1800, 1800, 1800, 1800];
        dataTwoList = [1300, 1300, 1300, 1300, 1300, 1300, 1300]; */

        // 数据格式模板
        var data;
        if(newValue.length!=0){
          data = newValue;
        }else{
          data = [{
              name: '正常',
              value: 90
            },
            {
              name: '故障',
              value: 10
            }
          ];
        }
         

        //初始化数据
        var option = {
          backgroundColor: 'rgba(128, 128, 128, 0)',
          color: ['#05FF98', '#FFD853'],
          legend: {
            itemHeight: 8,
            itemWidth: 20,
            orient: 'vertical',
            top: 'center',
            right: 50,
            textStyle: {
              fontSize: 14, //字体大小
              color: ['#05FF98', '#FFD853']
            }
          },
          graphic: {
            type: 'text',
            left: '150',
            top: 'center',
            style: {
              text: '灯杆',
              fontSize: 16,
              fontWeight: 400,
              fill: '#FFFFFF'
            }
          },
          series: [{
            type: 'pie',
            center: ['55%', '50%'],
            radius: [45, 55],
            startAngle: 40, //起始角度
            width: 300,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgba(128, 128, 128, 0)',
              borderWidth: 5
            },
            label: {
              formatter: '{name|{b}} {d}%\n',
              borderWidth: 18,
              borderRadius: 4,
              padding: [0, -60],
              rich: {

              }
            },
            labelLine: {
              length: 10,
              length2: 62,
            },
            data: data
          }]
        };
        this.pieChart1.hideLoading();
        this.pieChart1.setOption(option);
        /* this.pieChart1.dispatchAction({
          type: 'highlight',
          name: '故障'
        }); */
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .pieChart1_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -30px;
    left: 0px;

    .pieChart1_chart {
      height: 200px;
    }
  }
</style>
