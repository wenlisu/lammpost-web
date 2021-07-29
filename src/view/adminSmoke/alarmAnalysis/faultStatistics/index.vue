/* eslint-disable camelcase */
<template>
  <div id='faultStatistics' >
    <div v-if="routeName === 'faultStatistics'">
      <el-row :gutter="10" class="chartTable">
        <el-col :span="16">
          <echartData id="option1" :userOptions="option1" height="300px" isTime>
            <div class="flexRow" slot="time">
              <div class="charTitle">
                <span :class="{'is-active': alarmId === '1'}" @click="changeAlarm('1')">本月</span>
                <span :class="{'is-active': alarmId === '2'}" @click="changeAlarm('2')">本年</span>
              </div>
            </div>
          </echartData>
        </el-col>
        <el-col :span="8">
          <echartData id="option2" :userOptions="option2" height="300px">
          </echartData>
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
        />
      </header-title>

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
                @click.prevent.stop="goDetail({
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
    <div v-if="routeName === 'faultStatisticPage'">
      <Page />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import { routePush } from '@/util/util';
import Page from './page';
import {
  getSmokeDetectorWorkOrderForPage,
  getSmokeDetectorAlarmStatus,
  getSmokeDetectorFaultDistributed,
  getSmokeDetectorAlarmAndFaultStats
} from 'api/smokeDetectorMap';
export default {
  name: 'faultStatistics',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        span: 12,
        type: 'dataPicker',
        label: '告警时间',
        props: {
          fieldName: 'dateNow'
        }
      }, {
        type: 'input',
        label: '设备名称',
        props: {
          fieldName: 'instanceName'
        }
      }, {
        type: 'input',
        label: '维修人员',
        props: {
          fieldName: 'productName'
        }
      }, {
        type: 'select',
        label: '状态',
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
        { label: '设备名称',
          prop: 'deviceName'
        },
        { label: '告警类型',
          prop: 'imei'
        },
        { label: '告警时间',
          prop: 'createTime',
          minWidth: '110px'
        },
        { label: '维修人员',
          prop: 'dealer'
        },
        { label: '维修完成时间',
          prop: 'completeTime',
          minWidth: '110px'
        },
        { label: '维修情况',
          prop: 'dealNote'
        },
        { label: '故障原因定界',
          prop: 'dealReason'
        },
        { label: '状态',
          prop: 'dealNodeText'
        }
      ],
      selectList: [],
      alarmId: null,
      option1: {
        title: '故障火警趋势分析',
        options: {}
      },
      option2: {
        title: '报警类型分布',
        options: {}
      }
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.routeName === 'faultStatistics') {
        getSmokeDetectorAlarmStatus().then(res => {
          if (res.code === '200') {
            const statusTypeList = res.data.map(data => {
              return {
                id: data.value,
                name: data.key
              }
            });
            this.$set(this.searchItems[3].props, 'options', statusTypeList);
          }
        });
        this.changeAlarm('1');
        this.init2();
        this.onCurrentChange(1);
      }
    });
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Page,
    echartData
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
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
      getSmokeDetectorWorkOrderForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data.concat([1, 2]);
        }
      })
    },
    // 分页切换页面
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1)
    },
    onSelectionChange (args) {
      this.selectList = args.map(arg => arg.alarmNo)
    },
    changeAlarm (index) {
      const indexType = {
        '1': '',
        '2': 1
      }
      if (this.alarmId !== index) {
        this.alarmId = index;
        this.init1({
          dateInterval: indexType[index]
        });
      }
    },
    init1 (parames) {
      getSmokeDetectorAlarmAndFaultStats(parames).then(res => {
        if (res.code === '200') {
          // var dom_1 = document.getElementById('char_1');
          // let myChart = echarts.init(dom_1);
          // let option = null;
          let date = [];
          let alarmCount = [];
          let faultCount = [];
          res.data.map(item => {
            date.push(item.time);
            alarmCount.push(item.alarmCount);
            faultCount.push(item.faultCount);
          });
          this.option1.options = {
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
              bottom: '30px',
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
                name: '报警率',
                icon: 'rect',
                textStyle: {
                  borderRadius: 5
                }
              }, {
                name: '故障率',
                icon: 'rect',
                textStyle: {
                  borderRadius: 4
                }
              }]
            },
            xAxis: [
              {
                type: 'category',
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
                name: '报警率',
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
                name: '故障率',
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
          // myChart.setOption(option, true);
          // window.onresize = function () {
          //   myChart.resize();
          // };
        }
      });
    },
    init2 () {
      getSmokeDetectorFaultDistributed().then(res => {
        if (res.code === '200') {
          const data = res.data;
          // var dom_2 = document.getElementById('char_2');
          // var myChart = echarts.init(dom_2);
          // var option = null;
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
              name: data[0].faultName,
              value: `${data[0].faultRate || 0}`,
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
              name: data[1].faultName,
              value: `${data[1].faultRate || 0}`,
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
            },
            {
              name: data[2].faultName,
              value: `${data[2].faultRate || 0}`,
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
          this.option2.options = {
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
                name: data[0].faultName,
                icon: 'rect'
              }, {
                name: data[1].faultName,
                icon: 'rect'
              }, {
                name: data[2].faultName,
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
          // myChart.setOption(option, true);
          // window.onresize = function () {
          //   myChart.resize();
          // };
        }
      });
    },
    goDetail (item) {
      routePush({
        title: '故障统计详情',
        name: 'faultStatisticPage',
        parames: {
          ...item
        }
      });
    }
  }
}
</script>

<style lang="less">
#faultStatistics{
  .chartTable {
    margin: 10px 0;/*no*/
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
      .flexRow{
        background: transparent;
        padding: 0;
      }
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
}
</style>
