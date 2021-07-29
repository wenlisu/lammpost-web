<template>
  <div class="energyAnalysis">
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </div>
    <card>
      <div class="comsumptionWrap">
        <div class="totalConsumption">
          <div class="content">
            <div class="img">
              <!-- <img src="~@/common/images/login_03.jpg" alt=""> -->
            </div>
            <ul class="item">
              <li class="titleWrap">
                <span style="font-size:14px; font-weight: bold">{{totalConsum.address}}</span>
                <div>
                  <span :class="{'yearMonth': true, 'clickBackgrond': consumTime}" @click="changeYearConsum">年</span>
                  <span :class="{'yearMonth': true, 'clickBackgrond': !consumTime}" @click="changeMonthConsum">月</span>
                </div>
              </li>
              <li class="commonLi">
                <span>{{conusumFlag == 'Y' ? new Date().getFullYear() + '年总能耗：' : new Date().getMonth() + 1 + '月总能耗：'}}</span>
                <span>{{totalConsum.consum}}元</span>
              </li>
              <li class="commonLi">
                <span>{{conusumFlag == 'Y' ? new Date().getFullYear() + '年总收费：' : new Date().getMonth() + 1 + '月总收费：'}}</span>
                <span>{{totalConsum.pay}}元</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="waterElectricity">
          <ul class="ymWrap">
            <li :class="{'yearMonth': true, 'clickBackgrond': HydropowerTime}" @click="changeYearHydropower">年</li>
            <li :class="{'yearMonth': true, 'clickBackgrond': !HydropowerTime}" @click="changeMonthHydropower">月</li>
          </ul>
          <ul class="water">
            <li style="font-size:14px; font-weight: bold; margin-bottom: 20px;">水</li>
            <li class="commonLi">
              <span>{{HydropowerFlag == 'Y' ? '本年用水量：' : '本月用水量：'}}</span>
              <span>{{waterConsum.consum}}</span>
            </li>
            <li class="commonLi">
              <span>{{HydropowerFlag == 'Y' ? '本年用水费：' : '本月用水费：'}}</span>
              <span>{{waterConsum.pay}}</span>
            </li>
          </ul>
          <i class="line"></i>
          <ul class="electricity">
            <li style="font-size:14px; font-weight: bold; margin-bottom: 20px;">电</li>
            <li class="commonLi">
              <span>{{HydropowerFlag == 'Y' ? '本年用电量：' : '本月用电量：'}}</span>
              <span>8327374.09</span>
            </li>
            <li class="commonLi">
              <span>{{HydropowerFlag == 'Y' ? '本年用电费：' : '本月用电费：'}}</span>
              <span>2536374.09</span>
            </li>
          </ul>
        </div>
      </div>
    </card>
    <div>
      <el-row :gutter="10" class="list2">
        <el-col :span="12">
          <div class="content">
            <div class="title">楼栋能耗对比分析</div>
            <div class="controller">
              <span :class="{'isActive': barId == 6}" @click="changebar(6)">日</span>
              <span :class="{'isActive': barId == 4}" @click="changebar(4)">月</span>
              <span :class="{'isActive': barId == 1}" @click="changebar(1)">年</span>
            </div>
            <div id="chart_1" class="chart"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content">
            <div class="title">费用占比分析</div>
            <div id="chart_2" class="chart"/>
          </div>
        </el-col>
      </el-row>
      <el-row class="list2">
        <el-col :span="24">
          <div class="content">
            <div class="title">{{buildingName}}能耗用量统计分析</div>
            <div class="controller">
              <span :class="{'isActive': trendId == 6}" @click="changeTrend(6)">日</span>
              <span :class="{'isActive': trendId == 4}" @click="changeTrend(4)">月</span>
              <span :class="{'isActive': trendId == 1}" @click="changeTrend(1)">年</span>
            </div>
            <div id="chart_3" class="chart"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import treeselect from '../tree';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import searchForm from 'components/adminSearchForm/searchForm';
import * as echarts from 'echarts';
import {
  getWaterConsumptionStatsByBuilding,
  getWaterChargeInRevenueStats
} from 'api/water'
import {
  getParkDeviceTree
} from 'api/index';
export default {
  components: {
    card,
    searchForm
  },
  data () {
    return {
      waterConsum: {
        consum: null,
        pay: null
      },
      totalConsum: {
        address: '',
        consum: null,
        pay: null
      },
      searchItems: [
        {
          type: 'treeselect',
          label: '位置',
          initValue: '',
          props: {
            fieldName: 'streetCode',
            options: [],
          },
          callback: (action, parentNode, callback) => { return this.loadOptions(action, parentNode, callback)}
        }
      ],
      location: '',
      barId: 4,
      trendId: 4,
      conusumFlag: 'Y',
      HydropowerFlag: 'Y',
      consumTime: true,
      HydropowerTime: true,
      searchInfo: null,
      form: {},
      init_1_Chart: null,
      init_2_Chart: null,
      init_3_Chart: null,
      searchVal: {},
      barCode: '',
      buildingName: ''
    }
  },
  created () {
    
  },
  mounted () {
    this.init_1()
    this.init_2()
    this.init_3()
    this._getParkDeviceTree()
  },
  methods: {
    async loadOptions(action, parentNode, callback) {
      let data = {
        parentNodeCode: parentNode.id,
        deviceTypeNo: 'WATER_METER'
      }
      if(action == 'LOAD_CHILDREN_OPTIONS') {
        this.loadChildren(data, parentNode, callback)
      }
    },
    async loadChildren(data, parentNode, callback) {
      let treeData = [];
      await getParkDeviceTree(data).then(res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            let children = null;
            if(daItem.nodeLevel == 5) {
              return {
                id: daItem['nodeCode'],
                label: daItem['nodeName'],
                leaf: true
              }
            }
            return {
              id: daItem['nodeCode'],
              label: daItem['nodeName'],
              children
            }
          });
          parentNode.children = treeData
          callback()
        }
      })
    },
    async _getParkDeviceTree (data = {parentNodeCode: '0',deviceTypeNo: 'WATER_METER'}) {
      let treeData = [];
      await getParkDeviceTree(data).then(async res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            return {
              id: daItem['nodeCode'],
              label: daItem['nodeName'],
              children: null
            }
          });
          this.searchItems[0].props.options = treeData
          this.searchItems[0].initValue = treeData[0].id || ''
          this.totalConsum.address = treeData[0].label || ''
          this.searchVal = {
            streetCode: treeData[0].id || ''
          }
          this._getWaterConsumptionStatsByBuilding() //图表
          this._getWaterTotleConsumption()
          this._getWaterChargeInRevenueStats()
          this._getWaterConsumption()
          this. _getWaterCharge()
          this.chart_2_data()
        }
      });
      // return treeData;
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this._getWaterChargeInRevenueStats()
      this._getWaterConsumptionStatsByBuilding()
      this._getWaterTotleConsumption()
      this._getWaterConsumption()
      this. _getWaterCharge()
    },
    // 总收费
    _getWaterChargeInRevenueStats() {
      const  params = {
        ...this.searchVal,
        dateInterval: this.conusumFlag == 'M' ? 4 : 1
      }
      getWaterChargeInRevenueStats(params).then(res => {
        if(res.code == '200') {
          this.totalConsum['pay'] = res.data.length ? res.data[0].payMoney : ''
        }
      })
    },
    // 费用占比分析
    chart_2_data () {
      const  params = {
        ...this.searchVal,
        dateInterval: this.conusumFlag == 'M' ? 4 : 1
      }
      getWaterChargeInRevenueStats(params).then(res => {
        if(res.code == '200') {
          let data = [
            {
              name: '水费',
              value: res.data.payMoney || 0
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
    // 能耗用量统计分析
    chart_3_data () {
      const params = {
        streetCode: this.barCode || '',
        facet: 2,
        dateInterval: this.trendId,
      }
      getWaterConsumptionStatsByBuilding(params).then(res => {
        if(res.code == '200') {
          let axisData = res.data.map(item => {
            return item.statsTime
          })
          let value = res.data.map(item => {
            return item.readingValue
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
    // 本年、本月用水收费
    _getWaterCharge() {
      const  params = {
        ...this.searchVal,
        dateInterval: this.HydropowerFlag == 'M' ? 4 : 1
      }
      getWaterChargeInRevenueStats(params).then(res => {
        if(res.code == '200') {
          this.waterConsum['pay'] = res.data.length ? res.data[0].payMoney : ''
        }
      })
    },
    // 楼栋能耗对比分析
    _getWaterConsumptionStatsByBuilding() {
      const params = {
        ...this.searchVal,
        dateInterval: this.barId,
        facet: 2
      }
      getWaterConsumptionStatsByBuilding(params).then(res => {
        if(res.code == '200') {
          let waterValue = []
          let eleValue = []
          let axisData = res.data.map(item => {
            return item.buildingName
          })
          res.data.map(item => {
            waterValue.push({
              value: item.readingValue || 0,
              id: item.streetCode
            })
            eleValue.push(0)
          })
          this.init_1_Chart.setOption({
            xAxis: {
              data: axisData
            },
            series: [
              {
                name: '用水量',
                type: 'bar',
                data: waterValue
              },
              {
                name: '用电量',
                type: 'bar',
                data: eleValue
              }
            ]
          })
          this.barCode = waterValue[0] ? waterValue[0]['id'] : ''
          this.buildingName = res.data[0] ? res.data[0]['buildingName'] : ''
          this.chart_3_data()
        }
      })
    },
    // 总能耗
    _getWaterTotleConsumption() {
      const params = {
        ...this.searchVal,
        facet: this.conusumFlag == 'M' ? 1 : 0
      }
      getWaterConsumptionStatsByBuilding(params).then(res => {
        if(res.code == '200') {
          this.totalConsum['consum'] = res.data.length ? res.data[0].readingValue : ''
        }
      })
    },
    // 本年、本月用水总量
    _getWaterConsumption() {
      const params = {
        ...this.searchVal,
        facet: this.HydropowerFlag == 'M' ? 1 : 0
      }
      getWaterConsumptionStatsByBuilding(params).then(res => {
        if(res.code == '200') {
          this.waterConsum['consum'] = res.data.length ? res.data[0].readingValue : ''
        }
      })
    },
    async init_1 () {
      let dom_1 = document.getElementById('chart_1');
      this.init_1_Chart = echarts.init(dom_1);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip
        },
        legend: {
          ...chartOptions.legend,
          data: ['用水量', '用电量']
        },
        xAxis: {
          ...chartOptions,
          data: []
        },
        yAxis: [
          {
            ...chartOptions.yAxis[0]
          }
        ],
        series: [
          {
            name: '用水量',
            type: 'bar',
            data: [],
            barWidth: 8,
            itemStyle: {
              normal: {
                show: true,
                color: '#48F7B2'
              }
            },
          },
          {
            name: '用电量',
            type: 'bar',
            data: [],
            barWidth: 8,
            itemStyle: {
              normal: {
                show: true,
                color: '#3FB9FF'
              }
            },
          }
        ]
      }
      this.init_1_Chart.setOption(option)
      let _this = this
      this.init_1_Chart.on('click', function(data){
        _this.barCode = data.data.id
        _this.buildingName = data.name
        _this.chart_3_data()
      })
      window.onresize = function () {
        // this.init_1_Chart.resize();
      };
    },
    async init_2 () {
      let dom_2 = document.getElementById('chart_2');
      this.init_2_Chart = echarts.init(dom_2);
      const chartOptions = await this.getpieOption();
      this.init_2_Chart.setOption(chartOptions)
    },
    async init_3 () {
      let dom_3 = document.getElementById('chart_3');
      this.init_3_Chart = echarts.init(dom_3);
      const chartOptions = await this.getCharts_3_options();
      this.init_3_Chart.setOption(chartOptions)
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
              name: '能耗用量统计分析',
              type: 'line',
              smooth: true,
              data: []
          }
        ]
      };

      return option
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
    getChartOptions () {
      let color = ['#A2FFBC', '#48F7B2', '#3FB9FF'];
      return {
        grid: {
          left: '10px',
          right: '10px',
          top: '10px',
          bottom: '40px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          itemHeight: 10,
          itemWidth: 10,
          textStyle: { color: '#000', fontSize: 12 },
          bottom: '0px',
          right: 'auto',
          borderRadius: 2
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 坐标轴两边留白
            axisTick: {
              show: false // 隐藏Y轴刻度
            },
            axisLabel: {
              color: '#7E7E7E',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false // 隐藏Y轴刻度
            },
            axisLabel: {
              color: '#7E7E7E',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#0F6384'
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
              show: false,
              lineStyle: {
                color: '#28335A'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#0F6384'
              }
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
        ]
      };
    },
    changebar (index) {
      this.barId = index;
      this._getWaterConsumptionStatsByBuilding()
    },
    changeTrend (index) {
      this.trendId = index;
      this.chart_3_data()
    },
    // 年总能耗
    changeYearConsum () {
      if (this.conusumFlag == 'M') {
        this.conusumFlag = 'Y';
        this.consumTime = !this.consumTime;
        this._getWaterTotleConsumption()
        this._getWaterChargeInRevenueStats()
      } else {
        return;
      }
    },
    // 月总能耗
    changeMonthConsum () {
      if (this.conusumFlag == 'Y') {
        this.conusumFlag = 'M';
        this.consumTime = !this.consumTime;
        this._getWaterTotleConsumption()
        this._getWaterChargeInRevenueStats()
      } else {
        return;
      }
      
    },
    // 年水电量
    changeYearHydropower () {
      if (this.HydropowerFlag == 'M') {
        this.HydropowerFlag ='Y';
        this.HydropowerTime = !this.HydropowerTime;
        this._getWaterCharge()
        this._getWaterConsumption()
      } else {
        return;
      }
    },
    // 月水电量
    changeMonthHydropower () {
      if (this.HydropowerFlag == 'Y') {
        this.HydropowerFlag = 'M';
        this.HydropowerTime = !this.HydropowerTime;
        this. _getWaterCharge()
        this._getWaterConsumption()
      } else {
        return;
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #adminContent #card {
    background: #fff;
    padding: 20px 20px 20px;
    margin-bottom: 10px;
  }
  .energyAnalysis {
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
    .comsumptionWrap {
      display: flex;
      .totalConsumption {
        flex: 1;
        border: 1px solid #d0d0d0;
        padding: 5px;
        margin-right: 20px;
      }
      .content {
        height: 100%;
        display: flex;
        align-items: center;
        .img {
          flex: 1;
          img {width: 100%;}
        }
        .item {
          height: 100%;
          flex: 2;
          margin-left: 10px;
          padding-right: 20px;
        }
        .titleWrap {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
      }
      .waterElectricity {
        flex: 2;
        display: flex;
        border: 1px solid #d0d0d0;
        padding: 5px;
        justify-content: space-between;
        box-sizing: border-box;
        padding-top: 20px;
        .ymWrap {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-evenly;
          
        }
        .electricity {
          flex: 3;
          text-align: center;
        }
        .water {
          flex: 3;
          text-align: center;
        }
        .line {
          display: inline-block;
          height: 80%;
          border-left: 1px solid #d0d0d0;
        }
      }
    }
    // 年 月
    .yearMonth {
      display: inline-block;
      width: 40px;
      height: 20px;
      border: 1px solid #d0d0d0;
      border-radius: 20px;
      text-align: center;
      line-height: 20px;
      margin: 0 10px;
      cursor: pointer;
    }
    .clickBackgrond {
      background:rgba(34, 179, 136, 0.7)
    }
    .commonLi {
      margin-bottom: 10px;
      font-size: 14px; /*no*/
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
          .controller {
            display: flex;
            position: absolute;
            margin-left: 50%;
            transform: translate(-50%);
            span {
              padding: 5px 10px;
              cursor: pointer;
              border-radius: 4px;
              font-size: 12px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #6B6B6B;
              
            }
            .isActive {
              background: #3fa2e2;
              color: #ffffff;
            }
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