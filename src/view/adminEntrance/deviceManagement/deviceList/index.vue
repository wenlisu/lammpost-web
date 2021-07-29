/* eslint-disable camelcase */
<template>
  <div id='deviceList' >
    <!-- 业务执行管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="业务执行管理"
    >
      <div slot="searchBox" class="searchBoxContent">
        <el-row>
          <div class="flexRow">
            <div class="item borderLine">
              <p class="normalMark">设备总数(个)</p>
              <div><span>{{devInfo.totalCount}}</span></div>
            </div>

            <div class="item borderLine">
              <p class="alarmMark">在线设备(个)</p>
              <div><span>{{devInfo.normalCount}}</span></div>
              <div class="line"></div>
            </div>
            <div class="item">
              <p class="malfunctionMark">离线设备(个)</p>
              <div><span>{{devInfo.offlineCount}}</span></div>
            </div>
          </div>
        </el-row>
        <search-form
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="$_hasOperation($options.name,'add')"
          @on-addBtn="showView('detail');"
          :delBtnVisible="true || $_hasOperation($options.name,'del')"
          @on-delBtn="showView('del');"
        >
          <!-- <template slot="treeNodeCode">
            <treeselect :value="searchVal.treeNodeCode" @select="tressSearchSelectInput" :multiple="false"/>
          </template> -->
        </search-form>
      </div>
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          operator
          selection
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
    <dialog-cont
      @on-cancel="dialogCancel"
      @on-confirm="dialogSumbit"
      :visible.sync="dialog.show"
      width="550px"
      :title="dialog.title"
      append-to-body
      customClass="entrancePersonalInformationDialog"
    >
     <div>
        <FormItem
          ref="formItem"
          :formItems="dialog.formItems"
          :rules="dialog.formRules"
          :disabled="dialog.inputDisabled"
          :isEdit="dialog.isEdit"
          :form="dialog.form"
          :midway="dialog.midway"
          :labelWidth="'120px'"
        >
          <template slot="treeNodeCode">
            <treeselect :value="dialog.form.treeNodeCode" @input="tressSelectInput" @select="tressSelectSelect" :multiple="false"/>
          </template>
        </FormItem>
      </div>
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import dialogCont from '@/components/adminDialog';
import Flex from '@/components/flex';
import FormItem from '@/components/adminFormItem';
import treeselect from '@/view/smokeDetector/smokeManage/cameraEvent/treeselect';
import {
  getParkDeviceTree
} from 'api/index';
import {
  getDoorAccessDeviceList,
  getDoorAccessDeviceDetails,
  getDoorAccessCurrentStatus,
  removeDoorAccessDevice,
  editDoorAccessDeviceDetails,
  getBuildTreeDevice
} from 'api/entrance';
export default {
  name: 'deviceList',
  data () {
    return {
      searchVal: {
        treeNodeCode: null
      },
      devInfo: {},
      searchItems: [{
        type: 'input',
        label: '设备序列号',
        props: {
          fieldName: 'serialNumber'
        }
      }, {
        type: 'input',
        label: '设备名称',
        props: {
          fieldName: 'deviceName'
        }
      },{
        type: 'treeselect',
        label: '安装位置',
        span: 8,
        props: {
          fieldName: 'treeNodeCode',
          options: [],
          multiple: false
        },
        normalizer: (node) => {
          return this.formatterNode(node)
        }
      }, {
        type: 'select',
        label: '设备状态',
        props: {
          fieldName: 'onLineStatus',
          options: [{
            id: 1,
            name: '在线'
          }, {
            id: 0,
            name: '离线'
          }]
        }
      }],
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectsList: [],
      selectsAddress: undefined,
      tableData: [],
      tableCols: [
        { label: '设备序列号',
          prop: 'serialNumber'
        },
        { label: '设备名称',
          prop: 'deviceName'
        },
        { label: '安装位置',
          prop: 'address'
        },
        { label: '通道类型',
          prop: 'accessTypeText'
        },
        { label: '已授权人数',
          prop: 'authorizationNumber'
        },
        // { label: '设备端口',
        //   prop: 'devicePort'
        // },
        { label: '设备状态',
          prop: 'onLineStatusText'
        }
      ],
      dialog: {
        title: '编辑设备信息',
        show: false,
        fileList: [],
        formItems: [{
          label: '设备序列号',
          prop: 'serialNumber',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '设备名称',
          prop: 'deviceName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '设备IP',
          prop: 'ip',
          inputType: 'input',
          required: true,
          hide: true,
          span: 24
        }, {
          label: '设备端口',
          prop: 'devicePort',
          inputType: 'input',
          required: false,
          hide: true,
          span: 24
        }, {
          label: '通道类型',
          prop: 'accessType',
          inputType: 'select',
          required: true,
          options: [{
            name: '进门',
            id: 1
          }, {
            name: '出门',
            id: 2
          }],
          span: 24
        }, {
          label: '安装位置',
          prop: 'treeNodeCode',
          inputType: 'custom',
          required: false,
          span: 24
        }],
        formRules: {},
        form: {
          address: null,
          treeNodeCode: null
        },
        inputDisabled: false,
        isEdit: false,
        midway: true
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.onCurrentChange(1);
      this._getDoorAccessCurrentStatus();
      this._getBuildTreeDevice()
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    FormItem,
    treeselect
  },
  methods: {
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
        this.searchItems[2].props.options = res.data;
        this.searchItems[2].props.options[0].parentNodeCode = 0; //最顶层父节点的parentNodeCode一定要为0
        // this.getFinalData(this.searchItems[2].props.options)
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
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
      };
      // this.searchVal.treeNodeCode.id ? this.searchVal['treeNodeCode'] = this.searchVal.treeNodeCode.id : null
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
      getDoorAccessDeviceList(data).then(res => {
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
    onSelectionChange (args) {
      this.selectsList = args.map(arg => arg.serialNumber)
    },
    _getDoorAccessCurrentStatus () {
      getDoorAccessCurrentStatus({}).then(res => {
        if (res.code === '200') {
          this.devInfo = res.data;
        }
      })
    },
    showView (type, item) {
      if (type === 'detail') {
        this.dialog.show = true;
        if (item) {
          getDoorAccessDeviceDetails(item.serialNumber).then(res => {
            if (res.code === '200') {
              this.dialog.form = {
                ...res.data,
                treeNodeCode: {id: res.data.treeNodeCode}
              }
            }
          });
        }
      } else if (type === 'del') {
        const serialNumbers = item ? [item.serialNumber] : this.selectsList;
        removeDoorAccessDevice(serialNumbers).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.getDataAllList();
          }
        })
      }
    },
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.form = {
        address: null,
        treeNodeCode: null
      };
    },
    async dialogSumbit () {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        ...this.dialog.form,
        ...formData,
        treeNodeCode: this.dialog.form.treeNodeCode.id
      };
      delete parames.address;
      editDoorAccessDeviceDetails(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      })
    },
    tressSelectInput (value) {
    },
    tressSearchSelectInput (val) {
      this.searchVal.treeNodeCode = {id: val.id};
    },
    tressSelectSelect (val) {
      // this.dialog.form.address = val.label;
      this.dialog.form.treeNodeCode = {id: val.id};
    }
  }
}
</script>

<style lang="less">
#deviceList{
  .searchBoxContent {
    #treeselect{
      width: 250px;/*no*/
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
}
.entrancePersonalInformationDialog {
  #treeselect {
    width: 100% !important;
  }
}
</style>
