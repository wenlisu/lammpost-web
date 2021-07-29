/* eslint-disable camelcase */
<template>
  <dialog-cont
    @on-cancel="infoDialogCancel"
    @on-confirm="infoDialogSubmit"
    :visible.sync="show"
    width="70%"
    :title="title"
    append-to-body
    customClass="entrancePersonalInformation"
  >
    <!-- 人员信息 -->
    <header-title
      icon="iconfont icon-shouye"
      title="人员信息"
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
          :selection="false"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          highlight-current-row
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @row-current-change="handleSelectChange"
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
        </page-table>
      </div>
    </div>
  </dialog-cont>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import FormItem from '@/components/adminFormItem';
import dialogCont from '@/components/adminDialog';
import PageTable from '@/components/adminPage-table';
import Flex from '@/components/flex';
import config, { baseURL } from '@/config';
import {
  getDoorAccessEmployeeInfoPage,
  getDoorAccessEmployeeInfoDetail,
  editDoorAccessEmployeeInfo,
  removeDoorAccessEmployeeInfo,
  saveVisitorInfoDetail
} from 'api/entrance';
export default {
  name: 'entrancePersonalInformation',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    select: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      config,
      baseURL,
      multipleSelection: {},
      title: '选择被访人',
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '姓名',
        props: {
          fieldName: 'employeeName'
        }
      }, {
        type: 'input',
        label: '员工编号',
        props: {
          fieldName: 'employeeCode'
        }
      }, {
        type: 'input',
        label: '门禁卡号',
        props: {
          fieldName: 'accessCardCode'
        }
      }, {
        type: 'select',
        label: '性别',
        props: {
          fieldName: 'employeeSex',
          options: []
        }
      }, {
        type: 'select',
        label: '公司',
        props: {
          fieldName: 'employeeCompany',
          options: []
        }
      }, {
        type: 'select',
        label: '部门',
        props: {
          fieldName: 'employeeDepartment',
          options: []
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
        { label: '登记照片',
          prop: 'registrationPhotos',
          minWidth: '123px',
          custom: true
        },
        { label: '员工编号',
          prop: 'employeeCode'
        },
        { label: '门禁卡号',
          prop: 'accessCardCode'
        },
        { label: '姓名',
          prop: 'employeeName'
        },
        { label: '手机号码',
          prop: 'employeePhone'
        },
        { label: '性别',
          prop: 'employeeSexText'
        },
        { label: '身份证号',
          prop: 'employeeIdentity'
        },
        { label: '年龄',
          prop: 'employeeAge'
        },
        { label: '民族',
          prop: 'employeeNation'
        },
        { label: '类型',
          prop: 'employeeTypeText'
        },
        { label: '公司',
          prop: 'employeeCompanyText',
          minWidth: '110px'
        },
        { label: '部门',
          prop: 'employeeDepartmentText'
        },
        { label: '到期时间',
          prop: 'expirationTime',
          minWidth: '110px'
        },
        { label: '创建时间',
          prop: 'createTime',
          minWidth: '110px'
        }
      ],
      excelFile: undefined,
      imgFile: undefined,
      authDialog: {
        title: '人员授权',
        show: false,
        select: [],
        data: []
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1)
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    FormItem,
    dialogCont
  },
  methods: {
    handleSelectChange (val) {
      this.multipleSelection = val;
    },
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
      }
      getDoorAccessEmployeeInfoPage(data).then(res => {
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
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.title = '新增人员信息';
    },
    dialogSubmit () {
    },
    batchAdd () {
      this.batchDialog.show = true;
    },
    batchDialogCancel () {
      this.batchDialog.show = false;
    },
    updateData (type) {
      this.$refs.inputFile.click();
      this.batchDialog.fileType = type;
    },
    saveData () {

    },
    showVerfiyView () {

    },
    onVerifyCurrentChange (val) {
      this.batchDialog.verify.page.current = val;
      // this.getDataAllList()
    },
    onVerifyPageSizeChange (val) {
      this.batchDialog.verify.page.pageSize = val
      this.onCurrentChange(1)
    },
    showImgVerfiyView () {

    },
    onImgVerifyCurrentChange (val) {
      this.batchDialog.imgVerify.page.current = val;
      // this.getDataAllList()
    },
    onImgVerifyPageSizeChange (val) {
      this.batchDialog.imgVerify.page.pageSize = val
      this.onCurrentChange(1)
    },
    infoDialogCancel () {
      this.$emit('cancel');
    },
    infoDialogSubmit () {
      this.$emit('submit', this.multipleSelection)
    },
    batchAuth () {
      this.authDialog.show = true;
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
