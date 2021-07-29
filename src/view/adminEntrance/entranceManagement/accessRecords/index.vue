/* eslint-disable camelcase */
<template>
  <div id='accessRecords' >
    <!-- 出入记录查询 -->
    <header-title
      icon="iconfont icon-shouye"
      title="出入记录查询"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        :otherBtnVisible="true"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add');"
        :otherBtnLists="[
          {
            label: '导出',
            click: () => exportInfo()
          }
        ]"
      >
        <template slot="treeNodeCode">
          <treeselect :value="searchVal.treeNodeCode" @select="tressSearchSelectInput" :multiple="false"/>
        </template>
      </search-form>
    </header-title>
    <card title="进出趋势" :className="'adminCard conditionCard'">
      <el-row :gutter="10" class="flexRow chartTable">
        <el-col :span="12">
          <div class="content">
            <div class="flexRow chartList">
              <div class="flexRow lists">
                <span @click="changeTrend('6')" :class="{'is-active': trendId === '6'}">今日</span>
                <span @click="changeTrend('5')" :class="{'is-active': trendId === '5'}">本周</span>
                <span @click="changeTrend('4')" :class="{'is-active': trendId === '4'}">本月</span>
                <span @click="changeTrend('2')" :class="{'is-active': trendId === '2'}">近半年</span>
                </div>
            </div>
            <div id="char_2"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content">
            <span>门禁点人流量排名</span>
            <div class="flexCloumn listItems">
              <div
                class="flexRow item"
                v-for="item in rankingArray"
                :key="item.address"
              >
                <img src="./images/img8.png" />
                <div class="title">{{item.doorAccessSite}}</div>
                <div class="value">{{item.flowCount}}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </card>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          :operator="false"
          :selection="false"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <!-- <template
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
          </template> -->
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
                匹配失败
              </div>
            </el-image>
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
import treeselect from '@/view/smokeDetector/smokeManage/cameraEvent/treeselect';
import Card from 'view/lightPole/lightPoleStatistical/components/card';
import config, { baseURL } from '@/config';
import { download } from '@/util/util';
import {
  getDoorAccessFlowStatByDate,
  getDoorAccessFlowCountTop10,
  getDoorAccessInOutForPage,
  exportDoorAccessInOutInfo
} from 'api/entrance';
export default {
  name: 'accessRecords',
  data () {
    return {
      baseURL,
      config,
      searchVal: {
        treeNodeCode: null
      },
      searchItems: [{
        type: 'dataPicker',
        label: '时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'input',
        label: '姓名',
        props: {
          fieldName: 'personName'
        }
      }, {
        type: 'select',
        label: '访客类型',
        props: {
          fieldName: 'visitorType',
          options: [{
            id: 1,
            name: '员工'
          }, {
            id: 2,
            name: '访客'
          }]
        }
      }, {
        type: 'custom',
        label: '门禁',
        props: {
          fieldName: 'treeNodeCode'
        }
      }, {
        type: 'select',
        label: '出入类型',
        props: {
          fieldName: 'inOutFlag',
          options: [{
            id: 1,
            name: '进门'
          }, {
            id: 0,
            name: '出门'
          }]
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
        { label: '登记照片',
          prop: 'matchPic',
          custom: true
        },
        { label: '抓拍照片',
          prop: 'closeupPic',
          custom: true
        },
        { label: '门禁',
          prop: 'deviceModuleName',
          minWidth: '80px'
        },
        { label: '姓名',
          prop: 'personName'
        },
        { label: '手机号',
          prop: 'mobilePhone'
        },
        { label: '性别',
          prop: 'sexText'
        },
        { label: '身份证号',
          prop: 'identityNo'
        },
        { label: '访客类型',
          prop: 'visitorTypeText'
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
        },
        { label: '出入类型',
          prop: 'inOutFlagText'
        }
      ],
      myChart: null,
      time: undefined,
      trendId: undefined,
      rankingArray: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
      this.changeTrend('6');
      this.ranking();
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    treeselect,
    Card
  },
  methods: {
    exportInfo() {
      exportDoorAccessInOutInfo().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, "出入记录.xls");
      })
    },
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        treeNodeCode: this.searchVal.treeNodeCode,
        beginDate: val.time && val.time[0],
        endDate: val.time && val.time[1]
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
      getDoorAccessInOutForPage(data).then(res => {
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
    changeTrendTime (e) {
      this.initChart({
        dateInterval: +this.trendId
      });
    },
    changeTrend (index) {
      if (this.trendId !== index) {
        this.trendId = index;
        this.initChart({
          dateInterval: +index
        });
      }
    },
    initChart (parames) {
      getDoorAccessFlowStatByDate(parames).then(res => {
        if (res.code === '200') {
          const dom_2 = document.getElementById('char_2');
          this.myChart = echarts.init(dom_2);
          window.onresize = function () {
            this.myChart && this.myChart.resize();
          };
          let date = [];
          let count1 = [];
          let count2 = [];
          res.data.map((item, index) => {
            date.push(item.simpleDateAxis);
            count1.push(Number(item.inFlowCount));
            count2.push(Number(item.outFlowCount));
          });
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
              data: date
            },
            series: [
              {
                name: '进入',
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
                data: count1
              },
              {
                name: '离开',
                type: 'bar',
                barWidth: 15,
                // stack: '1',
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
                data: count2
              }
            ]
          };
          this.myChart.setOption(option, true);
        }
      });
    },
    ranking () {
      getDoorAccessFlowCountTop10().then(res => {
        if (res.code === '200') {
          this.rankingArray = res.data;
        }
      });
    },
    tressSearchSelectInput (val) {
      this.searchVal.treeNodeCode = val.id;
    }
  }
}
</script>

<style lang="less">
#accessRecords{
  #treeselect{
    width: 250px;/*no*/
  }
  .chartTable {
    background: #fff;
    margin-left: 0 !important;
    margin-right: 0 !important;
    position: relative;
    .content{
      width: 100%;
    }
    .chartList{
      align-items: center;
      justify-content: center;
      .el-date-editor{
        flex: 1;
      }
      .lists{
        margin-right: 10px;/*no*/
        span{
          &:last-child{
            margin-right: 20px;/*no*/
          }
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
    #char_2 {
      height: 432px;
    }
    .el-col{
      height: 100%;
      &:last-child{
        clear:both
      }
      &:nth-of-type(2){
        position: absolute;
        top: 0px;
        bottom: 0;
        right: 0px;
        .content{
          height: 100%;
          // padding: 20px;/*no*/
        }
        span{
            font-size: 14px;/*no*/
            font-weight: 600;
            margin-bottom: 10px;/*no*/
          }
          .listItems{
            flex: 1;
            height: calc(100% - 19px);/*no*/
            justify-content: space-between;
            overflow-y: auto;
            // 滚动条
            &::-webkit-scrollbar-track-piece {
              //滚动条凹槽的颜色，还可以设置边框属性
              background-color: transparent;
            }
            &::-webkit-scrollbar {
              //滚动条的宽度
              width: 2px;/*no*/
              height: 2px;/*no*/
              border-radius: 10px;/*no*/
            }
            &::-webkit-scrollbar-thumb {
              //滚动条的设置
              background-color: transparent;
              background-clip: padding-box;
              min-height: 28px;/*no*/
            }
            &::-webkit-scrollbar-thumb:hover {
              background-color: transparent;
            }
            .item{
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
                // color: #FFFFFF;
              }
              .value{
                display: flex;
                align-items: center;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                font-size: 16px;
                font-weight: bold;
                // color: #4AFAFF;
              }
              &:last-child{
                border-bottom: none;
              }
            }
          }
      }
    }
  }
  .el-image{
    width: 100%;
    height: 100%;
    max-height: 80px;/*no*/
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
