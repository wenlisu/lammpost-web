/* eslint-disable camelcase */
<template>
  <div id='monitorReportManage'>
    <!-- 告警管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="告警管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add');"
      />
    </header-title>
    <div class="chartTable">
      <div id="char_2"></div>
    </div>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          operator
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
              @click.prevent.stop="showView('detail', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
          </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="showView('del', {
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
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts'; // 引入echarts
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import {
  alarmManage,
  alarmManageChart
} from 'api/admin';
export default {
  name: 'monitorReportManage',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '告警时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'input',
        label: '告警名称',
        props: {
          fieldName: 'alarmName'
        }
      }, {
        type: 'select',
        label: '告警状态',
        props: {
          fieldName: 'alarmStatus',
          options: [{
            id: '0',
            name: '未处理'
          }, {
            id: '1',
            name: '已处理'
          }, {
            id: '2',
            name: '已关闭'
          }]
        }
      }, {
        type: 'select',
        label: '告警级别',
        props: {
          fieldName: 'alarmLevel',
          options: [{
            id: '1',
            name: '警告'
          }, {
            id: '2',
            name: '一般'
          }, {
            id: '3',
            name: '重要'
          }, {
            id: '4',
            name: '严重'
          }]
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      data: undefined,
      selectList: [],
      tableData: [],
      tableCols: [
        { label: '告警名称',
          prop: 'alarmName'
        },
        { label: '告警设备',
          prop: 'deviceModuleName'
        },
        { label: '告警级别',
          prop: 'alarmLevelText'
        },
        { label: '告警类型',
          prop: 'alarmTypeText'
        },
        { label: '告警内容',
          prop: 'alarmContent',
          minWidth: '150px'
        },
        { label: '告警时间',
          prop: 'alarmTime',
          minWidth: '120px'
        },
        { label: '告警状态',
          prop: 'alarmStatusText'
        }
      ],
      myChart: null,
      option: {
        grid: {
          left: '10px',
          right: '30px',
          bottom: '55px',
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
            return `<div style="font-size:12px;">${prams[0] && prams[0].name}</div>
            <div style="font-size:12px;">${prams[0] && prams[0].seriesName}：${prams[0] && prams[0].data}</div>
            <div style="font-size:12px;">${prams[1] && prams[1].seriesName}：${prams[1] && prams[1].data}</div>
            <div style="font-size:12px;">${prams[2] && prams[2].seriesName}：${prams[2] && prams[2].data}</div>
            <div style="font-size:12px;">${prams[3] && prams[3].seriesName}：${prams[3] && prams[3].data}</div>
            `;
          }
        },
        color: ['#53abf3', '#0dd3b6', '#ffad39', '#f56c6c'],
        legend: {
          itemHeight: 14,
          itemWidth: 14,
          textStyle: { color: '#000', fontSize: 12 },
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
              color: '#D0D0D0',
              fontSize: 12
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                width: 1,
                color: '#D0D0D0'
              }
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            min: 0,
            max: 100,
            splitNumber: 8,
            interval: 8,
            splitLine: {
              lineStyle: {
                width: 1,
                color: '#D0D0D0'
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
            color: '#D0D0D0'
          },
          axisLine: {
            lineStyle: {
              color: '#D0D0D0',
              width: 2
            }
          },
          data: []
        },
        series: [
          {
            name: '警告',
            type: 'bar',
            barWidth: 15,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#53abf3'
                  },
                  {
                    offset: 1,
                    color: '#13caf3'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 0,
                borderColor: '#102362'
              }
            },
            data: [],
            zlevel: 4
          },
          {
            name: '一般',
            type: 'bar',
            barWidth: 15,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#0dd3b6'
                  },
                  {
                    offset: 1,
                    color: '#2de18f'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 0,
                borderColor: '#102362'
              }
            },
            data: [],
            zlevel: 3
          },
          {
            name: '重要',
            type: 'bar',
            barWidth: 15,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#ffad39'
                  },
                  {
                    offset: 1,
                    color: '#f2bb44'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 0,
                borderColor: '#102362'
              }
            },
            data: [],
            zlevel: 2
          },
          {
            name: '严重',
            type: 'bar',
            barWidth: 15,
            stack: '1',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#f56c6c'
                  },
                  {
                    offset: 1,
                    color: '#f56c6c'
                  }
                ]),
                // barBorderRadius: 50,
                borderWidth: 0,
                borderColor: '#102362'
              }
            },
            data: [],
            zlevel: 1
          },
          {
            name: '',
            type: 'bar',
            barWidth: '15px',
            xAxisIndex: 0,
            yAxisIndex: 1,
            barGap: '-108%',
            data: [],
            itemStyle: {
              normal: {
                color: '#60626642'
              }
            },
            zlevel: 1
          }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
      this._alarmManageChart();
      this.initChart();
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        alarmName: val.alarmName,
        alarmLevel: val.alarmLevel,
        alarmStatus: val.alarmStatus,
        startTime: val.time && val.time[0],
        endTime: val.time && val.time[1]
      }
      this.onCurrentChange(1);
      this._alarmManageChart();
    },
    _alarmManageChart () {
      alarmManageChart(this.searchVal).then(res => {
        if (res.code === '200') {
          let alarmTotal = [];
          let alarmTime = [];
          let alarmLevel = {};
          res.data.map(data => {
            if (alarmLevel[data.alarmTime]) {
              alarmLevel[data.alarmTime][data.alarmLevel] = data.countAlarmLevel
            } else {
              alarmLevel[data.alarmTime] = {
                '1': null,
                '2': null,
                '3': null,
                '4': null
              }
              alarmLevel[data.alarmTime][data.alarmLevel] = data.countAlarmLevel
            }
          });
          let levels = {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            'all': []
          };
          Object.keys(alarmLevel).map(level => {
            const time = alarmLevel[level];
            const all = (+time['1']) + (+time['2']) + (+time['3']) + (+time['4']);
            alarmTime.push(moment(level).format('MM-DD HH:mm'));
            levels['1'].push(time['1']);
            levels['2'].push(time['2']);
            levels['3'].push(time['3']);
            levels['4'].push(time['4']);
            levels['all'].push(all);
          });
          const levelCount = levels['all'].map(count => { return +count; })
          const interval = this.getLeftData(Math.min(...levelCount), Math.max(...levelCount));
          this.$set(this.option.xAxis, 'data', alarmTime);
          this.$set(this.option.yAxis[1], 'min', interval.min);
          this.$set(this.option.yAxis[1], 'max', 100);
          this.$set(this.option.yAxis[1], 'interval', interval.interval);
          this.$set(this.option.series[0], 'data', levels['1']);
          this.$set(this.option.series[1], 'data', levels['2']);
          this.$set(this.option.series[2], 'data', levels['3']);
          this.$set(this.option.series[3], 'data', levels['4']);
          this.$set(this.option.series[4], 'data', levels['all']);
          this.myChart.setOption(this.option, true);
        }
      });
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
      alarmManage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
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
    onSelectionChange (args) {
      this.selectList = args.map(arg => arg.id);
    },
    initChart () {
      var dom_2 = document.getElementById('char_2');
      this.myChart = echarts.init(dom_2);
      window.onresize = function () {
        this.myChart && this.myChart.resize();
      };
      this.myChart.setOption(this.option, true);
    },
    showView () {
    },
    getLeftData (min, max) {
      // 控制分割条数，
      const distance = parseInt(((max - min) / 3).toString(), 10);
      return {
        max: 3 * distance + min + 3,
        min,
        interval: distance + 1
      };
    }
  }
}
</script>

<style lang="less">
#monitorReportManage{
  .chartTable {
    margin: 10px 0;/*no*/
    background: #fff;
    #char_2 {
      height: 532px;
    }
  }
}
</style>
