<template>
  <div class="paymentAlarm">
    <div class="info-card">
      <el-row :gutter="10" class="list">
        <el-col :span="8">
          <div class="content">
            <div class="main-title">总</div>
            <ul>
              <li class="title">总用户数</li>
              <li class="charge">{{payInfo.totalCount}}户</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">未</div>
            <ul>
              <li class="title">未缴费用户</li>
              <li class="charge">{{payInfo.unPayCount}}户</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content">
            <div class="main-title">已</div>
            <ul>
              <li class="title">已缴费用户</li>
              <li class="charge">{{payInfo.payCount}}户</li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="searchColum">
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
          @selection-change="onSelectionChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <span>取消</span>
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
import { getWaterChargePayShapeStats, getWaterChargeAlarm } from 'api/water'
import {
  getParkDeviceTree
} from 'api/index';
export default {
  components: {
    card,
    PageTable,
    searchForm
  },
  data () {
    return {
      payInfo: {
        totalCount: 0,
        unPayCount: 0,
        payCount: 0
      },
      searchItems: [
        {
          type: 'monthPicker',
          label: '月份',
          initValue: '',
          props: {
            type: 'monthrange',
            fieldName: 'month'
          },
        },{
          type: 'input',
          label: '水表编码',
          initValue: '',
          props: {
            fieldName: 'serialNumber',
          },
        },{
          type: 'input',
          label: '缴费用户',
          initValue: '',
          props: {
            fieldName: 'payUser',
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
        { label: '月份',
          prop: 'readingTime'
        },
        { label: '水表编码',
          prop: 'serialNumber'
        },
        { label: '位置',
          prop: 'installAddress'
        },
        { label: '应付金额(元)',
          prop: 'waterMoney'
        },
        { label: '缴费金额(元)',
          prop: 'payMoney'
        },
        { label: '欠费(元)',
          prop: 'arrearsMoney'
        },{
          label: '缴费用户',
          prop: 'payUser'
        },{
          label: '用户联系电话',
          prop: 'payUserTel'
        },{
          label: '缴费时间',
          prop: 'payTime'
        },{
          label: '截止缴费时间',
          prop: 'endingPayTime'
        },{
          label: '缴费状态',
          prop: ''
        }
      ]
    }
  },
  created () {
    this._getParkDeviceTree()
    this._getWaterChargePayShapeStats()
    this.onCurrentChange(1)
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
          this.searchItems[3].props.options = treeData
          this.searchVal = {
            streetCode: treeData[0].id || ''
          }
        }
      });
      // return treeData;
    },
    _getWaterChargePayShapeStats() {
      const params = {
        dateInterval: 0
      }
      getWaterChargePayShapeStats(params).then(res => {
        if(res.code == '200') {
          for(let key in this.payInfo) {
            this.payInfo[key] = res.data[key] || 0
          }
        }
      })
    },
    onSearch (val) {
      this.searchVal = {
        ...val,
        monthBegin: val.month ? val.month[0] : '',
        monthEnd: val.month ? val.month[1] : ''
      }
      val.month ? delete this.searchVal.month : null
      this.onCurrentChange(1);
    },
    getDataAllList () {
      const params = {
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: ""
      }
      getWaterChargeAlarm(params).then(res => {
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
.paymentAlarm {
  .searchColum {
    margin-top: 10px;
  }
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    display: inline-block;
    width: 100%;
  }
  .chart {
    background: #ffffff;
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
  .searchForm {
    margin-top: 10px;
    .el-button {
      margin-left: 10px;
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
  }
  .marginRight {
    margin-right: 20px;
  }
}
</style>