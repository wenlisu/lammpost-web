/* eslint-disable camelcase */
<template>
  <div id='studioEquipment' >
    <!-- 播控设备 -->
    <header-title
      icon="iconfont icon-shouye"
      title="播控设备"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="true || $_hasOperation($options.name,'add')"
        @on-addBtn="showView();"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="110"
          operator
          :selection="false"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot="a" slot-scope="scope">
            <el-switch
              style="display: block;height: 23px"
              v-model="scope.row && scope.row.onlineStatus === 1"
              active-color="#2870FF"
              inactive-color="#e0e0e0"
              active-text="开"
              inactive-text=""
              @change="val => handleChangeOnline({ onlineStatus: val, serialNumber: scope.row.serialNumber })">
            </el-switch>
          </template>
          <template slot="b" slot-scope="scope">
            <el-tag @click="() => volumnChange(scope.row)">{{scope.row.deviceVolume ? scope.row.deviceVolume : 0}}</el-tag>
          </template>
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
              @click.prevent.stop="showView({
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              title="删除"
              @click.prevent.stop="handleDelete({
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
            </el-button> -->
          </flex>
          </template>
        </page-table>
      </div>
    </div>
    <dialog-cont
      @on-cancel="dialogAddCancel"
      @on-confirm="dialogAddSubmit"
      :visible.sync="addDialog.show"
      width="550px"
      :title="addDialog.title"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="addDialog.formItems"
        :rules="addDialog.formRules"
        :disabled="addDialog.inputDisabled"
        :isEdit="addDialog.isEdit"
        :form="addDialog.form"
        :midway="addDialog.midway"
        :labelWidth="'100px'"
        :key="addDialog.key"
      >
        <template slot="a">
          <el-cascader :options="addDialog.options" clearable></el-cascader>
        </template>
      </FormItem>
    </dialog-cont>
    <dialog-cont
      :visible.sync="volumnDialog.show"
      width="550px"
      :title="'调节音量'"
      className="studioEquipmentVolumnDialog"
      append-to-body
      :bottomShow="false"
    >
      <el-form :model="volumnDialog.form" :rules="volumnDialog.formRules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
        <el-form-item label="音量：">
          <el-slider v-model="volumnDialog.form.volume"></el-slider>
          <!-- <el-checkbox v-model="volumnDialog.form.b">应用音量到当前节点的所有设备</el-checkbox> -->
        </el-form-item>
      </el-form>
      <div class="flexRow btnList">
        <el-button
            title="设置音量"
            class="button submitBtn"
            @click="onVolumnSubmit"
          >
            设置音量
          </el-button>
          <el-button
            title="开调试音"
            class="button submitBtn"
            @click="onVolumnSubmit"
          >
            开调试音
          </el-button>
          <el-button
            title="关调试音"
            class="button submitBtn"
            @click="onVolumnSubmit"
          >
            关调试音
          </el-button>
          <el-button
            title="放弃调整"
            class="button submitBtn"
            @click="volumnClose"
          >
            放弃调整
          </el-button>
      </div>
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import {
  getAudioList,
  setVolume,
  updateDeviceStatus,
  setPlay
} from 'api/brocast';
export default {
  name: 'studioEquipment',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        props: {
          fieldName: 'serialNumber',
          width: '180px',
          initValue: undefined
        }
      }, {
        type: 'input',
        label: '设备名称',
        props: {
          fieldName: 'deviceName',
          width: '180px',
          initValue: undefined
        }
      }, {
        type: 'select',
        label: '设备状态',
        props: {
          fieldName: 'deviceStatus',
          initValue: undefined,
          options: [{
            id: 1,
            name: '在线'
          }, {
            id: 3,
            name: '离线'
          }, {
            id: 2,
            name: '播放中'
          }]
        }
      }, {
        type: 'input',
        label: '位置',
        props: {
          fieldName: 'deviceAddress',
          width: '180px',
          initValue: undefined
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
        { label: '设备编号',
          prop: 'serialNumber'
        },
        { label: '设备名称',
          prop: 'deviceName'
        },
        { label: '安装位置',
          prop: 'deviceAddress'
        },
        { label: '设备远端IP',
          prop: 'deviceTcpIp'
        },
        { label: '设备本地IP',
          prop: 'deviceIp'
        },
        { label: '设备类型',
          prop: 'deviceType'
        },
        { label: '设备状态',
          prop: 'onlineStatusText'
        },
        { label: '设备开关',
          prop: 'a',
          minWidth: '110px',
          custom: true
        },
        { label: '调整音量',
          prop: 'b',
          custom: true
        }
      ],
      addDialog: {
        show: false,
        item: null,
        title: '新增设备',
        inputDisabled: false,
        isEdit: true,
        key: 0,
        form: {
          serialNumber: undefined,
          deviceName: undefined,
          deviceType: undefined,
          deviceAddress: undefined,
          longitude: undefined,
          latitude: undefined,
          deviceTcpIp: undefined,
          deviceIp: undefined
        },
        formItems: [{
          label: '设备编号',
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
          label: '设备类型',
          prop: 'deviceType',
          inputType: 'input',
          required: true,
          // custom: true,
          span: 24
        }, {
          label: '安装地址',
          prop: 'deviceAddress',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '经度',
          prop: 'longitude',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '纬度',
          prop: 'latitude',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '设备远端IP',
          prop: 'deviceTcpIp',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '设备本端IP',
          prop: 'deviceIp',
          inputType: 'input',
          required: true,
          span: 24
        }],
        formRules: {
        },
        midway: true,
        options: []
      },
      volumnDialog: {
        show: false,
        title: '新增设备',
        item: {},
        form: {
          volume: 0
        },
        formRules: {
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    FormItem
  },
  methods: {
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val
      }
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
      };
      getAudioList(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
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
    showView (item) {
      this.addDialog.key++;
      this.addDialog.show = true;
      if (item) {
        this.addDialog.form = {
          ...item
        };
        this.addDialog.isEdit = false;
        this.addDialog.inputDisabled = true;
        this.addDialog.title = '编辑设备';
        this.addDialog.item = item;
      }else {
        this.addDialog.form = {}
        this.addDialog.isEdit = true;
        this.addDialog.inputDisabled = false;
        this.addDialog.title = '新增设备';
      }
    },
    handleDelete () {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      })
    },
    dialogAddCancel () {
      this.addDialog.show = false;
      this.addDialog.title = '新增设备';
    },
    dialogAddSubmit () {
      this.dialogAddCancel();
    },
    handleChangeOnline (val) {
      const parames = {
        status: val.onlineStatus ? 1 : 0,
        serialNumbers: [val.serialNumber]
      }
      setPlay(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      })
    },
    volumnChange (item) {
      this.volumnDialog.show = true;
      this.volumnDialog.item = item;
      this.volumnDialog.form = {
        volume: +(item.deviceVolume ? item.deviceVolume : 0)
      }
    },
    volumnClose () {
      this.volumnDialog.show = false;
      this.volumnDialog.item = undefined;
      this.volumnDialog.form = {
        volume: 0
      };
    },
    onVolumnSubmit () {
      const parames = {
        volume: this.volumnDialog.form.volume,
        serialNumbers: [this.volumnDialog.item.serialNumber]
      };
      setVolume(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
          this.volumnClose();
        }
      });
    }
  }
}
</script>

<style lang="less">
#studioEquipment{}
.studioEquipmentVolumnDialog{
  .el-dialog__body{
    .el-slider{
      .el-slider__runway{
        width: calc(100% - 10px);/*no*/
        margin: 12px 0;/*no*/
        margin-left: 10px;/*no*/
        .el-slider__button-wrapper{
          height: 30px;/*no*/
          width: 30px;/*no*/
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .btnList{
      justify-content: flex-end;
      button{
        line-height: 10px;
        border: 1px solid #409eff !important;/*no*/
      }
    }
  }
  .el-dialog__footer{
    >div{
      display: flex;
      flex-direction: row;
      >div{
        width: auto;
      }
    }
  }
}
</style>
