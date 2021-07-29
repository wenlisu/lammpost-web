/* eslint-disable camelcase */
<template>
  <div id='ammeterPrepayHistory'>
    <card title="基本信息" :className="'adminCard baseInfoCard'">
      <FormItemText
        :layout="baseInfoItems"
        labelWidth="0px"
      >
      </FormItemText>
    </card>
    <card title="历史充值记录" :className="'adminCard baseInfoCard'">
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            col-align="center"
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          >
          </page-table>
        </div>
      </div>
      </card>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import FormItemText from '@/components/formItemText/formItemText';
import {
  getMeterReadingData
} from '@/api/water';
import {
  getParkDeviceTree
} from 'api/index';
export default {
  name: 'ammeterPrepayHistory',
  data () {
    return {
      baseInfoItems: [{
        id: 'terminalName',
        label: '电表名称',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '位置',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '电表状态',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '用户名',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '手机号码',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '电费单价',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '总金额',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '可用电量',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '可用天数',
        value: '',
        unit: '',
        span: 8
      }],
      readInfo: {

      },
      slelections: [],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '用户名',
          prop: 'serialNumber'
        },
        { label: '手机号',
          prop: 'installAddress'
        },
        { label: '电表编码',
          prop: 'readingValue'
        },
        { label: '电表名称',
          prop: 'beforeReadingTime'
        },
        { label: '位置',
          prop: 'readingTime'
        },
        { label: '余额',
          prop: 'readingUser'
        },
        { label: '充值金额',
          prop: 'readingUser'
        },
        { label: '总金额',
          prop: 'readingUser'
        },
        { label: '充值方式',
          prop: 'readingUser'
        },
        { label: '充值时间',
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
    card,
    FormItemText
  },
  methods: {
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
          timeBegin: this.readInfo.dateNow ? this.readInfo.dateNow[0] : '',
          timeEnd: this.readInfo.dateNow ? this.readInfo.dateNow[1] : '',
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
    }
  }
}
</script>

<style lang="less">
#ammeterPrepayHistory{
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
