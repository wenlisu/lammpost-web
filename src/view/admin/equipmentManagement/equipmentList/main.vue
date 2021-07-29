/* eslint-disable camelcase */
<template>
  <div class="content-view">
    <div class="Modeltable">
      <page-table
        ref="pageTable"
        col-align="center"
        operator-width="110"
        :operator="toolsShow"
        :selection="selection"
        :data="tableData"
        :cols="tableCols"
        :page-current="page.current"
        :total="page.total"
        :page-size="page.pageSize"
        highlightCurrentRow
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
        @selection-change="onSelectionChange"
        @row-current-change="onRowCurrentChange"
      >
        <template
          slot-scope="scope"
          slot="operator"
        >
        <flex>
          <el-button
            type="text"
            size="small"
            title="修改"
            :style="{marginRight: '10px'}"
            @click.prevent.stop="showView('edit', {
              ...scope.row
            })"
            v-if="true || $_hasOperation($options.name,'edit')">
            <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/>
          </el-button>
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
        </flex>
        </template>
      </page-table>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import { routePush } from '@/util/util';
import Detail from '../equipmentDetail/index';
import {
  getDeviceModuleInfoForPage,
  addDeviceModuleInfo,
  updateDeviceModuleInfo,
  deleteDeviceModuleInfo,
  activeDeviceModule
} from 'api/admin';
import {
  getGroupPolicy,
  getManufacturerSelectList,
  getDeviceTypeSelectList,
  getSensorTypeSelectList
} from 'api/index';
export default {
  name: 'equipmentListMain',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    page: {},
    toolsShow: {
      type: Boolean,
      default: true
    },
    selection: {
      type: Boolean,
      default: true
    },
    tableCols: {
      type: Array,
      default: () => [
        { label: 'IMEI',
          prop: 'serialNumber'
        },
        { label: '设备名称',
          prop: 'deviceModuleName'
        },
        { label: '设施类型',
          prop: 'deviceTypeName',
          minWidth: '110px'
        },
        { label: '厂商名称',
          prop: 'factoryName'
        },
        { label: '设备型号',
          prop: 'deviceName'
        },
        { label: '设备版本',
          prop: 'version'
        },
        { label: '激活状态',
          prop: 'activateStatusText'
        },
        { label: '设备关联状态',
          prop: 'bindStatusText',
          minWidth: '110px'
        },
        { label: '创建时间',
          prop: 'createTime',
          minWidth: '110px'
        }
      ]
    }
  },
  data () {
    return {
      deviceNo: null
      // 分页
    }
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    this.$nextTick(async () => {
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    FormItem,
    Detail
  },
  methods: {
    // 分页切换页面
    onCurrentChange (val) {
      // this.page.current = val;
      // this.getDataAllList()
      this.$emit('onCurrentChange', val);
    },
    onPageSizeChange (val) {
      // this.page.pageSize = val
      // this.onCurrentChange(1)
      this.$emit('onPageSizeChange', val);
    },
    onSelectionChange (list) {
      // this.selectsList = list.map(ls => ls.serialNumber);
      this.$emit('onSelectionChange', list);
    },
    async showView (type, row) {
      this.$emit('showView', {type, row})
    },
    onRowCurrentChange (val) {
      this.$emit('onRowCurrentChange', val);
    },
    onSetCurrentRow (id, idx) {
      this.$refs.pageTable.onSetCurrentRow(id, idx);
    },
    cleanData () {
      this.deviceNo = null;
      this.$refs.pageTable.getPageTable();
    }
  }
}
</script>

<style lang="less">
#equipmentListMain{}
</style>
