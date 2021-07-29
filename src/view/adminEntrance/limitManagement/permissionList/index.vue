<template>
  <div id="permissionList">
    <header-title
        icon="iconfont icon-shouye"
        title="访客管理"
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
          :selection="true"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="selectionChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template
              slot-scope="scope"
              slot="registrationPhotos"
            >
            <el-image
              style="width: 100px; height: 100px"
              :src="`${baseURL || config.baseURL.dev}/upload/${scope.row.registrationPhotos}`"
              :fit="'contain'"></el-image>
          </template>
          <template
            slot-scope="scope"
            slot="operator"
          >
            <flex>
              <el-button
              type="text"
              size="small"
              title="编辑"
              @click.prevent.stop="showView({
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-bianji" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="deletPermission({
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
    <AuthEntrance
      :show="transferDialog.show"
      :select="transferDialog.select"
      :data="transferDialog.data"
      @cancel="dialogCancel"
      @authEntranceSubmit="dialogSubmit"
    />
  </div>
</template>

<script>
import searchForm from 'components/adminSearchForm/searchForm';
import FormItem from '@/components/adminFormItem';
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import PageTable from '@/components/adminPage-table';
import AuthEntrance from './components/editInfo';
import Flex from '@/components/flex';
import { getDoorAccessManagePermission } from '@/api';
import config, { baseURL } from '@/config';
import {
  getBuildTreeDevice
} from 'api/entrance'
import { removeDoorAccessPermission, editDoorAccessPermission } from '@/api'
export default {
  components: {
    searchForm,
    headerTitle,
    PageTable,
    AuthEntrance,
    FormItem,
    Flex
  },
  data () {
    return {
      config,
      baseURL,
      transferDialog: {
        title: '权限编辑',
        show: false,
        select: [],
        data: {}
      },
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '姓名',
          props: {
            fieldName: 'employeeName'
          }
        },{
          type: 'input',
          label: '员工编号',
          props: {
            fieldName: 'employeeCode'
          }
        },{
          type: 'input',
          label: '门禁卡号',
          props: {
            fieldName: 'accessCardCode'
          }
        },{
          type: 'treeselect',
          label: '设备',
          span: 8,
          props: {
            fieldName: 'serialNumberS',
            options: [],
            multiple: true
          },
          normalizer: (node) => {
            return this.formatterNode(node)
          }
        }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '登记照片',
          prop: 'registrationPhotos',
          minWidth: '110px',
          custom: true,
        },{ label: '姓名',
          prop: 'employeeName',
          minWidth: '110px'
        },{ label: '员工编号',
          prop: 'employeeCode',
          minWidth: '110px'
        },{ label: '门禁卡号',
          prop: 'accessCardCode',
          minWidth: '110px'
        },{ label: '授权设备',
          prop: 'deviceName',
          minWidth: '110px'
        },{ label: '有效期',
          prop: 'expirationTime',
          minWidth: '110px'
        },{ label: '更新时间',
          prop: 'updateTime',
          minWidth: '110px'
        },{ label: '注册状态',
          prop: 'registrationStatusText',
          minWidth: '110px'
        }
      ],
      multipleSelection: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1)
      this._getBuildTreeDevice()
    })
  },
  methods: {
    showView (row) {
      this.transferDialog.show = true;
      this.transferDialog.data = row;
      this.transferDialog.data['options'] = this.searchItems[3].props.options
    },
    selectionChange (val) {
      this.multipleSelection = val
    },
    // 删除权限
    deletPermission (row) {
      removeDoorAccessPermission([row.permissionCode] || []).then(res => {
        if(res.code == '200') {
            this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange(1)
        }
      })
    },
    dialogCancel () {
      this.transferDialog.show = false
    },
    dialogSubmit (params) {
      editDoorAccessPermission(params).then(res => {
        if(res.code == '200') {
           this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
        this.transferDialog.show = false;
        this.onCurrentChange(1)
      })
    },
    // treeselect 自定义键名
    formatterNode (node) {
      return {
        id: node.nodeCode, // 键名转换，默认是label和children进行树状渲染
        label: node.nodeName,
        children: node.treeDeviceDtoList,
      }
    },
    async _getBuildTreeDevice() {
      const params = { parentNodeCode:"0",deviceTypeNo:"DOOR_ACCESS" }
      let res = await getBuildTreeDevice(params)
      if(res.code == '200') {
        this.searchItems[3].props.options = res.data;
        this.searchItems[3].props.options[0].parentNodeCode = 0; //最顶层父节点的parentNodeCode一定要为0
        this.getFinalData(this.searchItems[3].props.options)
      }
    },
    // 处理请求回来的树结构数据
    getFinalData(data) {
      data.forEach(item => {
        if(item.deviceModuleBaseDtoList && item.deviceModuleBaseDtoList.length !== 0) {
          const DtoList = item.deviceModuleBaseDtoList.map(list => {
            return {
              nodeName: list.deviceModuleName,
              nodeCode: list.serialNumber,
              parentNodeCode: item.nodeCode
            }
          })
          item.treeDeviceDtoList.push(...DtoList)
        }
        if(item.treeDeviceDtoList && item.treeDeviceDtoList.length !== 0) {
          this.getFinalData(item.treeDeviceDtoList)
        } else {
          return;
        }
      })
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      console.log(val)
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
      getDoorAccessManagePermission(data).then(res => {
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
  }
}
</script>

<style lang="less">

</style>