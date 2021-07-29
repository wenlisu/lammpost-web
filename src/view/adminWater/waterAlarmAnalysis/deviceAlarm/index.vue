<template>
  <div class="deviceAlarm">
    <div>
      <el-row :gutter="10" class="list2">
        <el-col :span="12">
          <div class="content">
            <div class="title">设备报警趋势统计</div>
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
            <div class="title">告警状态分布</div>
            <div id="chart_2" class="chart"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="searchBox">
        <search-form
          :searchItems="searchItems"
          @onSearch="onSearch"
        />
      </div>
    </div>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          operator
          col-align="center"
          operator-width="110"
          :selection="true"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              size="small"
              title="消除"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="cancel({
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              消除
            </el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import searchForm from 'components/adminSearchForm/searchForm';
import Flex from '@/components/flex';
import * as echarts from 'echarts';
import {
  getWaterMeterConfirmStatistics,
  getWaterMeterAlarmTrend,
  getWaterMeterRealTimeAlarm
} from 'api/water'
export default {
  components: {
    card,
    PageTable,
    searchForm,
    Flex
  },
  data () {
    return {
      init_1_Chart: null,
      init_2_Chart: null,
      barId: 6,
      searchItems: [
        {
          type: 'dataPicker',
          label: '时间',
          initValue: '',
          props: {
            type: 'datetimerange',
            fieldName: 'alarmTime'
          },
        },{
          type: 'input',
          label: '告警设备',
          initValue: '',
          props: {
            fieldName: 'serialNumber',
          },
        },{
          type: 'select',
          label: '告警状态',
          initValue: '',
          props: {
            fieldName: 'alarmStatus',
            options: [
              {
                name: '未处理',
                id: 1
              },{
                name: '已处理',
                id: 2
              },{
                name: '已关闭',
                id: 3
              },
            ],
          },
        },{
          type: 'select',
          label: '告警类型',
          initValue: '',
          props: {
            fieldName: 'alarmType',
            options: [
              {
                name: '预警',
                id: 0
              },{
                name: '报警',
                id: 1
              },
            ]
          },
        },{
          type: 'select',
          label: '告警级别',
          initValue: '',
          props: {
            fieldName: 'alarmLevel',
            options: [
              {
                name: '一般',
                id: 1
              },{
                name: '重要',
                id: 2
              },{
                name: '警告',
                id: 3
              },{
                name: '严重',
                id: 4
              }
            ],
          },
        }
      ],
      searchVal: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 表格
      tableData: [],
      tableCols: [
        { label: '告警级别',
          prop: 'alarmLevelText'
        },
        { label: '告警类型',
          prop: 'alarmTypeText'
        },
        { label: '告警设备',
          prop: 'deviceName'
        },
        { label: '告警时间',
          prop: 'alarmTime'
        },
        { label: '告警状态',
          prop: 'alarmStatusText'
        }
      ]
    }
  },
  created () {
    this.onCurrentChange(1)
  },
  mounted () {
    this.init_1()
    this.initChart_2()
    this._getWaterMeterAlarmTrend()
    this._getWaterMeterConfirmStatistics()
  },
  methods: {
    cancel () {},
    async init_1 () {
      let dom_1 = document.getElementById('chart_1');
      this.init_1_Chart = echarts.init(dom_1);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        series: [
          {
            name: '故障次数',
            type: 'bar',
            data: [],
            barWidth: 8,
            itemStyle: {
              normal: {
                show: true,
                color: '#48F7B2'
              }
            },
          }
        ]
      }
      this.init_1_Chart.setOption(chartOptions)
      // window.onresize = function () {
      //   this.init_1_Chart.resize();
      // };
    },
    async initChart_2 () {
      let dom_2 = document.getElementById('chart_2');
      this.init_2_Chart = echarts.init(dom_2);
      const chartOptions = await this.getpieOption();
      this.init_2_Chart.setOption(chartOptions)
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
    changebar (index) {
      this.barId = index;
      this._getWaterMeterAlarmTrend()
    },
    _getWaterMeterConfirmStatistics () {
      getWaterMeterConfirmStatistics().then(res => {
        if(res.code == '200') {
          let data = [
            {
              name: '未处理',
              value: res.data.confirmAlarmCount || 0
            },{
              name: '已处理',
              value: res.data.unConfirmAlarmCount || 0
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
    _getWaterMeterAlarmTrend() {
      const params = {
        dateInterval: this.barId,
        serialNumber: this.searchVal.serialNumber || ''
      }
      getWaterMeterAlarmTrend(params).then(res => {
        if(res.code == '200') {
           let value = []
          let axisData = res.data.map(item => {
            return item.simpleTimeAxis
          })
          res.data.map(item => {
            value.push(item.alarmCount || 0)
          })
          this.init_1_Chart.setOption({
            xAxis: {
              data: axisData
            },
            series: [
              {
                name: '故障次数',
                type: 'bar',
                data: [],
                barWidth: 8,
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#48F7B2'
                  }
                },
                data: value
              }
            ]
          })
        }
      })
    },
    onSearch (val) {
      this.searchVal = {
        ...val, 
        timeBegin: val.alarmTime ? val.alarmTime[0] : '',
        timeEnd: val.alarmTime ? val.alarmTime[1] : ''
      }
      this.searchVal['alarmTime'] ? delete this.searchVal['alarmTime'] : null
      this.onCurrentChange(1);
    },
    getDataAllList() {
      const params = {
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: ""
      }
      getWaterMeterRealTimeAlarm(params).then(res => {
        if(res.code == '200') {
          this.tableData = res.data.data
          this.page.total = res.data.total
        }
      })
    },
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    }
  }
}
</script>

<style lang="less">
.deviceAlarm {
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
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    display: inline-block;
    width: 100%;
  }
  // .searchForm {
  //   margin-top: 10px;
  //   .el-button {
  //     margin-left: 10px;
  //     border-radius: 0px;
  //     height: 30px;
  //     line-height: 0;
  //   }
  //   .el-button--primary {
  //     background-color: #2573f1 !important;
  //     border-color: transparent;
  //     border-radius: none !important;
  //     border-radius: unset;
  //     min-width: 70px;
  //     font-size: 14px;
  //   }
  // }
  .marginRight {
    margin-right: 20px;
  }
}
</style>