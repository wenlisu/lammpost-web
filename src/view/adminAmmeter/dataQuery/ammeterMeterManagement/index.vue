/* eslint-disable camelcase */
<template>
  <div id='meterManagement' >
    <div class="searchBox">
      <el-row>
          <div class="flexRow">
            <div class="item borderLine">
              <p>电表总数(个)</p>
              <div><span>{{devInfo.totalCount}}</span></div>
            </div>
            <div class="item borderLine">
              <p class="normalMark">正常设备(个)</p>
              <div><span>{{devInfo.onlineCount}}</span></div>
            </div>

            <div class="item borderLine">
              <p class="alarmMark">预警设备(个)</p>
              <div><span>{{devInfo.alarmCount}}</span></div>
              <div class="line"></div>
            </div>
            <div class="item">
              <p class="malfunctionMark">故障设备(个)</p>
              <div><span>{{devInfo.faultCount}}</span></div>
            </div>
          </div>
        </el-row>
        <el-row>
          <search-form
            :searchItems="searchItems"
            @onSearch="onSearch"
          />
        </el-row>
    </div>
    <!-- <el-form :model="managementInfo" ref="form" label-width="100px" label-position="left">
      <card title="" :className="'adminCard basicsCard'">
        <el-row>
          <el-col :span="6" class="marginRight">
            <el-form-item label="电表编码:" label-width="80px" prop="serialNumber">
              <el-input v-model="managementInfo.serialNumber" placeholder="请输入电表编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="marginRight">
            <el-form-item label="电表地址:" label-width="80px" prop="serialNumber">
              <treeselect :value="managementInfo.location" @getNode="getParams"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="marginRight">
            <el-form-item label="用户名称:" label-width="80px" prop="serialNumber">
              <el-input v-model="managementInfo.userName" placeholder="请输入用户名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="marginRight">
            <el-form-item label="电表状态:" label-width="80px">
              <el-select v-model="managementInfo.onlineStatus" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="small" @click="onSearch">查询</el-button>
            <el-button type="primary" size="small" @click="resetData">重置</el-button>
          </el-col>
        </el-row>
      </card>
    </el-form> -->

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
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button type="text" size="small" title="详情" :style="{marginRight: '10px'}" @click.prevent.stop="showView({
                ...scope.row
              })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
              </el-button>
              <!-- <el-button type="text" size="small" title="控制策略" @click.prevent.stop="showView('action', {
                ...scope.row
              })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-celvekongzhi" style="fontSize: 20px; color: #FF5736" />
              </el-button> -->
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
// import treeselect from '../waterTreeSelect';
import {
  getWaterMeterDeviceForPage,
  getWaterMeterRunStatus
} from '@/api/water';
import {
  getParkDeviceTree
} from 'api/index';
export default {
  name: 'meterManagement',
  data () {
    return {
      searchItems: [{
        type: 'input',
        label: '电表编码',
        props: {
          fieldName: 'serialNumber'
        }
      }, {
        type: 'input',
        label: '房间名称',
        props: {
          fieldName: 'deviceName'
        }
      }, {
        type: 'input',
        label: '用户名称',
        props: {
          fieldName: 'userName'
        }
      }, {
        type: 'select',
        label: '电表状态',
        props: {
          fieldName: 'onlineStatus',
          options: [{
            id: '1',
            name: '在线'
          }, {
            id: '2' || '3',
            name: '离线'
          }]
        }
      }, {
        type: 'treeselect',
        label: '位置',
        props: {
          fieldName: 'streetCode',
          options: []
        },
        callback: (action, parentNode, callback) => { return this.loadOptions(action, parentNode, callback) }
      }
      ],
      options: [{
        id: '1',
        name: '在线'
      }, {
        id: '2' || '3',
        name: '离线'
      }],
      locationInfo: {
        areaCode: '',
        buildingCode: '',
        parkCode: '',
        streetCode: ''
      },
      devInfo: {
        totalCount: '',
        onlineCount: '',
        alarmCount: '',
        faultCount: ''
      },
      managementInfo: {
        serialNumber: '',
        location: null,
        userName: '',
        onlineStatus: ''
      },
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '电表编号',
          prop: 'serialNumber'
        },
        { label: '电表地址',
          prop: 'installAddress'
        },
        { label: '电表类型',
          prop: 'readingValue'
        },
        { label: '电表口径',
          prop: 'waterMeterDiameter'
        },
        { label: '用户名称',
          prop: 'securityUser'
        },
        { label: '用户类型',
          prop: 'userType'
        },
        { label: '手机号码',
          prop: 'securityUserTel'
        },
        { label: '电表状态',
          prop: 'onlineStatusText'
        },
        { label: '当前读数',
          prop: 'readingValue'
        }
      ]
    }
  },
  created () {
    this.getDevStatus();
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
    card
  },
  methods: {
    showView (row) {
      console.log(row)
      this.$router.push({
        name: 'dataDetail',
        query: {serialNumber: row.serialNumber}
      })
    },
    async loadOptions (action, parentNode, callback) {
      let data = {
        parentNodeCode: parentNode.id,
        deviceTypeNo: 'WATER_METER'
      }
      if (action == 'LOAD_CHILDREN_OPTIONS') {
        this.loadChildren(data, parentNode, callback)
      }
    },
    async loadChildren (data, parentNode, callback) {
      let treeData = [];
      await getParkDeviceTree(data).then(res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            let children = null;
            if (daItem.nodeLevel == 5) {
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
    async _getParkDeviceTree (data = {parentNodeCode: '0', deviceTypeNo: 'WATER_METER'}) {
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
          this.searchItems[4].props.options = treeData
        }
      });
      // return treeData;
    },
    // 获取设备状态
    async getDevStatus () {
      let res = await getWaterMeterRunStatus();
      if (res.code == '200') {
        this.devInfo.totalCount = res.data.totalCount;
        this.devInfo.onlineCount = res.data.onlineCount;
        this.devInfo.alarmCount = res.data.alarmCount;
        this.devInfo.faultCount = res.data.faultCount;
      }
    },
    // 获取地址参数
    getParams (node) {
      this.locationInfo.areaCode = node.areaId ? node.areaId : '';
      this.locationInfo.buildingCode = node.buildingId ? node.buildingId : '';
      this.locationInfo.parkCode = node.parkId ? node.parkId : '';
      this.locationInfo.streetCode = node.floorId ? node.floorId : ''
    },
    // 重置
    resetData () {
      this.managementInfo = {
        serialNumber: '',
        location: null,
        userName: '',
        onlineStatus: ''
      }
      this.onCurrentChange(1);
    },
    // 查询
    onSearch (val) {
      this.managementInfo = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.managementInfo
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getWaterMeterDeviceForPage(data).then(res => {
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
#meterManagement{
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
  .flexRow {
    display: flex;
    margin-bottom: 25px;
    .line {
      width: 1px;
      border-right: 1px solid;
    }
    .normalMark::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100px;
      background-color: #2573f1;
      margin-right: 5px;
    }
    .alarmMark::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100px;
      background-color: #f36f16;
      margin-right: 5px;
    }
    .malfunctionMark::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100px;
      background-color: #f11313;
      margin-right: 5px;
    }
    .borderLine {
      border-right: 1px solid;
    }
    .item {
      font-size: 18px;
      padding-right: 10px;
      margin-right: 25px;
    }
  }
}
</style>
