/* eslint-disable camelcase */
<template>
    <dialog-cont
      @on-cancel="authDialogCancel"
      @on-confirm="authDialogSubmit"
      :visible.sync="show"
      width="650px"
      :title="title"
      append-to-body
      customClass="entrancePersonalInformationAuthDialog"
    >
      <FormItem
        ref="permissionFormItem"
        :formItems="permissionInfo.formItems"
        :rules="permissionInfo.formRules"
        :disabled="permissionInfo.inputDisabled"
        :isEdit="permissionInfo.isEdit"
        :form="permissionInfo.form"
        :midway="permissionInfo.midway"
        @submit="getPermissionInfo"
      ></FormItem>
      <!-- <tree-transfer
        :title="['待选门禁设备列表', '已选门禁设备列表']"
        :from_data="fromData"
        node_key="nodeCode"
        pid="parentNodeCode"
        :to_data="toData"
        :defaultProps="{
          label: 'nodeName',
          id: 'nodeCode',
          pid: 'parentNodeCode',
          children: 'treeDeviceDtoList'
        }"
        @addBtn="add"
        @removeBtn="remove"
        :defaultTransfer="defaultTransfer"
        :defaultCheckedKeys="selectKeys.length > 0 ? [...selectKeys] : []"
        :mode="mode"
        height="540px"
        filter
        openAll
        v-if="show"
      >
      </tree-transfer> -->
    </dialog-cont>
</template>

<script>
import dialogCont from '@/components/adminDialog';
import treeTransfer from 'el-tree-transfer';
import FormItem from '@/components/adminFormItem';
import {
  getParkDeviceTree,
} from 'api/index'
import {
  getBuildTreeDevice
} from 'api/entrance'
export default {
  name: 'authEntrance',
  data () {
    return {
      title: '编辑权限',
      toData: [],
      fromData: [],
      treeExpandKeys: [],
      selectKeys: [],
      permissionInfo: {
        formItems: [
          {
            label: '有效期',
            labelWidth: '100px',
            prop: 'expirationTime',
            inputType: 'datetimePicker',
            span: 12
          },{
            label: '注册状态',
            prop: 'enableStatus',
            labelWidth: '100px',
            inputType: 'radio',
            options: [{
              id: 1,
              name: '启用'
            }, {
              id: 0,
              name: '禁用'
            }],
            span: 12
          },{
            label: '授权设备',
            labelWidth: '100px',
            prop: 'serialNumber',
            inputType: 'selectTree',
            span: 24,
            options: [],
            normalizer: (node) => {
              return this.formatterNode(node)
            }
          }
        ],
        formRules: {},
        form: {
          expirationTime: null,
          enableStatus: null,
          serialNumber: null
        },
        inputDisabled: false,
        isEdit: false,
        midway: true
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this._getParkDeviceTree()
      // this._getBuildTreeDevice()
    })
  },
  props: {
    // 穿梭框模式 transfer 或 addressList
    mode: {
      type: String,
      default: () => {
        return 'transfer'
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    select: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  watch: {
    show (val) {
      if (val) {
        this._getBuildTreeDevice();
      } else {
        this.toData = [];
        this.fromData = [];
        this.treeExpandKeys = [];
      }
    },
    data (val) {
      this.permissionInfo.form.expirationTime = val.expirationTime
      this.permissionInfo.form.enableStatus = val.registrationStatus
      this.permissionInfo.formItems[2].options = val.options
      this.permissionInfo.form.serialNumber = val.serialNumber
    }
  },
  components: {
    dialogCont,
    treeTransfer,
    FormItem
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
    getPermissionInfo (form) {
      this.permissionInfo.form = form
    },
    async _getBuildTreeDevice() {
      const params = { parentNodeCode:"0",deviceTypeNo:"DOOR_ACCESS" }
      let res = await getBuildTreeDevice(params)
      if(res.code == '200') {
        this.fromData = res.data;
        this.fromData[0].parentNodeCode = 0; //最顶层父节点的parentNodeCode一定要为0
        this.getFinalData(this.fromData)
      }
    },
    // 递归
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
    authDialogCancel () {
      this.$emit('cancel');
    },
    authDialogSubmit () {
      this.$refs.permissionFormItem.submitForm();
      const params = {
        ...this.permissionInfo.form,
        permissionCode: this.data.permissionCode
      }
      this.$emit('authEntranceSubmit', params)
    }
  }
}
</script>

<style lang="less">
.entrancePersonalInformationAuthDialog {
  .el-dialog__body{
    .el-transfer{
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
