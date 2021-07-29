/* eslint-disable camelcase */
<template>
  <div id='meterReadingData' >
    <div class="searchBox">
      <search-form
      :searchItems="searchItems"
      @onSearch="onMeterSearch"
    />
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
import treeselect from '../waterTreeSelect';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import {
  getMeterReadingData,
} from '@/api/water';
import {
  getParkDeviceTree
} from 'api/index';
export default {
  name: 'meterReadingData',
  data () {
    return {
      searchItems: [
        {
          type: 'dataPicker',
          label: '抄表时间',
          props: {
            fieldName: 'dateNow'
          }
        },{
          type: 'input',
          label: '水表编码',
          props: {
            fieldName: 'serialNumber'
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
      readInfo: {
        
      },
      searchVal: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '水表编号',
          prop: 'serialNumber'
        },
        { label: '水表地址',
          prop: 'installAddress'
        },
        { label: '水表读数',
          prop: 'readingValue'
        },
        { label: '上次水表读数',
          prop: 'beforeReadingTime'
        },
        { label: '读数时间',
          prop: 'readingTime'
        },
        { label: '抄表人',
          prop: 'readingUser'
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
    treeselect,
    card
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
        }
      });
      // return treeData;
    },
    onMeterSearch (val) {
      this.readInfo = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          serialNumber: this.readInfo.serialNumber,
          timeBegin: this.readInfo.dateNow ? this.readInfo.dateNow[0] : "",
          timeEnd: this.readInfo.dateNow ? this.readInfo.dateNow[1] : "",
          streetCode: this.readInfo.location || ''
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getMeterReadingData(data).then(res => {
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
#meterReadingData{
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
    min-width: 70px;
    font-size: 14px;
  }
}
</style>
