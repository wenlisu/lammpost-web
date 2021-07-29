<template>
  <!-- 统计分析 -->
  <pageMain idName="chargeStatisticAnalysis" :currentTitleList="currentTitleList">
    <!-- <div class="choose_date">
      <span class="tit">选择年份</span>
      <selector v-model="chooseDate" :options="dateOptions" @mounted="dateMounted" />
    </div>-->
    <div class="charge_serve">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="item module_1">
            <div class="item_title">充电服务</div>
            <div class="item_content">
              <div class="m1_item_1">
                <div>
                  <span class="num">{{data_1.serverCounts}}</span>
                  <span class="name">累计服务次数/次</span>
                </div>
              </div>
              <div class="m1_item_2">
                <div>
                  <span class="num">{{data_1.peopses}}</span>
                  <span class="name">累计服务用户数/个</span>
                </div>
              </div>
              <div class="m1_item_3">
                <div>
                  <span class="num">{{data_1.electricityCounts}}</span>
                  <span class="name">总充电量/度</span>
                </div>
              </div>
              <div class="m1_item_4">
                <div>
                  <span class="num">{{data_1.timeCounts}}</span>
                  <span class="name">总充电时长/小时</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="item module_2">
                <div class="item_title">设备功率</div>
                <div class="item_content">
                  <div class="m2_item_1">
                    <div class="m2_item_1_right"></div>
                    <div class="m2_item_1_left">
                      <div class="name">总功率</div>
                      <div class="val">
                        <span class="num">{{data_2.totalPower}}</span>
                        <span class="unit">万/kw</span>
                      </div>
                    </div>
                  </div>
                  <div class="m2_item_2">
                    <div class="m2_item_2_right"></div>
                    <div class="m2_item_2_left">
                      <div class="name">实时</div>
                      <div class="val">
                        <span class="num">{{data_2.nowPower}}</span>
                        <span class="unit">kw</span>
                      </div>
                    </div>
                  </div>
                  <div class="m2_item_3">
                    <div id="char_1"></div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item module_3">
                <div class="item_title">充电服务排名</div>
                <div class="item_content">
                  <div :class="`m3_item_${index+1}`" v-for="(item, index) in data_3" :key="index">
                    <div class="m3_item_1_title">
                      {{item.serialNumber}}
                      <div class="m3_item_1_total">{{item.counts}}次</div>
                    </div>
                    <div class="m3_item_1_time">累计充电次数{{item.counts}}次</div>
                    <div class="m3_item_1_count">枪数：{{1}}</div>
                  </div>
                  <!-- <div class="m3_item_2">
                    <div class="m3_item_1_title">
                      茂港充电站24小时对外充电桩
                      <div class="m3_item_1_total">87次</div>
                    </div>
                    <div class="m3_item_1_time">累计灯亮时长189个小时</div>
                    <div class="m3_item_1_count">枪数：34</div>
                  </div>
                  <div class="m3_item_3">
                    <div class="m3_item_1_title">
                      茂港充电站24小时对外充电桩
                      <div class="m3_item_1_total">87次</div>
                    </div>
                    <div class="m3_item_1_time">累计灯亮时长189个小时</div>
                    <div class="m3_item_1_count">枪数：34</div>
                  </div>-->
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="charge_revenue">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="item module_4">
            <div class="item_title">营收信息</div>
            <div class="item_content">
              <div class="money_count">
                <div class="money_count_subtit">累计总收入</div>
                <div class="money_count_val">
                  <span class="num" v-for="(item, index) in data_4.counts" :key="index">{{item}}</span>
                  <span class="unit">元</span>
                </div>
              </div>
              <div id="char_2"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="10">
            <el-col :span="24">
              <div class="item module_5">
                <div class="item_title">总收入趋势</div>
                <div class="item_content">
                  <div id="char_3"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="item module_6">
                <div class="item_title">故障情况</div>
                <div class="item_content">
                  <el-row>
                    <el-col :span="8">
                      <div class="m6_left">
                        <div class="m6_item_1">
                          <span class="m6_item_text">故障率</span>
                          <span class="m6_item_num">{{failureRateDto.rate}}</span>
                        </div>
                        <div class="m6_item_2">
                          <span class="m6_item_text">故障数</span>
                          <span class="m6_item_num">{{failureRateDto.bade}}</span>
                          <span class="m6_item_text">个</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div id="char_5"></div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </pageMain>
</template>
<script>
import * as echarts from 'echarts'; // 引入echarts
// import selector from '@/components/selector';
import {
  batteryBusinessIncome,
  batteryBusinessTotal,
  batteryFailureRate,
  batteryServiceStatistics,
  batteryPowerIndex,
  batteryTop10Dto
} from 'api/smartCharge/index';
import pageMain from 'components/pageMain';
export default {
  components: {
    pageMain
  },
  data () {
    return {
      // chooseDate: '',
      // selectorInstance: null,
      // dateOptions: [
      //   { label: '2020年', value: 1 },
      //   { label: '2021年', value: 2 },
      //   { label: '2022年', value: 3 },
      //   { label: '2023年', value: 4 }
      // ],
      data_1: {
        serverCounts: 0,
        peopses: 0,
        electricityCounts: 0,
        timeCounts: 0
      },
      data_2: {
        nowPower: 0,
        rate: 0,
        totalPower: 0
      },
      data_3: [],
      data_4: [],
      data_5: [],
      data_6: [],
      failureRateDto: {
        rate: 0,
        bade: 0
      },
      currentTitleList: [{
        name: 'chargeStatisticAnalysis',
        title: '充电统计分析'
      }]
    };
  },
  methods: {
    // dateMounted (instance) {
    //   this.selectorInstance = instance;
    // },
    init1 () {
      var dom_1 = document.getElementById('char_1');
      var myChart = echarts.init(dom_1);
      window.onresize = function () {
        myChart.resize();
      };
      var option = null;
      var total = this.data_2.totalPower; // 数据总数
      var datas = [this.data_2.nowPower];
      option = {
        xAxis: {
          max: total,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            inverse: false,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        grid: {
          left: 32,
          top: 1, // 设置条形图的边距
          right: 52,
          bottom: 1
        },
        series: [
          {
            // 内
            type: 'bar',
            barWidth: 34,
            legendHoverLink: false,
            silent: true,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  {
                    offset: 0,
                    color: '#3E45F0'
                  },
                  {
                    offset: 1,
                    color: '#31E5F5'
                  }
                ])
              }
            },
            label: {
              normal: {
                show: true,
                formatter: params => {
                  var text;
                  text = ((params.data / total) * 100).toFixed(2) + '%';
                  return text;
                },
                position: 'right',
                textStyle: {
                  fontWeight: 'bold',
                  fontSize: '24',
                  color: '#fff',
                  fontFamily: 'DINAlternate'
                }
              }
            },
            data: datas,
            z: 1,
            animationEasing: 'elasticOut'
          },
          {
            // 分隔
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: '#061348'
              }
            },
            symbolRepeat: 'fixed',
            symbolMargin: 3,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [1, 34],
            symbolPosition: 'start',
            symbolOffset: [1, '-2'],
            symbolBoundingData: this.total,
            data: datas,
            z: 2,
            animationEasing: 'elasticOut'
          },
          {
            // 外边框
            type: 'pictorialBar',
            symbol: 'rect',
            symbolBoundingData: total,
            itemStyle: {
              normal: {
                color: 'none'
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: datas,
            z: 0,
            animationEasing: 'elasticOut'
          },
          {
            name: '外框',
            type: 'bar',
            barGap: '-110%', // 设置外框粗细
            data: [total],
            barWidth: 43,
            itemStyle: {
              normal: {
                color: 'transparent', // 填充色
                barBorderColor: '#1C4B8E', // 边框色
                barBorderWidth: 1, // 边框宽度
                // barBorderRadius: 0, //圆角半径
                label: {
                  // 标签显示位置
                  show: false,
                  position: 'top' // insideTop 或者横向的 insideLeft
                }
              }
            },
            z: 0
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init2 () {
      var dom_2 = document.getElementById('char_2');
      var myChart = echarts.init(dom_2);
      window.onresize = function () {
        myChart.resize();
      };
      var option = null;
      let data = this.data_4.businessIncome;
      let legend = this.data_4.legend;
      let date = []; // 时间
      let weChat = []; // 微信
      let alipay = []; // 支付宝
      let card = []; // 充电
      let all = []; // 充电
      data.map(item => {
        date.push(item.date);
        weChat.push(item.weChat);
        alipay.push(item.alipay);
        card.push(item.card);
        all.push(100);
      });
      var color = ['#813CE4', '#52A7F9', '#04CEA8', '#FFD559'];
      option = {
        grid: {
          left: '0',
          right: '2%',
          bottom: '65px',
          containLabel: true
        },
        tooltip: {
          show: 'true',
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (prams) {
            //   console.log(prams);
            return `<div style="font-size:12px;">${prams[0].name}</div>
            <div style="font-size:12px;">${prams[0].seriesName}：${prams[0].data}</div>
            <div style="font-size:12px;">${prams[1].seriesName}：${prams[1].data}</div>
            <div style="font-size:12px;">${prams[2].seriesName}：${prams[2].data}</div>
            `;
          }
        },
        color: color,
        legend: {
          itemHeight: 14,
          itemWidth: 14,
          textStyle: { color: '#fff', fontSize: 12 },
          bottom: '21px',
          right: '26px',
          selectedMode: false
        },
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false // 隐藏Y轴刻度
            },
            axisLabel: {
              color: '#A0ACD8',
              fontSize: 12
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                width: 2,
                color: '#28335A'
              }
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            min: 0,
            max: 100,
            splitNumber: 6,
            splitLine: {
              lineStyle: {
                width: 2,
                color: '#28335A'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: true, // 坐标轴两边留白
          axisTick: {
            show: false // 隐藏Y轴刻度
          },
          axisLabel: {
            color: '#A0ACD8'
          },
          axisLine: {
            lineStyle: {
              color: '#28335A',
              width: 2
            }
          },
          data: date
        },
        series: [
          {
            name: legend[0],
            type: 'bar',
            barWidth: 38,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#7060FF'
                  },
                  {
                    offset: 1,
                    color: '#8D6CFF'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 2,
                borderColor: '#102362'
              }
            },
            data: weChat,
            zlevel: 2
          },
          {
            name: legend[1],
            type: 'bar',
            barWidth: 38,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#FFE96D'
                  },
                  {
                    offset: 1,
                    color: '#F7E150'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 2,
                borderColor: '#102362'
              }
            },
            data: alipay,
            zlevel: 2
          },
          {
            name: legend[2],
            type: 'bar',
            barWidth: 38,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#4EB1F9'
                  },
                  {
                    offset: 1,
                    color: '#6186FB'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 2,
                borderColor: '#102362'
              }
            },
            data: card,
            zlevel: 2
          },
          {
            name: '',
            type: 'bar',
            barWidth: '44px',
            xAxisIndex: 0,
            yAxisIndex: 1,
            barGap: '-108%',
            data: all,
            itemStyle: {
              normal: {
                color: '#010C39',
                borderWidth: 1,
                borderColor: '#102362'
              }
            },
            zlevel: 1
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init3 () {
      var dom_3 = document.getElementById('char_3');
      var myChart = echarts.init(dom_3);
      window.onresize = function () {
        myChart.resize();
      };
      var option = null;
      var data = this.data_5;
      var all = [];
      var xData = [];
      var yData = [];
      var min = 0;
      data.map(function (a, b) {
        xData.push(a.date);
        yData.push(a.prices);
        all.push(100);
      });
      option = {
        color: ['#4880FF', '#04CEA8'],
        tooltip: {
          show: 'true',
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (prams) {
            return `<div style="font-size:12px;">${prams[0].name}</div>
            <div style="font-size:12px;">${prams[0].seriesName}：${prams[0].data || 0}</div>`;
          }
        },
        legend: {
          data: ['充电'],
          itemHeight: 10,
          itemWidth: 10,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          top: '13px',
          right: '23px',
          selectedMode: false
        },
        grid: {
          left: '20px',
          right: '20px',
          bottom: '19px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 坐标轴两边留白
            gridIndex: 0,
            data: xData,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#28335A'
              }
            },
            axisLabel: {
              color: '#A0ACD8',
              fontSize: 12
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#0c3b71'
              }
            },
            axisLabel: {
              color: '#A0ACD8',
              fontSize: 12
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            splitNumber: 6,
            splitLine: {
              lineStyle: {
                width: 2,
                color: '#28335A'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '充电',
            type: 'bar',
            barWidth: '15px',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#8D6CFF'
                  },
                  {
                    offset: 1,
                    color: '#3980FF'
                  }
                ])
              }
            },
            data: yData,
            zlevel: 11
          },
          {
            name: '',
            type: 'bar',
            barWidth: '21px',
            xAxisIndex: 0,
            yAxisIndex: 1,
            barGap: '-120%',
            data: all,
            itemStyle: {
              normal: {
                color: '#1D2C62'
              }
            },
            zlevel: 9
          }
        ]
      };
      myChart.setOption(option, true);
    },
    init4 () {
      var dom_4 = document.getElementById('char_5');
      var myChart = echarts.init(dom_4);
      window.onresize = function () {
        myChart.resize();
      };
      var data = this.data_6;
      var date = [];
      var count = [];
      data.map((item, index) => {
        // if (index > 0) {
        date.push(item.date);
        count.push(Number(item.bade));
        // }
      });
      var option = null;
      option = {
        tooltip: {
          show: 'true',
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '20px',
          right: '30px',
          bottom: '30px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true, // 坐标轴两边留白
          axisTick: {
            show: false // 隐藏Y轴刻度
          },
          axisLabel: {
            color: '#A0ACD8'
          },
          axisLine: {
            lineStyle: {
              color: '#28335A',
              width: 2
            }
          },
          data: date
        },
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false // 隐藏Y轴刻度
            },
            axisLabel: {
              color: '#A0ACD8',
              fontSize: 12
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                width: 2,
                color: '#28335A'
              }
            }
          }
        ],
        series: [
          {
            name: '故障数量',
            type: 'line',
            data: count,
            symbolSize: 2,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FF9883' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#FF4946' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //         offset: 0,
                //         color: "#FF9883"
                //     },
                //     {
                //         offset: 1,
                //         color: "#FF4946"
                //     }
                // ])
              }
            },
            smooth: true
          }
        ]
      };
      myChart.setOption(option, true);
    },
    // 充电服务
    _batteryBatteryServiceStatistics () {
      batteryServiceStatistics().then(res => {
        const { data } = res;
        this.data_1 = data;
      });
    },
    // 营收信息
    _batteryBatteryBusinessIncome () {
      batteryBusinessIncome().then(res => {
        const { data } = res;
        this.data_4 = data;
        this.data_4.counts = data.counts.split('');
        this.$nextTick(() => {
          this.init2();
        });
      });
    },
    // 充电桩服务排名
    _batteryTop10Dto () {
      batteryTop10Dto().then(res => {
        const { data } = res;
        this.data_3 = [];
        data.map((item, index) => {
          if (index < 3) {
            this.data_3.push(item);
          }
        });
      });
    },
    // 总收入趋势
    _batteryBatteryBusinessTotal () {
      batteryBusinessTotal().then(res => {
        const { data } = res;
        this.data_5 = data;
        this.$nextTick(() => {
          this.init3();
        });
      });
    },
    // 故障率
    _batteryBatteryFailureRate () {
      batteryFailureRate().then(res => {
        const { data } = res;
        this.data_6 = data.failureRateDtos;
        this.failureRateDto = data.failureRateDto;
        this.$nextTick(() => {
          this.init4();
        });
      });
    },
    // 设备功率
    _batteryPowerIndex () {
      batteryPowerIndex().then(res => {
        const { data } = res;
        this.data_2 = data;
        this.$nextTick(() => {
          this.init1();
        });
      });
    }
  },
  mounted () {
    // this.$nextTick(() => {
    // this.init1();
    // this.init2();
    // this.init3();
    // this.init4();
    // });
  },
  created () {
    this._batteryBatteryServiceStatistics();
    this._batteryPowerIndex();
    this._batteryTop10Dto();
    this._batteryBatteryBusinessIncome();
    this._batteryBatteryBusinessTotal();
    this._batteryBatteryFailureRate();
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
#chargeStatisticAnalysis {
  overflow: auto;
  color: #e6ecff;
  //   .choose_date {
  //     padding: 0 0 10px 0;
  //     .tit {
  //       font-size: 12px;
  //       font-family: PingFangSC-Regular, PingFang SC;
  //       font-weight: 400;
  //       padding-right: 10px;
  //     }
  //     .el-select {
  //       width: 110px;
  //       height: 30px;
  //       display: inline-block;
  //       /deep/.el-input__inner,
  //       .el-input__inner:focus {
  //         color: #e6ecff;
  //         border: 1px solid #6275bf !important;
  //         background: rgba(34, 44, 81, 1);
  //         border-radius: 4px;
  //         outline: none;
  //       }
  //     }
  //   }
  .charge_serve {
    .module_1 {
      .item_content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 48px 0 60px 0;
        .m1_item_1,
        .m1_item_2,
        .m1_item_3,
        .m1_item_4 {
          width: 187px;
          height: 186px;
          div {
            margin-top: 70px;
          }
          span {
            display: block;
            text-align: center;
          }
          .num {
            height: 32px;
            font-size: 28px;
            font-family: DINAlternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 32px;
            letter-spacing: 1px;
            background: linear-gradient(
              180deg,
              rgba(238, 238, 238, 1) 0%,
              rgba(207, 225, 255, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .name {
            height: 17px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 17px;
          }
        }
      }
      .m1_item_1 {
        background: url(~common/images/smartCharge/m1_item_1.png) no-repeat;
        background-size: contain;
      }
      .m1_item_2 {
        background: url(~common/images/smartCharge/m1_item_2.png) no-repeat;
        background-size: contain;
      }
      .m1_item_3 {
        background: url(~common/images/smartCharge/m1_item_3.png) no-repeat;
        background-size: contain;
      }
      .m1_item_4 {
        background: url(~common/images/smartCharge/m1_item_4.png) no-repeat;
        background-size: contain;
      }
    }
    .module_2 {
      .item_content {
        .m2_item_1 {
          margin-top: 38px;
          margin-bottom: 32px;
          .m2_item_1_right {
            width: 43px;
            height: 49px;
            background: rgba(33, 42, 76, 1);
            border-radius: 5px;
            margin-right: 15px;
            display: inline-block;
            vertical-align: middle;
            position: relative;
          }
          .m2_item_1_right::after {
            width: 35px;
            height: 11px;
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -5px;
            margin-left: -17.5px;
            background: url(~common/images/smartCharge/m2_item_1.png) no-repeat;
            background-size: contain;
          }
          .m2_item_1_left {
            display: inline-block;
            vertical-align: middle;
            .name {
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 17px;
            }
            .val {
              .num {
                height: 32px;
                font-size: 28px;
                font-family: DINAlternate;
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
                line-height: 32px;
              }
              .unit {
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(160, 172, 216, 1);
                line-height: 17px;
              }
            }
          }
        }
        .m2_item_2 {
          margin-bottom: 32px;
          .m2_item_2_right {
            width: 43px;
            height: 49px;
            background: rgba(33, 42, 76, 1);
            border-radius: 5px;
            margin-right: 15px;
            display: inline-block;
            vertical-align: middle;
            position: relative;
          }
          .m2_item_2_right::after {
            width: 35px;
            height: 11px;
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -5px;
            margin-left: -17.5px;
            background: url(~common/images/smartCharge/m2_item_2.png) no-repeat;
            background-size: contain;
          }
          .m2_item_2_left {
            display: inline-block;
            vertical-align: middle;
            .name {
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 17px;
            }
            .val {
              .num {
                height: 32px;
                font-size: 28px;
                font-family: DINAlternate;
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
                line-height: 32px;
              }
              .unit {
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(160, 172, 216, 1);
                line-height: 17px;
              }
            }
          }
        }
        .m2_item_3 {
          #char_1 {
            height: 95px;
          }
        }
      }
    }
    .module_3 {
      .item_content {
        padding: 22px 22px 37px 22px;
        .m3_item_1,
        .m3_item_2,
        .m3_item_3 {
          margin-bottom: 22px;
          padding-left: 35px;
          position: relative;
          .m3_item_1_title {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(215, 224, 255, 1);
            text-shadow: 0px 2px 4px rgba(9, 18, 62, 0.7);
            margin-bottom: 4px;
          }
          .m3_item_1_time,
          .m3_item_1_count {
            height: 17px;
            font-size: 12px;
            padding-left: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(159, 173, 224, 1);
            line-height: 17px;
            position: relative;
          }
          .m3_item_1_time::after {
            width: 6px;
            height: 6px;
            content: "";
            position: absolute;
            top: 50%;
            margin-top: -3px;
            left: 0;
            background: rgba(74, 224, 103, 1);
          }
          .m3_item_1_count::after {
            width: 6px;
            height: 6px;
            content: "";
            position: absolute;
            top: 50%;
            margin-top: -3px;
            left: 0;
            background: rgba(241, 167, 55, 1);
          }
          .m3_item_1_total {
            float: right;
            padding: 0 9px;
            height: 17px;
            line-height: 17px;
            background: rgba(238, 82, 41, 1);
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5),
              0px -1px 10px 0px rgba(255, 24, 38, 1);
            border-radius: 13px;
          }
          .m3_item_1_total::after {
            display: "block";
            clear: both;
            height: 0;
            content: "";
            visibility: hidden;
            overflow: hidden;
          }
        }
        .m3_item_1::after {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          content: "1";
          width: 19px;
          height: 19px;
          background: rgba(29, 41, 87, 1);
          border: 2px solid rgba(72, 128, 255, 1);
          text-align: center;
          line-height: 19px;
        }
        .m3_item_2::after {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          content: "2";
          width: 19px;
          height: 19px;
          background: rgba(29, 41, 87, 1);
          border: 2px solid rgba(28, 217, 192, 1);
          text-align: center;
          line-height: 19px;
        }
        .m3_item_3::after {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          content: "3";
          width: 19px;
          height: 19px;
          background: rgba(29, 41, 87, 1);
          border: 2px solid rgba(217, 150, 28, 1);
          text-align: center;
          line-height: 19px;
        }
        .m3_item_1::before {
          height: 67px;
          width: 1px;
          background: #556174;
          content: "";
          top: 19px;
          left: 12px;
          margin-left: -1px;
          position: absolute;
        }
        .m3_item_3::before {
          height: 53px;
          width: 1px;
          background: #556174;
          content: "";
          top: -53px;
          left: 12px;
          margin-left: -1px;
          position: absolute;
        }
      }
    }
  }
  .charge_revenue {
    .module_4 {
      .item_content {
        .money_count {
          .money_count_subtit {
            padding: 22px 0 8px 0;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(160, 172, 216, 1);
          }
          .money_count_val {
            .num {
              display: inline-block;
              vertical-align: middle;
              padding: 8px 8px 8px 11px;
              margin-right: 5px;
              font-size: 28px;
              font-family: DINAlternate;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 24px;
              letter-spacing: 1px;
              text-shadow: 0px 2px 4px rgba(87, 87, 87, 0.5);
              background: rgba(32, 52, 94, 1);
              border: 1px solid rgba(42, 55, 116, 1);
            }
            .unit {
              display: inline-block;
              vertical-align: bottom;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
        #char_2 {
          height: 532px;
        }
      }
    }
    .module_5 {
      .item_content {
        #char_3 {
          height: 290px;
        }
      }
    }
    .module_6 {
      margin-bottom: 0;
      .item_content {
        .m6_left {
          display: inline-block;
          vertical-align: top;
          width: 200px;
          height: 200px;
          margin: 40px 70px 0 60px;
          background: url(~common/images/smartCharge/m6_item.png) no-repeat;
          background-size: contain;
          user-select: none;
          .m6_item_1 {
            margin-top: 63px;
            margin-bottom: 9px;
            // margin-left: 55px;
            text-align: center;
            .m6_item_text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 12px;
            }
            .m6_item_num {
              font-size: 32px;
              font-family: DINAlternate;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 32px;
              background: linear-gradient(
                180deg,
                rgba(142, 168, 249, 1) 0%,
                rgba(161, 131, 246, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
          .m6_item_2 {
            // margin-left: 55px;
            text-align: center;
            .m6_item_text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 12px;
            }
            .m6_item_num {
              font-size: 32px;
              font-family: DINAlternate;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 32px;
              background: linear-gradient(
                180deg,
                rgba(66, 172, 235, 1) 0%,
                rgba(113, 114, 229, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
        #char_5 {
          display: inline-block;
          vertical-align: top;
          width: 560px;
          height: 293px;
        }
      }
    }
  }
  .item {
    background: rgba(32, 45, 85, 0.49);
    border-radius: 4px;
    padding: 7px 5px;
    margin-bottom: 10px;
  }
  .item_title {
    position: relative;
    padding-left: 44px;
  }
  .item_title::after {
    width: 26px;
    height: 13px;
    content: "";
    position: absolute;
    left: 10px;
    top: 1px;
    background: url(~common/images/smartCharge/tit_bg.png) no-repeat;
    background-size: contain;
  }
}
</style>
