/* eslint-disable camelcase */
<template>
  <div id='alarmStatistics' >
    <div  v-if="routeName === 'alarmStatistics'">
      <el-row :gutter="10" class="chartTable">
        <el-col :span="16">
          <div class="content">
            <div>告警趋势统计</div>
            <div class="charTitle">
              <span :class="{'is-active': trendId === '1'}" @click="changeTrend('1')">本日</span>
              <span :class="{'is-active': trendId === '2'}" @click="changeTrend('2')">近一周</span>
              <span :class="{'is-active': trendId === '3'}" @click="changeTrend('3')">近30天</span>
            </div>
            <div id="char_1"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div>告警状态分布</div>
            <div id="char_2"></div>
          </div>
        </el-col>
      </el-row>
      <!-- 告警统计 -->
      <header-title
        icon="iconfont icon-shouye"
        title="告警统计"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :delBtnVisible="true"
          @on-delBtn="deleteAlarm();"
          :delBtnDisabled="selectList.length === 0"
          :delTitleBtn="'批量消除'"
        />
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            operator-width="110"
            operator
            selection
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
            @selection-change="onSelectionChange"
          >
            <template
              slot-scope="scope"
              slot="operator"
            >
            <flex>
              <el-button
                type="text"
                size="small"
                title="查看"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="清除"
                @click.prevent.stop="deleteAlarm({
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
            </flex>
            </template>
          </page-table>
        </div>
      </div>
    </div>
    <div v-if="routeName === 'alarmStatisticsPage'">
      <el-button type="text" class="backButton" @click="goBack">返回</el-button>
      <Page type="template" :currentData="currentData"/>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import { routePush } from '@/util/util';
import Page from '../../smokeManagement/timeMonitoring';
import {
  getSmokeDetectorAlarmType,
  getSmokeDetectorAlarmStatus,
  getSmokeDetectorAlarmLevel,
  getSmokeDetectorTrend,
  getSmokeDetectorRunStatus,
  getSmokeDetectorConfirmStatistics,
  getSmokeDetectorAlarmForPage,
  clearSmokeDetectorAlarm,
  getSmokeDetectorAlarmEnum
} from 'api/smokeDetectorMap';
export default {
  name: 'alarmStatistics',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        span: 12,
        type: 'dataPicker',
        label: '时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'input',
        label: '告警设备',
        props: {
          fieldName: 'deviceName'
        }
      }, {
        type: 'select',
        label: '告警状态',
        props: {
          fieldName: 'alarmProStatus',
          options: []
        }
      }, {
        type: 'select',
        label: '告警类型',
        props: {
          fieldName: 'alarm',
          options: []
        }
      }, {
        type: 'select',
        label: '告警级别',
        props: {
          fieldName: 'alarmLevel',
          options: []
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '告警级别',
          prop: 'alarmLevelText'
        },
        { label: '告警类型',
          prop: 'alarmStatusText'
        },
        { label: '告警设备',
          prop: 'deviceName'
        },
        { label: '告警时间',
          prop: 'alarmTime',
          minWidth: '110px'
        },
        { label: '告警状态',
          prop: 'alarmProStatusText'
        }
      ],
      trendId: undefined,
      selectList: [],
      currentData: null
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    this.$nextTick(() => {
      // getSmokeDetectorAlarmType().then(res => {
      //   if (res.code === '200') {
      //     const alrmTypes = res.data.map(data => {
      //       return {
      //         id: data.value,
      //         name: data.key
      //       }
      //     });
      //     this.$set(this.searchItems[3].props, 'options', alrmTypes);
      //   }
      // });
      getSmokeDetectorAlarmStatus().then(res => {
        if (res.code === '200') {
          const disposeTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.searchItems[2].props, 'options', disposeTypes);
        }
      });
      getSmokeDetectorAlarmLevel().then(res => {
        if (res.code === '200') {
          const levelTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.searchItems[4].props, 'options', levelTypes);
        }
      });
      getSmokeDetectorAlarmEnum().then(res => {
        if (res.code === '200') {
          const alarmTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.searchItems[3].props, 'options', alarmTypes);
        }
      });
      this.init2();
      this.changeTrend('3');
      this.onCurrentChange(1)
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Page
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
      }
      delete this.searchVal.time;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getSmokeDetectorAlarmForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
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
    },
    onSelectionChange (list) {
      this.selectList = list.map(ls => ls.alarmNo);
    },
    changeTrend (index) {
      const indexType = {
        '1': '',
        '2': 7,
        '3': 30
      }
      if (this.trendId !== index) {
        this.trendId = index;
        this.init1({
          timeInterval: indexType[index]
        });
      }
    },
    init1 (timeInterval) {
      getSmokeDetectorTrend(timeInterval).then(res => {
        if (res.code === '200') {
          const init2Data = res.data;
          let dom_1 = document.getElementById('char_1');
          let myChart = echarts.init(dom_1);
          let option = null;
          let fontColor = '#30eee9';
          let alarmCount = [];
          let faultCount = [];
          let warningCount = [];
          let date = [];
          let all = [];
          res.data.map(item => {
            date.push(item.time);
            alarmCount.push(item.alarmCount);
            faultCount.push(item.faultCount);
            warningCount.push(item.warningCount);
            all.push(100);
          });
          let ylMax = Math.max(...alarmCount);
          let ylMmin = 0;
          let y2Max = Math.max(...faultCount);
          let y2Mmin = 0;
          let y3Max = Math.max(...warningCount);
          let y3Mmin = 0;
          let legend = [{
            name: '报警',
            icon: 'rect'
          }, {
            name: '故障',
            icon: 'rect'
          }, {
            name: '预警',
            icon: 'rect'
          }];
          let color = ['#A2FFBC', '#48F7B2', '#3FB9FF'];
          option = {
            grid: {
              left: '10px',
              right: '10px',
              top: '20px',
              bottom: '30px',
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
                // console.log(prams);
                return `<div style="font-size:12px;">${prams[0].name}</div>
                <div style="font-size:12px;">${prams[0].seriesName}：${prams[0].data}</div>
                <div style="font-size:12px;">${prams[1].seriesName}：${prams[1].data}</div>
                <div style="font-size:12px;">${prams[2].seriesName}：${prams[2].data}</div>
                `;
              }
            },
            color: color,
            legend: {
              orient: 'horizontal',
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: '#000', fontSize: 12 },
              bottom: '0px',
              right: 'auto',
              data: legend
            },
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
            ],
            xAxis: {
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
              data: date
            },
            series: [
              {
                name: legend[0].name,
                type: 'bar',
                barWidth: 8,
                stack: '1',
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#FF6A6A'
                  }
                },
                data: alarmCount,
                zlevel: 2
              },
              {
                name: legend[1].name,
                type: 'bar',
                barWidth: 8,
                stack: '1',
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#48F7B2'
                  }
                },
                data: faultCount,
                zlevel: 2
              },
              {
                name: legend[2].name,
                type: 'bar',
                barWidth: 8,
                stack: '1',
                itemStyle: {
                  normal: {
                    show: true,
                    color: '#3FB9FF'
                  }
                },
                data: warningCount,
                zlevel: 2
              },
              {
                name: '',
                type: 'bar',
                barWidth: '8px',
                xAxisIndex: 0,
                yAxisIndex: 1,
                barGap: '-108%',
                data: all,
                itemStyle: {
                  normal: {
                    color: '#FFF'
                  }
                },
                zlevel: 1
              }
            ]
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    init2 () {
      getSmokeDetectorConfirmStatistics().then(res => {
        if (res.code === '200') {
          const data = res.data;
          let dom_2 = document.getElementById('char_2');
          let myChart = echarts.init(dom_2);
          let option = null;
          let color = [
            '#FF9023',
            '#4CDC9F',
            '#7F00C0',
            '#0F72FF',
            '#C00000',
            '#4AEAB0'
          ];
          let dataJson = [
            {
              name: '已处理',
              value: `${data.confirmAlarmPercentage || 0}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#CEFF5C'
                  }, {
                    offset: 1,
                    color: '#34FF86'
                  }])
                }
              }
            },
            {
              name: '未处理',
              value: `${data.unConfirmAlarmPercentage || 0}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#FFBD47'
                  }, {
                    offset: 1,
                    color: '#FFBF57'
                  }])
                }
              }
            }
          ];
          option = {
            color: color,
            graphic: {
              elements: [
              ]
            },
            legend: {
              orient: 'horizontal',
              itemWidth: 14,
              itemHeight: 10,
              bottom: 0,
              right: 'auto',
              borderRadius: 0,
              textStyle: {
                color: '#000',
                fontSize: 12
              },
              data: [{
                name: '已处理',
                icon: 'rect'
              }, {
                name: '未处理',
                icon: 'rect'
              }]
            },
            series: [
              {
                type: 'pie',
                top: 0,
                bottom: 0,
                left: 'center',
                radius: ['75%', '90%'],
                data: dataJson,
                hoverAnimation: false,
                label: {
                  formatter: '{c}%',
                  padding: [2, 6],
                  color: '#000'
                },
                labelLine: {
                  lineStyle: {
                    color: '#81B6FF',
                    length2: 0,
                    borderRadius: 4
                  }
                }
              }
            ]
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    deleteAlarm (item) {
      let parames = [];
      if (item) {
        parames = {
          alarmNo: [item.alarmNo]
        };
      } else {
        parames = {
          alarmNo: this.selectList
        };
      }
      this.$confirm('此操作将永久清除该设备告警, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearSmokeDetectorAlarm(parames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.onSearch();
          }
        });
      });
    },
    showView (item) {
      routePush({
        title: '告警统计详情',
        name: 'alarmStatisticsPage',
        parames: {
          ...item
        }
      });
      this.currentData = item;
    },
    goBack (item) {
      routePush({
        name: 'alarmStatistics',
        parames: {
          ...item
        }
      });
      this.currentData = null;
    }
  }
}
</script>

<style lang="less">
#alarmStatistics{
  .chartTable {
    margin: 10px 0;/*no*/
    margin-left: 0;
    margin-right: 0;
    background: #fff;
    .content{
      width: 100%;
      height: 100%;
      padding: 10px;/*no*/
    }
    #char_1, #char_2 {
      height: 532px;
    }
    .charTitle{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      span{
        padding: 4px 12px;/*no*/
        font-size: 12px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #6B6B6B;
        cursor: pointer;
        &.is-active{
          color: #fff;
          background: #3471F5;
          border-radius: 4px;/*no*/
        }
      }
    }
  }
  .backButton{
    padding-top: 0;
  }
}
</style>
