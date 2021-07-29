<template>
  <div class="chargeStatistics">
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </div>
    <!-- <card>
      <el-row :gutter="10">
        <el-form :model="form" ref="form" label-width="100px" label-position="left">
          <el-col :span="4">
            <el-form-item label="月份:" label-width="60px">
              <el-date-picker
                v-model="value"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left: 10px;">
            <el-button type="primary">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
    </card> -->
    <div class="info-card">
      <el-row :gutter="10" class="list">
        <el-col :span="8">
          <div class="content">
            <div class="main-title">应</div>
            <ul>
              <li class="title">应缴费</li>
              <li class="charge">{{payStatus.waterMoney}}</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">实</div>
            <ul>
              <li class="title">实缴费</li>
              <li class="charge">{{payStatus.payMoney}}</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">未</div>
            <ul>
              <li class="title">未缴费总额</li>
              <li class="charge">{{payStatus.unPayMoney}}</li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="10" class="list2">
        <el-col :span="12">
          <div class="content">
            <div class="title">缴费方式</div>
            <div id="chart_1" class="chart"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content">
            <div class="title">缴费用户数分布</div>
            <div id="chart_2" class="chart"/>
          </div>
        </el-col>
      </el-row>
      <el-row class="list2">
        <el-col :span="24">
          <div class="content">
            <div class="title">收入分析</div>
            <div id="chart_3" class="chart"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import searchForm from 'components/adminSearchForm/searchForm';
import * as echarts from 'echarts';
import {
  getWaterChargeStats,
  getWaterChargePayWayStats,
  getWaterChargePayShapeStats,
  getWaterChargeInRevenueStats
} from 'api/water'
export default {
  components: {
    card,
    searchForm
  },
  data() {
    return {
      payStatus: {
        payMoney: null,
        waterMoney: null,
        unPayMoney: null
      },
      searchItems: [
        {
          type: 'monthPicker',
          label: '月份',
          initValue: '',
          props: {
            type: 'month',
            fieldName: 'month',
          },
          
        }
      ],
      searchVal: {},
      init_3_Chart: '',
      init_1_Chart: '',
      init_2_Chart: '',
    }
  },
  created() {
    this._getWaterChargeStats()
  },
  mounted() {
    this.initChart_1 ()
    this.initChart_2 ()
    this.initChart_3()
    this._getWaterChargePayShapeStats()
    this._getWaterChargeInRevenueStats()
    this._getWaterChargePayWayStats()
  },
  methods: {
    async initChart_3 () {
      let dom_3 = document.getElementById('chart_3');
      this.init_3_Chart = echarts.init(dom_3);
      const chartOptions = await this.getCharts_3_options();
      this.init_3_Chart.setOption(chartOptions)
    },
    async initChart_1 () {
      let dom_1 = document.getElementById('chart_1');
      this.init_1_Chart = echarts.init(dom_1);
      const chartOptions = await this.getpieOption();
      this.init_1_Chart.setOption(chartOptions)
    },
    async initChart_2 () {
      let dom_2 = document.getElementById('chart_2');
      this.init_2_Chart = echarts.init(dom_2);
      const chartOptions = await this.getpieOption();
      this.init_2_Chart.setOption(chartOptions)
    },
    getpieOption () {
      let color = ['#0E7CE2', '#00FFFF', '#4AEAB0', '#FF8352', '#E271DE', '#F8456B'];
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color: color,
        legend: {
          top: '0%',
          left: 'center'
        },
        series: []
      };

      return option;
    },
    // 默认初始图表
    getCharts_3_options () {
     const option = {
        backgroundColor: '#fff',
        color: ['#73DEB3'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                crossStyle: {
                    color: '#999'
                },
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        grid: {
            left: '25',
            right: '25',
            bottom: '24',
            top: '10',
            containLabel: true
        },
        legend: {
            data: ['缴费总额'],
            orient: 'horizontal',
            icon: "rect",
            show: true,
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            data: [],
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
              show: true,
              lineStyle:{
                color:'#999'
              }
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#999',
                textStyle: {
                    fontSize: 12
                },
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#F3F4F4'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle:{
                color:'#999'
              }
            },
        },
        series: [{
              name: '缴费总额',
              type: 'line',
              smooth: true,
              data: []
          }
        ]
      };

      return option
    },
    _getWaterChargeStats() {
      const params = {
        ...this.searchVal
      }
      getWaterChargeStats(params).then(res => {
        if(res.code == '200') {
          for(let key in this.payStatus) {
            this.payStatus[key] = res.data[key] || null
          }
        }
      })
    },
    // 缴费方式
    _getWaterChargePayWayStats () {
      const params = {
      }
      getWaterChargePayWayStats(params).then(res => {
        if(res.code == '200') {
          let data = res.data.map(item => {
            return {
              name: item.payWayText,
              value: item.payWay
            }
          })

          this.init_1_Chart.setOption({
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                    label: {
                      show: true,
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
              }
            ]
          })
        }
      })
    },
    _getWaterChargeInRevenueStats () {
      const  params = {
        dateInterval: 0
      }
      getWaterChargeInRevenueStats(params).then(res => {
        if(res.code == '200') {
          let axisData = res.data.map(item => {
            return item.simpleTime
          })
          let value = res.data.map(item => {
            return item.payMoney
          })
          let newOptions = {
            xAxis: {
              data: axisData,
            },
            series: [{
              name: '缴费总额',
              type: 'line',
              smooth: true,
              data: value
              }
            ]
          }
          this.init_3_Chart.setOption(newOptions)
        }
      })
    },
    // 缴费用户分布
    _getWaterChargePayShapeStats () {
      const params = {
      }
      getWaterChargePayShapeStats(params).then(res => {
        if(res.code == '200') {
          let data = [
            {
              name: '欠费',
              value: res.data.arrearsCount || 0
            },{
              name: '已缴费',
              value: res.data.payCount || 0
            },{
              name: '未缴费',
              value: res.data.totalCount || 0
            }
          ]
          this.init_2_Chart.setOption({
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                    label: {
                      show: true,
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
              }
            ]
          })
        }
      })
    },
    onSearch(val) {
      this.searchVal = {
        timeBegin: val.monthRange || ''
      }
      this._getWaterChargeStats()
    }
  },
}
</script>

<style lang="less" scoped>
.chargeStatistics {
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
  }
  .el-button {
    margin-left: 15px;
    border-radius: 0px;
    height: 30px;
    line-height: 0;
  }
  .el-button--primary {
    background-color: #2573f1 !important;
    border-color: transparent;
    border-radius: none !important;
    border-radius: unset;
    min-width: 70px;
    font-size: 14px;
  }
  .list {
    margin-top: 10px;/*no*/
    .content {
      display: flex;
      background: #fff;
      padding: 10px 15px;/*no*/
      align-items: center;
      .main-title {
        width: 50px;
        height: 50px;
        background: #409eff;
        border-radius: 100px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        color: #fff;
        margin-right: 20px;
      }
      ul {
        text-align: center;
        line-height: 40px;
        .title {
          font-size: 14px;
        }
        .charge {
          font-size: 20px;
        }
      }
    }
  }
  // echarts图表
  .list2{
    margin-top: 10px;/*no*/
    &::after{
      content: none;
    }
    .el-col{
      .content{
        background: #fff;
        margin-bottom: 10px;/*no*/
        padding: 10px 15px;/*no*/
        position: relative;
        .title{
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5F5F5F;
          margin-bottom: 15px;/*no*/
        }
      }
    }
    .chart{
      width: 100%;
      height: 300px;
      margin-top: 50px;
    }
    
  }
}
</style>