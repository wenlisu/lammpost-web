/* eslint-disable camelcase */
<template>
  <div id='visitorInformation' >
    <div v-if="routeName == 'entranceVisitorInformationDetail'">
      <detail />
    </div>
    <div v-if="routeName == 'entranceVisitorInformation'">
      <!-- 访客信息 -->
      <header-title
        icon="iconfont icon-shouye"
        title="访客管理"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          :addBtnVisible="$_hasOperation($options.name,'add')"
          :otherBtnVisible="true"
          @onSearch="onSearch"
          @on-addBtn="openDialog('add');"
          :otherBtnLists="[
            {
              label: '添加访客',
              click: () => addVisitors()
            },
            {
              label: '导出',
              click: () => exportInfo()
            }
          ]"
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
            <template
              slot-scope="scope"
              slot="idPhoto"
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="`${baseURL || config.baseURL.dev}/upload/${scope.row.idPhoto}`"
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
                title="详情"
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
                title="审批"
                @click.prevent.stop="showView('approval', {
                  ...scope.row
                })"
                v-if="true || scope.row.visitStatus == 0 || ($_hasOperation($options.name,'approval'))">
                <i class="iconfont icon-dianji" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
            </flex>
            </template>
          </page-table>
        </div>
      </div>
    </div>
    <!-- <detail v-if="dialog.show"/> -->
    <dialogCont
      @on-cancel="dialogCancel('info')"
      @on-confirm="dialogSubmit('info')"
      :visible.sync="dialog.show"
      :title="dialog.title"
      :confirmShow="dialog.confirmShow"
      width="70%"
    >
      <detail ref="info_ref" :initData="dialog.initData" v-if="dialog.show" />
    </dialogCont>
    <el-dialog
      :title="intervieweeInfo.title"
      :visible.sync="intervieweeInfo.show"
      width="30%"
      :before-close="handleClose">
        <FormItem
        ref="intervieweeInfo"
        :formItems="intervieweeInfo.formItems"
        :rules="intervieweeInfo.formRules"
        :disabled="intervieweeInfo.inputDisabled"
        :isEdit="intervieweeInfo.isEdit"
        :form="intervieweeInfo.form"
        :midway="intervieweeInfo.midway"
      ></FormItem>
      <span slot="footer" class="dialog-footer">
        <el-button plain size="small" class="closeBtn" :disabled="intervieweeInfo.form.visitStatus == 2" @click="approvalCancel">拒绝</el-button>
        <el-button type="primary" size="small" :disabled="intervieweeInfo.form.visitStatus == 1" @click="approvalSubmit">审批通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle';
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import FormItem from '@/components/adminFormItem';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import AuthEntrance from '../personalInformation/authEntrance';
import { routePush, download } from '@/util/util';
import config, { baseURL } from '@/config';
import detail from './detail';
import {
  getVisitorInfo,
  saveVisitorInfoDetail,
  doorAccessLogProval,
  exportVisitorInfo,
  exportVisitorInfoo
} from 'api/entrance';
import Detail from '../../../admin/equipmentAccess/lampPoleManagement/detail.vue';
// import { delete } from 'vue/types/umd';
export default {
  name: 'entranceVisitorInformation',
  data () {
    return {
      config,
      baseURL,
      intervieweeInfo: {
        formItems: [{
          label: '访客姓名',
          labelWidth: '100px',
          prop: 'visitorName',
          inputType: 'input',
          span: 24
        },{
          label: '手机号码',
          labelWidth: '100px',
          prop: 'visitorPhone',
          inputType: 'input',
          span: 24
        },{
          label: '来访起始时间',
          labelWidth: '100px',
          prop: 'visitorBeginTime',
          inputType: 'datetimePicker',
          span: 24
        },{
          label: '来访结束时间',
          labelWidth: '100px',
          prop: 'visitorEndTime',
          inputType: 'datetimePicker',
          span: 24
        },{
          label: '来访事由',
          labelWidth: '100px',
          prop: 'visitorCause',
          inputType: 'textarea',
          span: 24
        },{
          label: '车牌号码',
          labelWidth: '100px',
          prop: 'carNumber',
          inputType: 'input',
          span: 24
        }],
        formRules: {},
        form: {
        },
        inputDisabled: false,
        isEdit: false,
        midway: true,
        show: false,
        title: '访客预约详情'
      },
      accessControl: {
        value: '',
        data: []
      },
      dialog: {
        show: false,
        title: '',
        confirmShow: true,
        initData: {}
      },
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '登记时间',
        props: {
          fieldName: 'createTime'
        }
      }, {
        type: 'input',
        label: '访客姓名',
        props: {
          fieldName: 'visitorName'
        }
      }, {
        type: 'input',
        label: '访客联系电话',
        props: {
          fieldName: 'visitorPhone'
        }
      }, {
        type: 'input',
        label: '被访人',
        props: {
          fieldName: 'beVisitorName'
        }
      }, {
        type: 'select',
        label: '审批状态',
        props: {
          fieldName: 'visitStatus',
          options: [
            {
              name: '等待审核中',
              id: 0
            },{
              name: '审核已通过',
              id: 1
            },{
              name: '审核未通过',
              id: 2
            },{
              name: '离园销毁',
              id: 3
            }
          ]
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
        { label: '登记时间',
          prop: 'createTime',
          minWidth: '110px'
        },
        { label: '身份证扫描',
          prop: 'idPhoto',
          custom: true,
          minWidth: '110px'
        },
        { label: '访客姓名',
          prop: 'visitorName'
        },
        { label: '证件号',
          prop: 'visitorIdentity'
        },
        { label: '性别',
          prop: 'visitorSexText'
        },
        { label: '联系电话',
          prop: 'visitorPhone'
        },
        { label: '访客单位',
          prop: 'visitorUnit'
        },
        { label: '来访事由',
          prop: 'visitorCause'
        },
        {
          label: '来访时段',
          prop: 'imei',
          minWidth: '150px',
          render: (h, scope) => {
            if(scope.row.visitorBeginTime && scope.row.visitorEndTime) {
              return <span>{scope.row.visitorBeginTime}~{scope.row.visitorEndTime}</span>
            }
          }
        },
        { label: '被访人姓名',
          prop: 'beVisitorName'
        },
        { label: '被访人公司',
          prop: 'beVisitorCompany'
        },
        { label: '被访人部门',
          prop: 'beVisitorDepartment'
        },
        { label: '最近一次到访时间',
          prop: 'realBeginTime'
        },
        { label: '最近一次离访时间',
          prop: 'realEndTime',
          minWidth: '110px'
        },
        { label: '审批状态',
          prop: 'visitStatusText',
          minWidth: '110px'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      if(this.$route.query.personName) {
        this.searchItems[1].initValue = this.$route.query.personName;
        this.searchVal['visitorName'] = this.$route.query.personName;
      }
      this.onCurrentChange(1)
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    FormItem,
    Flex,
    detail,
    dialogCont,
    Detail,
    AuthEntrance
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    exportInfo() {
      // window.open(`${baseURL || config.baseURL.dev}/api/iot-park/doorAccessLog/exportVisitorInfo`, "_self")
      exportVisitorInfo().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        console.log(url)
        download(url, "来访人员记录.xls");
      })
      // window.open(`http://39.100.150.43:8021/api/iot-park/micro/accessLog/exportVisitorInfo`, "_self")
    },
    getInfo () {},
    handleClose () {
      this.intervieweeInfo.show = false;
    },
    dialogCancel (type) {
      if(type == 'info') {
        this.dialog.show = false;
        this.dialog.title = '';
        this.dialog.initData = {}
      }
    },
    async dialogSubmit (type) {
      if(type == 'info') {
        let result = await this.$refs.info_ref.submitInfo();
        if(result) {
          this.dialog.show = false;
          this.onCurrentChange(1);
        }
      }
    },
    approvalSubmit () {
      this._doorAccessLogProval(this.intervieweeInfo.form.visitCode, 1)
    },
    approvalCancel () {
      this._doorAccessLogProval(this.intervieweeInfo.form.visitCode, 2)
    },
    _doorAccessLogProval(code, status) {
      doorAccessLogProval(code, status).then(res => {
        if(res.code == '200') {
            this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.intervieweeInfo.show = false;
          this.onCurrentChange(1);
        }
      })
    },
    // 添加访客
    addVisitors () {
      this.dialog.show = true;
      this.dialog.title = '访客登记';
      this.dialog.initData = {}
    },
    // 日期选项
    onSearch (val) {
      
      this.searchVal = {
        ...val
      }
      if(val.registerTime) {
        this.searchVal['beginTime'] = val.registerTime[0];
        this.searchVal['endTime'] = val.registerTime[1];
        delete this.searchVal.registerTime
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal,
          visitCode: this.dialog.initData.visitCode || ''
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getVisitorInfo(data).then(res => {
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
    showView (type, item) {
      if (type === 'detail') {
        this.dialog.show = true;
        this.dialog.title = '访客详情';
        this.dialog.initData = item;
        this.dialog.confirmShow = item.visitStatus == 0 ? true : false;
      }
      if (type === 'approval') {
        this.intervieweeInfo.show = true;
        this.intervieweeInfo.form = item;
        this.dialog.confirmShow = true
      }
    }
  }
}
</script>

<style lang="less">
#visitorInformation{
  .el-dialog__body{
    padding: 0 20px;
  }
  .interInfo #adminFormItem {
    margin-top: 15px;
  }
  .closeBtn {
    border: 1px solid #DCDFE6 !important;
  }
}
</style>
