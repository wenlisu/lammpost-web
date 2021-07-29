/* eslint-disable camelcase */
<template>
  <div id='alarmEvent'>
    <div v-if="routeName == 'entranceAlarmEventDetail'">
      <detail />
    </div>
    <div v-if="routeName == 'entranceAlarmEvent'">
      <el-row :gutter="10" class="chartTable">
        <!-- <el-col :span="24">
          <div class="content">
            <div id="char_1"></div>
          </div>
        </el-col> -->
        <el-col :span="24">
          <div class="flexRow content">
            <div class="flexCloumn chart">
              <span class="chartTitle">异常事件统计</span>
              <div id="char_2"></div>
            </div>
            <div class="flexCloumn chart">
              <span class="chartTitle">告警状态分布</span>
              <div id="char_3"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 业务执行管理 -->
      <header-title
        icon="iconfont icon-shouye"
        title="业务执行管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="$_hasOperation($options.name,'add')"
          @on-addBtn="openDialog('add');"
        />
      </header-title>

      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            operator-width="110"
            operator
            :selection="false"
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
                title="查看"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="showView('del', {
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button> -->
            </flex>
            </template>
          </page-table>
        </div>
      </div>
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
import detail from './detail';
import {
  doorAccessAlarmDetail
} from 'api/entrance';
export default {
  name: 'entranceAlarmEvent',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'select',
        label: '告警类型',
        props: {
          fieldName: 'status',
          options: []
        }
      }, {
        type: 'input',
        label: '门禁点',
        props: {
          fieldName: 'position'
        }
      }, {
        type: 'select',
        label: '告警状态',
        props: {
          fieldName: 'status',
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
          prop: 'alarmLevel'
        },
        { label: '告警类型',
          prop: 'alarmContent'
        },
        { label: '门禁点',
          prop: 'position'
        },

        { label: '时间',
          prop: 'alarmTime',
          minWidth: '110px'
        },
        { label: '告警状态',
          prop: 'alarmStatus'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
      this.init2();
      this.init3();
    })
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    detail
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        onTime: val.time && val.time[0],
        closeTime: val.time && val.time[1]
      };
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
      doorAccessAlarmDetail(data).then(res => {
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
    init1 () {
      var dom_1 = document.getElementById('char_1');
      let myChart = echarts.init(dom_1);
      let option = null;
      let date = [];
      let alarmCount = [];
      let faultCount = [];
      [{time: '1:00', alarmCount: '2', faultCount: '10'}, {time: '2:00', alarmCount: '7', faultCount: '5'}, {time: '3:00', alarmCount: '1', faultCount: '3'}].map(item => {
        date.push(item.time);
        alarmCount.push(item.alarmCount);
        faultCount.push(item.faultCount);
      });
      option = {
        // title: {
        //   top: '0',
        //   left: 'center',
        //   textStyle: {
        //     color: '#FFF',
        //     align: 'center'
        //   }
        // },
        // grid: {
        //   left: '40px',
        //   right: '50px',
        //   bottom: '60px',
        //   top: '16px',
        //   containLabel: true
        // },
        grid: {
          left: '10px',
          right: '0px',
          top: '10px',
          bottom: '40px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          itemHeight: 10,
          itemWidth: 10,
          textStyle: { color: '#000', fontSize: 12 },
          bottom: '0px',
          right: 'auto',
          borderRadius: 5,
          data: [{
            name: '黑名单',
            icon: 'rect',
            textStyle: {
              borderRadius: 5
            }
          }, {
            name: '陌生人',
            icon: 'rect',
            textStyle: {
              borderRadius: 4
            }
          }]
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#7E7E7E',
              fontSize: '12'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#0F6384'
              }
            },
            data: date
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '', // 左
            // min: ylMmin,
            // max: ylMax,
            triggerEvent: true,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#7E7E7E',
                fontSize: '12'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#0F6384'
              }
            }
          }
          // {
          //   type: 'value',
          //   name: '', // 右
          //   min: y2Mmin,
          //   // max: y2Max,
          //   axisLabel: {
          //     formatter: '{value}',
          //     textStyle: {
          //       color: '#fff',
          //       fontSize: '10'
          //     }
          //   },
          //   axisLine: {
          //     lineStyle: {
          //       color: '#132465'
          //     }
          //   },
          //   axisTick: {
          //     show: false
          //   },
          //   splitLine: {
          //     show: true,
          //     lineStyle: {
          //       color: '#132465'
          //     }
          //   }
          // }
        ],
        series: [
          {
            name: '黑名单',
            type: 'line',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: '#A2FFBC'
              }
            },
            itemStyle: {
              normal: {
                color: '#A2FFBC'
              }
            },
            data: alarmCount
          },
          {
            name: '陌生人',
            type: 'line',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: '#FF6160'
              }
            },
            itemStyle: {
              normal: {
                color: '#FF6160'
              }
            },
            data: faultCount
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    init2 () {
      const dom_2 = document.getElementById('char_2');
      const myChart = echarts.init(dom_2);
      const option = {
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
            `;
          }
        },
        color: ['#53abf3', '#0dd3b6'],
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
          data: [1, 2, 8, 3, 5, 6]
        },
        series: [
          {
            name: '告警',
            type: 'bar',
            barWidth: 15,
            // stack: '1',
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
            data: [1, 2, 3, 4, 10, 13]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    init3 () {
      var dom_3 = document.getElementById('char_3');
      var myChart = echarts.init(dom_3);
      var option = null;
      const data = {};
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
          name: '未处理',
          value: `${0}`,
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
          name: '已处理',
          value: `${0}`,
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
            name: '未处理',
            icon: 'rect'
          }, {
            name: '已处理',
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
              // show: false
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
    },
    showView (item) {
      routePush({
        title: '告警事件查询详情',
        name: 'entranceAlarmEventDetail',
        parames: {
          ...item
        }
      });
    }
  }
}
</script>

<style lang="less">
#alarmEvent{
  .chartTable{
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 20px;/*no*/
    margin-bottom: 10px;/*no*/
    background: #fff;
    .el-col{
      #char_1, #char_2, #char_3{
        height: 432px;
      }
      &:last-child{
        margin-top: 10px;/*no*/
        .content{
          width: 100%;
          justify-content: space-between;
          .chart{
            width: calc(50% - 5px);/*no*/

          }
        }
      }
    }
  }
}
</style>
