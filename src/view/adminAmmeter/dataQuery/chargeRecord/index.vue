/* eslint-disable camelcase */
<template>
  <div id='chargeRecord' >
    <div class="searchBox">
      <search-form
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </div>
    <!-- <el-form :model="recordInfo" ref="form" label-width="100px" label-position="left">
      <card title="" :className="'adminCard basicsCard'">
        <el-row>
          <el-col :span="8" class="marginRight">
            <el-form-item label="月份:" label-width="80px" prop="dateNow">
              <el-date-picker
                v-model="recordInfo.dateNow"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="marginRight">
            <el-form-item label="电表编码:" label-width="80px" prop="serialNumber">
              <el-input v-model="recordInfo.serialNumber" placeholder="请输入电表编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="small" @click="onSearch">查询</el-button>
            <el-button type="primary" size="small" @click="resetData">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="marginRight">
            <el-form-item label="位置:" label-width="80px">
              <treeselect :value="recordInfo.location" @input="tressSelectInput" @getNode="getParams" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴费用户:" label-width="80px" prop="payUser">
              <el-input v-model="recordInfo.payUser" placeholder="请输入缴费用户"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </card>
    </el-form> -->

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
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import treeselect from '../../waterTreeSelect';
import {
  getWaterMeterPayRecordForPage
} from '@/api/water';
import {
  getParkDeviceTree
} from 'api/index';
export default {
  name: 'chargeRecord',
  data () {
    return {
      searchItems: [
        {
          type: 'dataPicker',
          label: '月结日',
          props: {
            fieldName: 'dateNow'
          }
        },{
          type: 'input',
          label: '电表编码',
          props: {
            fieldName: 'serialNumber'
          }
        },{
          type: 'input',
          label: '缴费用户',
          props: {
            fieldName: 'payUser'
          }
        },{
          type: 'treeselect',
          label: '位置',
          props: {
            fieldName: 'location',
            options: []
          },
          callback: (action, parentNode, callback) => { return this.loadOptions(action, parentNode, callback)}
        }
      ],
      recordInfo: {
        dateNow: "",
        payUser: "",
        serialNumber: "",
        location: null
      },
      locationInfo: {
        areaCode: "",
        buildingCode: "",
        parkCode: "",
        streetCode: ''
      },
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '月结日',
          prop: 'readingTime'
        },
        { label: '电表编码',
          prop: 'serialNumber'
        },
        { label: '电表地址',
          prop: 'installAddress'
        },
        { label: '应付金额(元)',
          prop: 'totalPayMoney'
        },
        { label: '缴费用户',
          prop: 'payUser'
        },
        { label: '缴费方式',
          prop: 'payWay'
        },
        { label: '缴费时间',
          prop: 'payTime'
        },
        { label: '缴费金额',
          prop: 'totalPayMoney'
        },
        { label: '缴费状态',
          prop: 'payStatusText'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1)
      this._getParkDeviceTree()
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    card,
    treeselect
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
        }
      });
      // return treeData;
    },
    getParams (node) {
      this.locationInfo.areaCode = node.areaId;
      this.locationInfo.buildingCode = node.buildingId ? node.buildingId : "";
      this.locationInfo.parkCode = node.parkId ? node.parkId : "";
      this.locationInfo.streetCode = node.floorId ? node.floorId : ""
    },
    // 日期选项
    onSearch (val) {
      this.recordInfo = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          serialNumber: this.recordInfo.serialNumber ? this.recordInfo.serialNumber : '',
          payStatus: 0,
          payUser: this.recordInfo.payUser ? this.recordInfo.payUser : '',
          timeBegin: this.recordInfo.dateNow ? this.recordInfo.dateNow[0] : "",
          timeEnd: this.recordInfo.dateNow ? this.recordInfo.dateNow[1] : "",
          streetCode: this.recordInfo.location ? this.recordInfo.location : ''
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getWaterMeterPayRecordForPage(data).then(res => {
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
    onSelectionChange () {}
  }
}
</script>

<style lang="less">
#chargeRecord{
  .searchBox {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
  }
  .marginRight {
    margin-right: 20px;
  }
  .el-button--primary {
    background-color: #2573f1 !important;
    border-color: transparent;
    border-radius: none !important;
    border-radius: unset;
    min-width: 90px;
    font-size: 14px;
  }
}
</style>
