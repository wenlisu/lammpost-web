<template>
  <div class="monthlyReport">
    <div>
      <el-row :gutter="10" class="list2">
        <el-col :span="24">
          <div class="content">
            <div class="title">用水总收入分析</div>
            <div id="chart_1" class="chart"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="searchBox">
        <search-form
          :searchItems="searchItems"
          @onSearch="onSearch"
          :otherBtnVisible="true"
          :otherBtnLists="[
            {
              label: '导出',
              click: () => { this.export() }
            }
          ]"
        />
      </div>
    </div>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        ></page-table>
      </div>
    </div>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import treeselect from '../tree';
import PageTable from '@/components/adminPage-table';
import searchForm from 'components/adminSearchForm/searchForm';
import * as echarts from 'echarts';
import { download } from '@/util/util';
import {
  exportWaterChargeStatsByMonth,
  getWaterChargeStatsByMonthForPage,
  getWaterChargeInRevenueStats
} from 'api/water'
import {
  getParkDeviceTree
} from 'api/index';
export default {
  components: {
    card,
    treeselect,
    PageTable,
    searchForm
  },
  data () {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'monthPicker',
          label: '年份',
          initValue: '',
          props: {
            type: 'year',
            fieldName: 'chargeYear',
            format: 'yyyy'
          },
        },{
          type: 'input',
          label: '水表编码',
          initValue: '',
          props: {
            fieldName: 'serialNumber',
          },
        },{
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
      form: {
        year: "",
        serialNumber: "",
        location: null
      },
      locationInfo: {
        areaCode: "",
        buildingCode: "",
        parkCode: "",
        streetCode: ''
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [],
      init_1_Chart: ''
    }
  },
  created () {
    this.getTableCols()
    this._getParkDeviceTree()
    this.onCurrentChange(1)
  },
  mounted () {
    this.initChart_1()
    this._getWaterChargeInRevenueStats()
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
          this.searchItems[2].props.options = treeData
          this.searchVal = {
            streetCode: treeData[0].id || ''
          }
        }
      });
      // return treeData;
    },
    _getWaterChargeInRevenueStats () {
      const  params = {
        dateInterval: 1
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
          this.init_1_Chart.setOption(newOptions)
        }
      })
    },
    async initChart_1 () {
      let dom_1 = document.getElementById('chart_1');
      this.init_1_Chart = echarts.init(dom_1);
      const chartOptions = await this.getCharts_1_options();
      this.init_1_Chart.setOption(chartOptions)
    },
    // 默认初始图表
    getCharts_1_options () {
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
    getTableCols () {
      let year = null
      if(this.searchVal.chargeYear) {
        year = this.searchVal.chargeYear;
      } else {
        const date = new Date();
        year = date.getFullYear();
      }
      let item = []
      let propsText = ['januaryMoney', 'februaryMoney', 'marchMoney', 'aprilMoney', 'mayMoney', 'juneMoney', 'julyMoney', 'augustMoney', 'septemberMoney', 'octoberMoney', 'novemberMoney', 'decemberMoney']
      for (let i=1; i<=12; i++) {
        item.push({
          label: `${year}年${i}月`,
          prop: propsText[i-1]
        })
      }
      this.tableCols = [
        {
          label: '水表编码',
          prop: 'serialNumber'
        },
        {
          label: '位置',
          prop: 'installAddress'
        },
        ...item,
        {
          label: '合计',
          prop: 'total'
        }
      ]
      // this.tableCols.splice(2, 0, ...item);
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.getTableCols()
      this.onCurrentChange(1)
      
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
      getWaterChargeStatsByMonthForPage(params).then(res => {
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
    },
    onSelectionChange () {},
    export () {
      exportWaterChargeStatsByMonth().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, "缴费月报.xls");
      })
    }
  }
}
</script>

<style lang="less">
.monthlyReport {
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
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    display: inline-block;
    width: 100%;
  }
  .el-button {
    margin-left: 10px /*no*/;
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
  .marginRight {
    margin-right: 20px;
  }
}
</style>