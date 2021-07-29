<template>
  <div id="entranceMap">
    <entranceMapBody/>
    <div class="infoContent infoCenter flexCloumn">
      <div class="flexRow infoMain">
        <div class="flexRow" @click="goMonitoring">
          <img src="../images/entrance/img2.png"/>
          <div class="flexCloumn info">
            <span class="title">门禁总数</span>
            <span class="value">{{initData.totalCount}}</span>
          </div>
        </div>
        <div class="flexRow" @click="goMonitoring">
          <img src="../images/entrance/img1.png"/>
          <div class="flexCloumn info">
            <span class="title">门禁在线数</span>
            <span class="value">{{initData.normalCount}}</span>
          </div>
        </div>
        <div class="flexRow" @click="goMonitoring">
          <img src="../images/entrance/img2.png"/>
          <div class="flexCloumn info">
            <span class="title">门禁离线数</span>
            <span class="value">{{initData.offlineCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="infoContent infoLeft">
      <el-row>
        <el-col :span="24" class="flow">
          <div class="l_item_1" >
            <div class="item_title">
              <span>今日人流量</span>
            </div>
            <div class="flexCloumn detail">
              <div class="flexRow peopleNumber">
                <div class="flexCloumn">
                  <div class="title">进入人数</div>
                  <ul class="flexRow">
                    <li
                      v-for="(item, index) in init1Data.inTotalCount"
                      :key="`enter${index}`"
                    >
                      {{item}}
                    </li>
                  </ul>
                </div>
                <div class="flexCloumn">
                  <div class="title">离开人数</div>
                  <ul class="flexRow">
                    <li
                      v-for="(item, index) in init1Data.outTotalCount"
                      :key="`off${index}`"
                    >
                      {{item}}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="flexCloumn progress">
                <div class="flexRow number">
                  <span>{{init1Data.staff}}</span>
                  <span>{{init1Data.visitor}}</span>
                </div>
                <div class="example">
                  <div
                    class="staff"
                    :style="{
                      width: `${init1Data.staff}`
                    }"
                  ></div>
                  <div
                    class="visitor"
                  ></div>
                </div>
                <div class="flexRow lengs">
                  <div class="flexRow">
                    <i class="iconfont icon-renshu" />
                    内部员工
                  </div>
                  <div class="flexRow">
                    <i class="iconfont icon-renshu" />
                    外部访客
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24" class="inOutTrend">
          <div class="l_item_2" >
            <div class="item_title">
              <span>进出趋势</span>
            </div>
            <div class="charTitle">
              <span :class="{'is-active': trendId === '6'}" @click="changeTrend('6')">今日</span>
              <span :class="{'is-active': trendId === '5'}" @click="changeTrend('5')">近1周</span>
              <span :class="{'is-active': trendId === '4'}" @click="changeTrend('4')">近1月</span>
              <span :class="{'is-active': trendId === '2'}" @click="changeTrend('2')">近半年</span>
            </div>
            <div id="entrance_char_2" />
          </div>
        </el-col>
        <el-col :span="24" class="inOutTrend">
          <div class="l_item_3" >
            <div class="item_title">
              <span>门禁事件</span>
              <p class="more" @click="handleMoreEntrance">更多</p>
            </div>
            <page-table
              col-align="center"
              :showPage="false"
              hideDefaultIndex
              :data="entrance.tableData"
              :cols="entrance.tableCols"
            >
              <template slot="closeupPic" slot-scope="{ row }">
                <el-image :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" fit="fill" :preview-src-list="[`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`]">
                  <div slot="error" class="image-error">
                    匹配失败
                  </div>
                </el-image>
              </template>
            </page-table>
            <div class="flexCloumn cardList" v-if="false">
              <div
                v-for="item in new Array(10)"
                :key="item"
                class="flexRow cardItem"
              >
                <img src="../images/entrance/img15.png"/>
                <div class="flexCloumn cardInfo">
                  <span class="title">大门口入口门禁</span>
                  <span class="time">2020-08-10 10:10:00</span>
                </div>
                <span class="cardLabel">无效卡</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="infoContent infoRight">
      <el-row>
        <el-col :span="24" class="monitoring">
          <div class="l_item_4" >
            <div class="item_title">
              <span>门禁安防监控</span>
              <p class="more" @click="goMonitoring">更多</p>
            </div>
            <el-row :gutter="10" class="flexRow itemList">
              <el-col
                :span="12"
                class="item"
                v-for="(imgItem, index) in init4Data"
                :key="`imgItem${index}`"
                v-if="index < 4"
              >
                <el-image :src="`${baseURL || config.baseURL.dev}/upload/${init4Data[index].closeupPic}`" fit="fill" :preview-src-list="[`${baseURL || config.baseURL.dev}/upload/${init4Data[index].closeupPic}`]">
                  <div slot="error" class="image-error">
                    匹配失败
                  </div>
                </el-image>
                <div class="flexCloumn place">
                  <span>{{imgItem.doorAccessSite || 'A区'}}</span>
                  <span>{{imgItem.createTime || '2020-12-17 18:58:33'}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24" class="statistics">
          <div class="l_item_5" >
            <div class="item_title">
              <span>告警统计</span>
            </div>
            <div class="flexCloumn progress">
              <div class="flexRow progressInfo">
                <div>
                  未处理 {{init5Data.unThreat}}
                </div>
                <div>
                  已处理 {{init5Data.threat}}
                </div>
              </div>
              <el-progress :percentage="init5Data.unThreatPercent || 0" :color="'#FF6C52'"></el-progress>
            </div>
            <div class="charTitle">
              <span :class="{'is-active': statisticsId === '1'}" @click="changeStatistics('1')">未处理</span>
              <span :class="{'is-active': statisticsId === '2'}" @click="changeStatistics('2')">已处理</span>
            </div>
            <div class="noData" v-if="init5Data.doorAccessAlarmDto.length === 0">
              暂无数据
            </div>
            <vue-seamless-scroll
              :data="init5Data.doorAccessAlarmDto"
              :classOption="{
                step: 0.5,
                autoPlay: true
              }"
              class="seamless-warp"
              v-if="init5Data.doorAccessAlarmDto.length !== 0"
            >
              <div class="flexCloume cardList">
                <div
                  class="flexRow cardItem"
                  v-for="(item, index) in init5Data.doorAccessAlarmDto"
                  :key="`doorAccessAlarm${index}`"
                >
                  <img src="../images/entrance/img5.png" />
                  <div class="flexCloumn cardInfo">
                    <span class="title" v-text="item.position">{{item.position}}</span>
                    <span class="time" v-text="item.alarmTime">{{item.alarmTime}}</span>
                  </div>
                  <div class="cardLabel" v-text="item.alarmContent">
                    {{item.alarmContent}}
                  </div>
                </div>
              </div>
            </vue-seamless-scroll>
          </div>
        </el-col>
        <el-col :span="24" class="ranking">
          <div class="l_item_6" >
            <div class="item_title">
              <span>分时段告警</span>
              <p class="more" @click="handleMoreAlarm">更多</p>
            </div>
            <div class="noData" v-if="true">
              暂无数据
            </div>
            <div id="entrance_char_3" v-if="false"/>
            <div class="flexCloumn cardList" v-if="false">
              <div
                class="flexRow cardItem"
                v-for="item in new Array(10)"
                :key="item"
              >
                <img src="../images/entrance/img8.png" />
                <span class="title">园区大门口门禁点</span>
                <span class="value">788886444</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <dialog-cont
      @on-cancel="entranceAlarmCancel"
      @on-confirm="entranceAlarmSubmit"
      :visible.sync="entranceAlarm.show"
      :confirmShow="false"
      :cancelShow="false"
      width="750px"
      title="门禁告警信息"
      append-to-body
      :customClass="'smokerListDialog'"
    >
      <search-form
        ref="entranceAlarmSearchForm"
        :searchItems="entranceAlarm.searchItems"
        @onSearch="onEntranceAlarmSearch"
      >
      </search-form>
      <page-table
        col-align="center"
        :data="entranceAlarm.tableData"
        :cols="entranceAlarm.tableCols"
        :page-current="entranceAlarm.page.current"
        :total="entranceAlarm.page.total"
        :page-size="entranceAlarm.page.pageSize"
        @current-change="onEntranceAlarmCurrentChange"
        @size-change="onEntranceAlarmPageSizeChange"
        @row-current-change="onEntranceAlarmSelectionChange"
      >
      </page-table>
    </dialog-cont>
    <dialog-cont
      @on-cancel="entranceDialogCancel"
      @on-confirm="entranceDialogSubmit"
      :visible.sync="entranceDialog.show"
      :confirmShow="false"
      :cancelShow="false"
      width="750px"
      title="门禁事件信息"
      append-to-body
      :customClass="'smokerListDialog'"
    >
      <search-form
        ref="entranceDialogSearchForm"
        :searchItems="entranceDialog.searchItems"
        @onSearch="onEntranceDialogSearch"
      >
      </search-form>
      <page-table
        col-align="center"
        :data="entranceDialog.tableData"
        :cols="entranceDialog.tableCols"
        :page-current="entranceDialog.page.current"
        :total="entranceDialog.page.total"
        :page-size="entranceDialog.page.pageSize"
        @current-change="onEntranceDialogCurrentChange"
        @size-change="onEntranceDialogPageSizeChange"
        @row-current-change="onEntranceDialogSelectionChange"
      >
        <template slot="matchPic" slot-scope="{ row }">
          <el-image :src="`${baseURL || config.baseURL.dev}/upload/${row.matchPic}`" fit="fill" :preview-src-list="[`${baseURL || config.baseURL.dev}/upload/${row.matchPic}`]">
            <div slot="error" class="image-error">
              匹配失败
            </div>
          </el-image>
        </template>
        <template slot="closeupPic" slot-scope="{ row }">
          <el-image :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" fit="fill" :preview-src-list="[`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`]">
            <div slot="error" class="image-error">
              加载失败
            </div>
          </el-image>
        </template>
      </page-table>
    </dialog-cont>
  </div>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts'; // 引入echarts
import vueSeamlessScroll from 'vue-seamless-scroll';
import dialogCont from '@/components/dialog';
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import FormItemText from '@/components/formItemText/formItemText';
import config, { baseURL } from '@/config';
import { routePush } from '@/util/util';
import entranceMapBody from './entranceMapBody';
import {
  getSmokeDetectorAlarmLevel
} from 'api/smokeDetectorMap';
import {
  doorAccessLogTodayCount,
  doorAccessLogChart,
  doorAccessLogAnalysis,
  doorAccessLogInstantWarn,
  doorAccessLogInstantWarnChart,
  doorAccessAlarmDetail,
  doorAccessAlarm,
  doorAccessLogTraffic,
  doorAccessLogGetOrder,
  doorAccessStatus,
  doorAccessDetail,
  doorAccessVideo,
  getTodayInOutStatByPersonType,
  getDoorAccessFlowStatByDate,
  getDoorAccessInOutForPage,
  getDoorAccessCurrentStatus,
  getDoorAccessCloseUpPic,
  getDoorAccessDeviceList
} from 'api/entrance';

export default {
  data () {
    return {
      baseURL,
      config,
      trendId: undefined,
      statisticsId: undefined,
      initData: {},
      deviceList: [],
      init1Data: {
        visitorPercent: 0,
        staffPercent: 0
      },
      init4Data: {},
      init5Data: {
        unThreatPercent: 0,
        doorAccessAlarmDto: []
      },
      entrance: {
        tableData: [],
        tableCols: [
          { label: '开门照片',
            prop: 'closeupPic',
            minWidth: '15px',
            custom: true
          },
          { label: '姓名',
            prop: 'personName',
            minWidth: '15px'
          },
          { label: '门禁',
            prop: 'deviceModuleName',
            minWidth: '20px'
          },
          { label: '触发时间',
            prop: 'createTime',
            minWidth: '20px',
            render: (h, scoped) => {
              return <div>{moment(scoped.row.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
          }
        ]
      },
      entranceDialog: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time',
            type: 'daterange'
          }
        }],
        tableData: [],
        tableCols: [
          {
            label: '底库照片',
            prop: 'matchPic',
            custom: true
          },
          { label: '开门照片',
            prop: 'closeupPic',
            custom: true
          },
          { label: '姓名',
            prop: 'personName'
          },
          { label: '门禁',
            prop: 'deviceModuleName'
          },
          { label: '手机号',
            prop: 'mobilePhone'
          },
          { label: '开门方式',
            prop: 'matchTypeText'
          },
          { label: '开门时间',
            prop: 'createTime',
            minWidth: '110px',
            render: (h, scoped) => {
              return <div>{moment(scoped.row.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
          }
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      entranceAlarm: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time',
            type: 'daterange'
          }
        }, {
          type: 'select',
          label: '告警级别',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmLevel',
            options: []
          }
        }],
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
          { label: '告警时间',
            prop: 'alarmTime',
            minWidth: '110px'
          },
          { label: '告警状态',
            prop: 'alarmStatus'
          }
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    };
  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (val) {
      if (val) {
        setTimeout(() => {
          this.init();
        }, 1000);
      }
    }
  },
  components: {
    vueSeamlessScroll,
    dialogCont,
    searchForm,
    PageTable,
    FormItemText,
    entranceMapBody
  },
  methods: {
    init () {
      getDoorAccessCurrentStatus({}).then(res => {
        if (res.code === '200') {
          this.initData = res.data;
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
          this.$set(this.entranceAlarm.searchItems[1].props, 'options', levelTypes);
        }
      });
      this.init1();
      this.changeTrend('6');
      this.init3();
      this.init4();
      this.changeStatistics('1');
      this.init6();
    },
    changeTrend (index) {
      if (this.trendId !== index) {
        this.trendId = index;
        this.init2({
          dateInterval: +index
        });
      }
    },
    init1 () {
      getTodayInOutStatByPersonType().then(res => {
        if (res.code === '200') {
          const data = res.data && res.data[0];
          const staff = +data.employeeInTotalCount || 0;
          const visitor = +data.guestInTotalCount || 0;
          const inTotalCount = data.inTotalCount ? `${data.inTotalCount}` : '0';
          const outTotalCount = data.outTotalCount ? `${data.outTotalCount}` : '0';
          this.init1Data = {
            ...data,
            staff: `${(staff / (staff + visitor)) * 100}%`,
            visitor: `${(visitor / (staff + visitor)) * 100}%`,
            inTotalCount: inTotalCount ? inTotalCount.split('') : [],
            outTotalCount: outTotalCount ? outTotalCount.split('') : []
          };
          console.log('init1Data', this.init1Data);
        }
      });
    },
    init2 (parames) {
      getDoorAccessFlowStatByDate(parames).then(res => {
        if (res.code === '200') {
          const dom_2 = document.getElementById('entrance_char_2');
          let myChart = echarts.init(dom_2);
          let date = [];
          let count1 = [];
          let count2 = [];
          res.data.map((item, index) => {
            date.push(item.simpleDateAxis);
            count1.push(Number(item.inFlowCount));
            count2.push(Number(item.outFlowCount));
          });
          let option = null;
          option = {
            grid: {
              left: '10px',
              right: '0px',
              top: '10px',
              bottom: '20px',
              containLabel: true
            },
            tooltip: {
              show: true,
              trigger: 'item'
            },
            legend: {
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: '#fff', fontSize: 12 },
              bottom: '0px',
              right: 'auto',
              borderRadius: 5,
              data: [{
                name: '进入',
                icon: 'rect'
              }, {
                name: '离开',
                icon: 'rect'
              }]
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                  color: '#A8EAFF',
                  fontSize: '10'
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#0F6384'
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
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#A8EAFF',
                    fontSize: '10'
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
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#0F6384'
                  }
                }
              }
            ],
            series: [
              {
                name: '进入',
                type: 'line',
                symbol: 'circle',
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: '#A2FFBC'
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#A2FFBC',
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 1,
                          color: 'rgba(127, 255, 240, 0.3)'
                        },
                        {
                          offset: 0,
                          color: 'rgba(134, 252, 238, 0)'
                        }
                      ])
                    }
                  }
                },
                data: count1
              },
              {
                name: '离开',
                type: 'line',
                symbol: 'circle',
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: '#FF6160'
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#FF6160',
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 1,
                          color: 'rgba(255, 75, 75, 0.3)'
                        },
                        {
                          offset: 0,
                          color: 'rgba(205, 33, 85, 0)'
                        }
                      ])
                    }
                  }
                },
                data: count2
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
    init3 () {
      const parames = {
        data: {},
        pageNo: 1,
        pageSize: 10
      };
      getDoorAccessInOutForPage(parames).then(res => {
        if (res.code === '200') {
          this.entrance.tableData = res.data.data;
        }
      });
    },
    init4 () {
      getDoorAccessDeviceList({
        data: {},
        pageNo: 1,
        pageSize: 10
      }).then(res => {
        if (res.code === '200') {
          this.deviceList = res.data.data;
          const parames = {
            serialNumber: res.data.data[0].serialNumber,
            dateInterval: 6
          };
          getDoorAccessCloseUpPic(parames).then(res => {
            if (res.code === '200') {
              this.init4Data = [0, 1, 2, 3].map(arr => {
                return {
                  ...res.data[0]
                }
              });
              console.log('this.init4Data', this.init4Data);
            }
          });
        }
      });
    },
    init5 (parames) {
      // doorAccessAlarm(parames).then(res => {
      //   if (res.code === '200') {
      //     const unThreat = +res.data.unThreat || 0;
      //     const threat = +res.data.threat || 0;
      //     this.init5Data = {
      //       unThreatPercent: (unThreat / (unThreat + threat)) * 100,
      //       ...res.data
      //     };
      //   }
      // });
    },
    init6 () {
      // doorAccessLogInstantWarnChart().then(res => {
      //   if (res.code === '200') {
      //     const dom_3 = document.getElementById('entrance_char_3');
      //     // console.log('dom_3', dom_3);
      //     let myChart = echarts.init(dom_3);
      //     let date = [];
      //     let count1 = [];
      //     let count2 = [];
      //     res.data.map((item, index) => {
      //       date.push(item.time);
      //       count1.push(Number(item.alarmNo));
      //     });
      //     let option = null;
      //     option = {
      //       grid: {
      //         left: '10px',
      //         right: '0px',
      //         top: '10px',
      //         bottom: '20px',
      //         containLabel: true
      //       },
      //       tooltip: {
      //         show: true,
      //         trigger: 'item'
      //       },
      //       legend: {
      //         show: false,
      //         itemHeight: 10,
      //         itemWidth: 10,
      //         textStyle: { color: '#fff', fontSize: 12 },
      //         bottom: '0px',
      //         right: 'auto',
      //         borderRadius: 5,
      //         data: [{
      //           name: '进入',
      //           icon: 'rect'
      //         }, {
      //           name: '离开',
      //           icon: 'rect'
      //         }]
      //       },
      //       xAxis: [
      //         {
      //           type: 'category',
      //           boundaryGap: false,
      //           axisLabel: {
      //             color: '#A8EAFF',
      //             fontSize: '10'
      //           },
      //           axisLine: {
      //             show: true,
      //             lineStyle: {
      //               color: '#0F6384'
      //             }
      //           },
      //           axisTick: {
      //             show: false
      //           },
      //           splitLine: {
      //             show: false,
      //             lineStyle: {
      //               color: '#0F6384'
      //             }
      //           },
      //           data: date
      //         }
      //       ],
      //       yAxis: [
      //         {
      //           type: 'value',
      //           name: '', // 左
      //           axisLabel: {
      //             formatter: '{value}',
      //             textStyle: {
      //               color: '#A8EAFF',
      //               fontSize: '10'
      //             }
      //           },
      //           axisLine: {
      //             show: false,
      //             lineStyle: {
      //               color: '#0F6384'
      //             }
      //           },
      //           axisTick: {
      //             show: false
      //           },
      //           splitLine: {
      //             show: true,
      //             lineStyle: {
      //               color: '#0F6384'
      //             }
      //           }
      //         }
      //       ],
      //       series: [
      //         {
      //           name: '告警数',
      //           type: 'line',
      //           symbol: 'circle',
      //           symbolSize: 3,
      //           smooth: false,
      //           lineStyle: {
      //             normal: {
      //               width: 1,
      //               color: '#F6683F'
      //             }
      //           },
      //           itemStyle: {
      //             normal: {
      //               color: '#F6683F',
      //               areaStyle: {
      //                 color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //                   {
      //                     offset: 1,
      //                     color: 'rgba(246, 104, 63, 0.3)'
      //                   },
      //                   {
      //                     offset: 0,
      //                     color: 'rgba(255, 104, 63, 0)'
      //                   }
      //                 ])
      //               }
      //             }
      //           },
      //           data: count1
      //         }
      //       ]
      //     };
      //     myChart.setOption(option, true);
      //     window.onresize = function () {
      //       myChart.resize();
      //     };
      //   }
      // });
    },
    changeStatistics (index) {
      const types = {
        '1': 0,
        '2': 1
      };
      if (this.statisticsId !== index) {
        this.statisticsId = index;
        this.init5(types[index]);
      }
    },
    handleMoreAlarm () {
      this._doorAccessAlarmDetail();
      this.entranceAlarm.show = true;
    },
    _doorAccessAlarmDetail () {
      let parames = {
        data: {
          ...this.entranceAlarm.searchVal
        },
        pageNo: Number(this.entranceAlarm.page.current), // 查询的分页页码
        pageSize: Number(this.entranceAlarm.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      doorAccessAlarmDetail(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.entranceAlarm.page.total = total;
          this.entranceAlarm.tableData = data;
        }
      });
    },
    onEntranceAlarmSearch (val) {
      this.entranceAlarm.searchVal = {
        alarmLevel: val.alarmLevel,
        onTime: val.time && val.time[0],
        closeTime: val.time && val.time[1]
      }
      this.onEntranceAlarmCurrentChange(1);
    },
    onEntranceAlarmCurrentChange (val) {
      this.entranceAlarm.page.current = val;
      this._doorAccessAlarmDetail()
    },
    onEntranceAlarmPageSizeChange (val) {
      this.entranceAlarm.page.pageSize = val
      this.onEntranceAlarmCurrentChange(1)
    },
    onEntranceAlarmSelectionChange (args) {
      this.entranceAlarm.selectsList = args
    },
    entranceAlarmCancel () {
      this.entranceAlarm.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.entranceAlarm.tableData = [];
      this.entranceAlarm.show = false;
      this.entranceAlarm.searchVal = {};
      this.$refs.entranceAlarmSearchForm.onReset();
    },
    entranceAlarmSubmit () {

    },
    handleMoreEntrance () {
      this._getDoorAccessInOutForPage();
      this.entranceDialog.show = true;
    },
    _getDoorAccessInOutForPage () {
      let parames = {
        data: {
          ...this.entranceDialog.searchVal
        },
        pageNo: Number(this.entranceDialog.page.current), // 查询的分页页码
        pageSize: Number(this.entranceDialog.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getDoorAccessInOutForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.entranceDialog.page.total = total;
          this.entranceDialog.tableData = data;
        }
      });
    },
    onEntranceDialogSearch (val) {
      this.entranceDialog.searchVal = {
        alarmLevel: val.alarmLevel,
        beginDate: val.time && val.time[0],
        endDate: val.time && val.time[1]
      }
      this.onEntranceDialogCurrentChange(1);
    },
    onEntranceDialogCurrentChange (val) {
      this.entranceDialog.page.current = val;
      this._getDoorAccessInOutForPage()
    },
    onEntranceDialogPageSizeChange (val) {
      this.entranceDialog.page.pageSize = val
      this.onEntranceDialogCurrentChange(1)
    },
    onEntranceDialogSelectionChange (args) {
      this.entranceDialog.selectsList = args
    },
    entranceDialogCancel () {
      this.entranceDialog.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.entranceDialog.tableData = [];
      this.entranceDialog.show = false;
      this.entranceDialog.searchVal = {};
      this.$refs.entranceDialogSearchForm.onReset();
    },
    entranceDialogSubmit () {

    },
    goMonitoring () {
      routePush({
        title: '智慧门禁实时监控详情',
        name: 'entranceTimeMonitoring'
      })
    }
  }
};
</script>

<style lang="less" scoped>
#entranceMap{
  position: relative;
  width: 100%;
  height: 100%;
  .el-row{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &::before{
      content: none;
    }
    .el-col{
      display: flex;
      &.flow{
        height: 25%;
      }
      &.inOutTrend{
        height: 36%;
      }
      &.monitoring{
        height: 32%;
      }
      &.statistics{
        height: 36%;
      }
      &.ranking{
        height: 28%;
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .infoBody{
    position: absolute;
    left: 3%;
    right: 3%;
    top: 0%;
    bottom: 3%;
    z-index: 1;
  }
  .infoContent{
    width: 25%;
    height: calc(100% - 37px);/*no*/
    position: absolute;
    top: 10px;/*no*/
    &.infoCenter{
      width: 40%;
      left: 50%;
      top: 50px;
      height: auto;
      transform: translateX(-50%);
      z-index: 2;
      .infoMain{
        justify-content: space-between;
        >div{
          align-items: center;
          cursor: pointer;
          img{
            width: 114px;
            height: 114px;
            margin-right: 19px;
          }
          .info{
            height: 100%;
            justify-content: space-around;
            .title{
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #7DC4FE;
            }
            .value{
              font-size: 40px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #FFFFFF;
              text-align: center;
            }
          }
        }
      }
    }
    &.infoLeft{
      left: 3%;/*no*/
      z-index: 2;
    }
    &.infoRight{
      right: 3%;/*no*/
      z-index: 1;
    }
    .el-col{
      >div{
        padding: 46px 13px 10px;/*no*/
        width: 100%;
        height: 100%;
        background: url(../images/entrance/img13.png) no-repeat center;
        background-size: 100% 100%;
        position: relative;
      }
    }
    .item_title {
      position: absolute;
      width: calc(100% - 26px);/*no*/
      top: 11px;
      left: 12px;/*no*/
      height: 32px;
      min-height: 25px;/*no*/
      span{
        display: flex;
        align-items: center;
        height: 100%;
        width: 50%;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #8DE4FF;
        position: relative;
        padding-left: 18px;
        background: url(../images/entrance/img4.png) no-repeat center;
        background-size: 100% 100%;
      }
      .more{
        position: absolute;
        top: 50%;
        right: 0px;/*no*/
        transform: translateY(-50%);
        font-size: 12px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        color: #40C7F0;
        cursor: pointer;
      }
    }
    .charTitle{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      span{
        width: 46px;/*no*/
        height: 20px;/*no*/
        border: 1px solid #2184C9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #47B3FF;
        cursor: pointer;
        &.is-active{
          background: #2D86A7;
          border: 1px solid #2FBFF8;
          font-size: 12px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }
      }
    }
    .l_item_1{
      height: 100%;
      position: relative;
      .detail{
        height: 100%;
        padding: 0 10px;/*no*/
        overflow: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
          //滚动条凹槽的颜色，还可以设置边框属性
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 3px;/*no*/
          height: 2px;
          border-radius: 3px;/*no*/
        }
        &::-webkit-scrollbar-thumb {
          //滚动条的设置
          background-color: #0a2e54;
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #0a2e54;
        }
        .peopleNumber{
          justify-content: space-between;
          >div{
            max-width: 50%;
            overflow: hidden;
            .title{
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              color: #24C7FF;
              margin-bottom: 7px;
            }
            ul{
              width: 100%;
              li{
                width: 26px;
                height: 38px;
                font-size: 26px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #B2EDFF;
                background: url(../images/entrance/img16.png) no-repeat center;
                margin-right: 4px;/*no*/
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
        .progress{
          margin-top: 5%;
          .number{
            justify-content: space-between;
            margin-bottom: 3px;/*no*/
            span{
              display: flex;
              font-size: 20px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #FFFFFF;
              line-height: 24px;
            }
          }
          .example{
            background: linear-gradient(135deg, #07437A 0%, rgba(3, 69, 118, 0.82) 100%);
            border-radius: 2px;/*no*/
            padding: 4px 9px 4px 4px;
            margin:5px 0 15px 0;
            position: relative;
            >div{
              width: 100%;
              height: 24px;
              background: url(../images/entrance/img17.png) repeat-x 0;
              background-size: 13px 24px;
              &.staff{
                width: auto;
                position: absolute;
                left: 4px;
                top: 4px;
                bottom: 4px;
                right: 9px;
                background: #07437A url(../images/entrance/img18.png) repeat-x 0;
                background-size: 13px 24px;
              }
            }
          }
          .lengs{
            >div{
              margin-right: 24px;
              display: flex;
              align-items: center;
              i{
                font-size: 16px;/*no*/
                background-image: -webkit-linear-gradient(-45deg, #23FFCD 20%, #02BC92 60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              font-size: 12px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              color: #5A9EF4;
              &:last-child{
                i{
                  background-image: -webkit-linear-gradient(-45deg, #EDC24E 20%, #F1684C 60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
            }
          }
        }
      }
    }
    .l_item_2{
      height: 100%;
      position: relative;
      #entrance_char_2{
        height: calc(100%);/*no*/
      }
      .charTitle{
        width: auto;
        position: absolute;
        right: 10px;/*no*/
        top: 11px;/*no*/
      }
    }
    .l_item_3{
      height: 100%;
      position: relative;
      overflow: hidden;
      .comp-page-table{
        height: 100%;
        padding: 0;
        /deep/.el-table{
          height: 100%;
          overflow: hidden;
        }
        /deep/.el-table__header-wrapper{
          .el-table__header{
            width: 100% !important;
            th{
              .cell{
                padding: 0 !important;
              }
            }
          }
        }
        /deep/.el-table__body-wrapper{
          height: calc(100% - 40px);
          overflow-y: auto;
          &::-webkit-scrollbar {
              width: 2px;/*no*/
            }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
            background:#ececec;
          }
          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(236,239,246,0.2);/*no*/
            border-radius: 0;
            background:transparent;
          }
        }
      }
      .cardList{
        height: calc(50%);/*no*/
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
          //滚动条凹槽的颜色，还可以设置边框属性
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 3px;/*no*/
          height: 2px;
          border-radius: 3px;/*no*/
        }
        &::-webkit-scrollbar-thumb {
          //滚动条的设置
          background-color: #0a2e54;
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #0a2e54;
        }
        .cardItem{
          padding: 5px 15px;/*no*/
          background: linear-gradient(135deg, rgba(92, 218, 250, 0.16) 0%, rgba(67, 122, 227, 0.02) 100%);
          border: 1px solid;
          border-image: linear-gradient(135deg, rgba(50, 193, 173, 0.41), rgba(41, 119, 181, 0.53)) 1 1;
          margin-bottom: 10px;/*no*/
          align-items: center;
          position: relative;
          img{
            width: 27px;/*no*/
            height: 24px;/*no*/
            margin-right: 15px;
          }
          .cardInfo{
            .title{
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF;
              margin-bottom: 3px;/*no*/
            }
            .time {
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #A8EAFF;
            }
          }
          .cardLabel{
            position: absolute;
            right:12px;/*no*/
            top: 50%;
            transform: translateY(-50%);
            padding: 2px 10px;/*no*/
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            color: #FFFFFF;
            display: inline-table;
            background: linear-gradient(138deg, #3579D5 0%, #0B71D0 100%);
          }
        }
      }
    }
    .l_item_4{
      height: 100%;
      position: relative;
      background: url(../images/entrance/img9.png) no-repeat center !important;
      background-size: 100% 100% !important;
      .itemList{
        width: 100%;
        flex-wrap: wrap;
        flex-direction: row;
        margin-right: 0 !important;
        margin-left: 0 !important;
        .item{
          height: calc(50% - 5px);/*no*/
          margin-bottom: 10px;/*no*/
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .el-image {
            height: 100%;
            width: auto;
            max-width: 100%;
            max-height: inherit !important;
            padding: 0;
          }
          .place{
            position: absolute;
            bottom: 0;
            right: 5px;/*no*/
            left: 5px;/*no*/
            height: auto;
            width: auto;
            background: rgba(67, 122, 227, 0.2);
            color: #fff;
            font-size: 12px;
            text-align: left;
            padding: 5px 5px;/*no*/
            span{
              overflow:hidden; //超出的文本隐藏
              text-overflow:ellipsis; //溢出用省略号显示
              white-space:nowrap; //溢出不换行
            }
          }
          &:nth-of-type(3), &:nth-of-type(4) {
            margin-bottom: 0;
          }
        }
      }
    }
    .l_item_5{
      height: 100%;
      position: relative;
      background: url(../images/entrance/img9.png) no-repeat center !important;
      background-size: 100% 100% !important;
      display: flex;
      flex-direction: column;
      .progress{
        .progressInfo{
          justify-content: space-between;
          margin-bottom: 5px;/*no*/
          >div{
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            color: #FFFFFF;
          }
        }
        /deep/.el-progress{
          .el-progress-bar{
            margin-right: 0;
            padding-right: 0;
            .el-progress-bar__outer{
              background: linear-gradient(270deg, #1BC3A3 0%, #52E5EE 100%);
              .el-progress-bar__inner{
                border-radius: 0;
              }
            }
          }
          .el-progress__text{
            display: none;
          }
        }
      }
      .charTitle{
        margin: 11px 0;/*no*/
      }
      .seamless-warp {
        height: calc(100% - 42px - 34px);/*no*/
        overflow: hidden;
        .cardList {
          height: calc(100%);/*no*/
          overflow-y: auto;
          &::-webkit-scrollbar-track-piece {
            //滚动条凹槽的颜色，还可以设置边框属性
            background-color: transparent;
          }
          &::-webkit-scrollbar {
            //滚动条的宽度
            width: 3px;/*no*/
            height: 2px;
            border-radius: 3px;/*no*/
          }
          &::-webkit-scrollbar-thumb {
            //滚动条的设置
            background-color: #0a2e54;
            background-clip: padding-box;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: #0a2e54;
          }
          .cardItem{
            padding: 5px 12px;/*no*/
            background: linear-gradient(135deg, rgba(92, 218, 250, 0.15) 0%, rgba(67, 122, 227, 0.11) 100%);
            border: 1px solid;/*no*/
            border-image: linear-gradient(135deg, rgba(50, 193, 173, 0.56), rgba(41, 119, 181, 0.53)) 1 1;
            margin-bottom: 10px;/*no*/
            align-items: center;
            position: relative;
            &::after{
              content: '';
              width: 2px;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background: linear-gradient(180deg, #5FD1FF 0%, #75A5FF 100%);
            }
            img{
              width: 34px;/*no*/
              height: 34px;/*no*/
              margin-right: 12px;
            }
            .cardInfo{
              width: calc(100% - 34px - 68px - 20px);/*no*/
              padding-right: 10px;/*no*/
              .title{
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                margin-bottom: 3px;/*no*/
                word-break: keep-all;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .time {
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #A8EAFF;
                word-break: keep-all;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
            }
            .cardLabel{
              width: 68px;/*no*/
              // position: absolute;
              // right:12px;/*no*/
              // top: 50%;
              // transform: translateY(-50%);
              padding: 2px 10px;/*no*/
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              color: #FFFFFF;
              display: inline-table;
              background: linear-gradient(138deg, #2099C6 0%, #544BE5 100%);
              word-break: keep-all;
            }
          }
        }
      }
    }
    .l_item_6{
      height: 100%;
      position: relative;
      background: url(../images/entrance/img9.png) no-repeat center !important;
      background-size: 100% 100% !important;
      #entrance_char_3{
        height: calc(100%);/*no*/
      }
      .cardList{
        height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
          //滚动条凹槽的颜色，还可以设置边框属性
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 3px;/*no*/
          height: 2px;
          border-radius: 3px;/*no*/
        }
        &::-webkit-scrollbar-thumb {
          //滚动条的设置
          background-color: #0a2e54;
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #0a2e54;
        }
        .cardItem {
          padding:10px 0;/*no*/
          border-bottom: 1px solid;/*no*/
          border-image: linear-gradient(rgba(111, 215, 250, 0.3) 0%, rgba(0, 108, 170, 1) 50%, rgba(111, 215, 250, 0.3) 100%)1;
          position: relative;
          img{
            width: 19px;/*no*/
            height: 17px;/*no*/
            height: auto;
            margin-right: 20px;
          }
          .title {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
          }
          .value{
            display: flex;
            align-items: center;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #4AFAFF;
          }
        }
      }
     }
  }
  .el-image{
    width: 100%;
    height: 100%;
    max-height: 60px;/*no*/
    .image-error{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #c0c4cc;
      vertical-align: middle;
    }
  }
}
</style>
