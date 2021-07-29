/* eslint-disable camelcase */
<template>
  <div id='ammeterPrepayManagement' >
    <div class="searchBox">
      <search-form
      :searchItems="searchItems"
      @onSearch="onMeterSearch"
      :otherBtnVisible="true"
      :otherBtnLists="[{
        label: '导出',
        disabled: false,
        click: () => {}
      }, {
        label: '批量提醒短信',
        disabled: slelections.length > 0,
        click: () => {}
      }]"
    />
    </div>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator
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
              title="充值"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="showView('prePlay', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="el-icon-money" style="fontSize: 22px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="短信提醒"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="showView('detail', {
                ...scope.row
              })"
              v-if="true || $_hasOperation($options.name,'detail')">
              <i class="el-icon-chat-dot-square" style="fontSize: 22px; color: #2573f1"/>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="详情"
              @click.prevent.stop="showView('del', {
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
            </el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
    <dialog-cont
      @on-cancel="dialogCancel"
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      width="550px"
      :title="dialog.title"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="formItems"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
      />
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import {
  getMeterReadingData
} from '@/api/water';
import {
  getParkDeviceTree
} from 'api/index';
export default {
  name: 'ammeterPrepayManagement',
  data () {
    return {
      searchItems: [
        {
          type: 'input',
          label: '用户名',
          props: {
            fieldName: 'dateNow'
          }
        }, {
          type: 'input',
          label: '水表编码',
          props: {
            fieldName: 'serialNumber'
          }
        }

      ],
      readInfo: {

      },
      searchVal: {},
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
        { label: '位置',
          prop: 'beforeReadingTime'
        },
        { label: '充值余额',
          prop: 'readingTime'
        },
        { label: '剩余可用电量',
          prop: 'readingUser'
        },
        { label: '充值方式',
          prop: 'readingUser'
        },
        { label: '充值时间',
          prop: 'readingUser'
        },
        { label: '账户状态',
          prop: 'readingUser'
        }
      ],
      dialog: {
        show: false,
        title: '充值'
      },
      inputDisabled: false,
      isEdit: true,
      form: {
      },
      formItems: [{
        label: '购电金额',
        prop: 'deviceName',
        inputType: 'input',
        required: true,
        span: 24
      }],
      formRules: {
      }
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
    dialogCont,
    FormItem
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
    },
    onSelectionChange (tags) {
      this.slelections = tags.map(tag => tag.id);
    },
    showView (type) {
      if (type === 'prePlay') {
        this.dialog.show = true;
      }
    },
    dialogCancel () {
      this.dialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {};
    },
    async dialogSubmit (val) {
      let apiMethod = '';
      let message = '新增成功';
      const formData = await this.$refs.formItem.getValue();
      const param = {
        deviceCode: formData.deviceCode,
        deviceName: formData.deviceName,
        manufacturerManageCode: formData.manufacturerManageCode,
        sensorTypeCode: formData.sensorTypeCode,
        remark: formData.remark
      };
      if (this.form.id) {
        // apiMethod = updateDeviceTypeManagement;
        message = '修改成功';
        param.id = this.form.id;
        param.code = this.form.code;
      }
      apiMethod(param).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogCancel();
          this.onSearch();
        }
      })
    }
  }
}
</script>

<style lang="less">
#ammeterPrepayManagement{
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
