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
    <tree-transfer
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
    >
    </tree-transfer>
    </dialog-cont>
</template>

<script>
import dialogCont from '@/components/adminDialog';
import treeTransfer from 'el-tree-transfer';
import {
  getParkDeviceTree
} from 'api/index'
import {
  getBuildTreeDevice
} from 'api/entrance'
export default {
  name: 'authEntrance',
  data () {
    return {
      title: '人员授权',
      toData: [],
      fromData: [],
      treeExpandKeys: [],
      selectKeys: []
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
    defaultTransfer: {
      type: Boolean,
      default: false
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
    select (val) {
      if (this.selectKeys !== val) {
        this.selectKeys = val;
      }
    }
  },
  components: {
    dialogCont,
    treeTransfer
  },
  methods: {
    async _getBuildTreeDevice () {
      const params = { parentNodeCode: '0', deviceTypeNo: 'DOOR_ACCESS' }
      let res = await getBuildTreeDevice(params)
      if (res.code == '200') {
        this.fromData = res.data;
        this.fromData[0].parentNodeCode = 0; // 最顶层父节点的parentNodeCode一定要为0
        this.getFinalData(this.fromData)
      }
    },
    // 递归
    getFinalData (data) {
      data.forEach(item => {
        if (item.deviceModuleBaseDtoList && item.deviceModuleBaseDtoList.length !== 0) {
          const DtoList = item.deviceModuleBaseDtoList.map(list => {
            return {
              nodeName: list.deviceModuleName,
              nodeCode: list.serialNumber,
              parentNodeCode: item.nodeCode
            }
          })
          item.treeDeviceDtoList.push(...DtoList)
        }
        if (item.treeDeviceDtoList && item.treeDeviceDtoList.length !== 0) {
          this.getFinalData(item.treeDeviceDtoList)
        } else {

        }
      })
    },
    // 监听穿梭框组件添加
    add (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      obj.nodes.forEach(node => {
        if (!node.deviceModuleBaseDtoList) {
          console.log('nodes', node)
          this.select.push(node)
        }
      });
      this.selectKeys = Array.from(new Set(this.selectKeys.concat(obj.keys)));
      console.log('fromData:', fromData);
      console.log('toData:', toData);
      console.log('obj:', obj);
    },
    // 监听穿梭框组件移除
    remove (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      obj.nodes.forEach(node => {
        if (!node.deviceModuleBaseDtoList) {
          this.select.forEach((selectItem, index) => {
            console.log('selectItem', selectItem, node);
            (node && selectItem && (node.nodeCode == selectItem.nodeCode)) ? this.select.splice(index, 1) : null
          })
        }
      });
      this.selectKeys = this.selectKeys.filter(x => obj.keys.indexOf(x) < 0);
      console.log('fromData:', fromData);
      console.log('toData:', toData);
      console.log('obj:', obj);
    },
    authDialogCancel () {
      this.$emit('cancel');
    },
    authDialogSubmit () {
      this.$emit('authEntranceSubmit', this.select)
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
