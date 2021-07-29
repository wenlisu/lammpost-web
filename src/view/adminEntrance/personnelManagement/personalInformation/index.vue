/* eslint-disable camelcase */
<template>
  <div id='entrancePersonalInformation' >
    <!-- 人员信息 -->
    <header-title
      icon="iconfont icon-shouye"
      title="人员信息"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        :searchChangeValue="{}"
        @onSearch="onSearch"
        @onChange="searchChange"
        :addBtnVisible="true || $_hasOperation($options.name,'add')"
        @on-addBtn="showView('detail');"
        :addTitleBtn="'新增人员'"
        :otherBtnVisible="true"
        :otherBtnLists="[{
          label: '批量导入',
          click: () => batchAdd()
        }, {
          label: '批量授权',
          disabled: selectsList.length === 0,
          click: () => batchAuth()
        },{
          label: '导出',
          click: () => exportInfo()
        }]"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
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
              title="授权"
              @click.prevent.stop="showView('auth', {
                ...scope.row
              })"
              v-if="true || ($_hasOperation($options.name,'edit'))">
              <i class="iconfont icon-weihunengli" style="fontSize: 20px; color: #2573f1"/>
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
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      width="550px"
      :title="dialog.title"
      append-to-body
      customClass="entrancePersonalInformationDialog"
    >
     <div>
        <FormItem
          ref="visitorFormItem"
          :formItems="dialog.formItems"
          :rules="dialog.formRules"
          :disabled="dialog.inputDisabled"
          :isEdit="dialog.isEdit"
          :form="dialog.form"
          :midway="dialog.midway"
          @change="handleChangeFormItem"
          @select="handleSelectFormItem"
          :labelWidth="'120px'"
        >
          <template slot="registrationPhotos">
            <UploadFile
              type="img"
              uploadUrl="/api/fileupload/upload"
              :fileList="dialog.fileList"
              :limit="1"
              :progressShow="false"
              :multiple="false"
              @change="val => changeUploadFile(val)"
              :parames="{
                service_table: 'door_staff_info',
                serviceCode: `${dialog.serviceCode}`
              }"
              >
              <template v-slot:trigger v-if="dialog.fileList.length > 0">
                <br />
              </template>
              <template v-slot:content>
                <div class="flexCloumn flexCenter resource_img">
                  <div class="upload_img">
                    上传图片
                    <i class="el-icon-top"></i>
                  </div>
                </div>
              </template>
            </UploadFile>
          </template>
        </FormItem>
      </div>
    </dialog-cont>
    <dialog-cont
      @on-cancel="batchDialogCancel"
      @on-confirm="batchDialogSubmit"
      :bottomShow="false"
      :visible.sync="batchDialog.show"
      width="80%"
      :title="batchDialog.title"
      append-to-body
      customClass="entrancePersonalInformationBatchDialog"
    >
     <div class="">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in batchDialog.activities"
          :key="index">
          <div slot="dot" class="flexRow flexCenter dot">
            {{index + 1}}
          </div>
          <div class="flexCloumn content">
            <el-button
              type="primary"
              size="small"
              :title="activity.name"
              :style="{marginRight: '10px'}"
              @click="activity.onClick">
              {{activity.name}}
            </el-button>
            <div
              class="fileContainer"
              :class="{ 'is-success': index === 1 && batchDialog.success, 'is-loading': index === 1 && batchDialog.loading }"
              v-if="activity.fileName"
            >
              <i class="el-icon-document" />
              <span class="fileName">{{activity.fileName}}</span>
              <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"/>
              <i class="el-icon-loading" />
              <i class="el-icon-close" @click="activity.onDelete"/>
              </label>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-tabs v-model="batchDialog.activetTabsName" type="card">
        <el-tab-pane
          label="校验结果"
          name="1"
          lazy
        >
          <span slot="label"><i class="iconfont icon-jibenxinxi1"></i> 校验结果</span>
          <el-button
            type="primary"
            size="small"
            title="重新提交"
            :style="{marginBottom: '10px'}"
            @click.prevent.stop="showVerfiyView('submit')">
            重新提交
          </el-button>
          <page-table
            ref="verfiyTable"
            col-align="center"
            operator-width="110"
            operator
            :selection="false"
            :data="batchDialog.verify.tableData"
            :cols="batchDialog.verify.tableCols"
            :showPage="false"
          >
            <template
              slot-scope="scope"
              slot="regImage"
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="`${baseURL || config.baseURL.dev}/upload/${scope.row.regImage}`"
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
                title="查看"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showVerfiyView('detail', {
                  ...scope.row
                }, scope.index)">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <UploadFile
                  type="img"
                  uploadUrl="/api/fileupload/upload"
                  :fileList="(scope.row.regImage && scope.row.regImageUrl) ? [{
                    url: scope.row.regImageUrl,
                    path: scope.row.regImage
                  }] : []"
                  :limit="1"
                  :progressShow="false"
                  :multiple="false"
                  @change="val => changeUploadRegImageFile(val, scope)"
                  :parames="{
                    service_table: 'door_staff_info',
                    serviceCode: `${dialog.serviceCode}`
                  }"
                  v-if="scope.row.checkResult.indexOf(3) > -1"
                  >
                  <template v-slot:trigger v-if="dialog.fileList.length > 0">
                    <br />
                  </template>
                  <template v-slot:content>
                    <div class="flexCloumn flexCenter resource_img">
                      <div class="upload_img">
                        上传图片
                        <i class="el-icon-top"></i>
                      </div>
                    </div>
                  </template>
                </UploadFile>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  @click.prevent.stop="showVerfiyView('del', {
                    ...scope.row
                  }, scope.index)">
                  <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button>
            </flex>
            </template>
          </page-table>
        </el-tab-pane>
      </el-tabs>
      </div>
    </dialog-cont>
    <AuthEntrance
      :show="authDialog.show"
      :select="authDialog.select"
      :defaultTransfer="authDialog.select.length > 0"
      @cancel="authDialogCancel"
      @authEntranceSubmit="authDialogSubmit"
    />
    <input type="file" text="导入文件" @change="handleFileChange" class="fileInput" ref="inputFile" v-if="batchDialog.show" multiple/>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import FormItem from '@/components/adminFormItem';
import dialogCont from '@/components/adminDialog';
import PageTable from '@/components/adminPage-table';
import upload from '@/components/upload/upload';
import UploadFile from '@/components/upload/uploadFile';
import Flex from '@/components/flex';
import config, { baseURL } from '@/config';
import { ENTRANCE_CHECK_TYPE, SEX_TYPE } from '@/util/constants';
import { download } from '@/util/util';
import AuthEntrance from './authEntrance';
import {
  getDoorAccessEmployeeInfoPage,
  getDoorAccessEmployeeInfoDetail,
  editDoorAccessEmployeeInfo,
  removeDoorAccessEmployeeInfo,
  downloadTemplate,
  importPersonFromZip,
  importFailedList,
  saveImportFailedPerson,
  getDictionaryInfo,
  saveDoorAccessPermission,
  getDoorAccessPermission,
  exportEmployeeInfo
} from 'api/entrance';
export default {
  name: 'entrancePersonalInformation',
  data () {
    return {
      config,
      baseURL,
      searchVal: {},
      searchChangeValue: {
      },
      searchItems: [{
        type: 'input',
        label: '姓名',
        initValue: '',
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
          options: [{
            id: 1,
            name: '男'
          }, {
            id: 0,
            name: '女'
          }]
        }
      }, {
        type: 'select',
        label: '公司',
        initValue: undefined,
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
      selectsList: [],
      excelFile: undefined,
      imgFile: undefined,
      employeeCompany: {},
      employeeCompanyCode: {},
      employeeDepartment: {},
      employeeDepartmentCode: {},
      dialog: {
        title: '新增人员信息',
        show: false,
        type: undefined,
        index: undefined,
        fileList: [],
        formItems: [{
          label: '登记照片',
          prop: 'registrationPhotos',
          inputType: 'custom',
          required: false,
          span: 24
        }, {
          label: '姓名',
          prop: 'employeeName',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '员工编号',
          prop: 'employeeCode',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '手机号码',
          prop: 'employeePhone',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '身份证号',
          prop: 'employeeIdentity',
          inputType: 'input',
          required: true,
          span: 24
        }, {
          label: '性别',
          prop: 'employeeSex',
          inputType: 'radio',
          required: true,
          options: [{
            id: 1,
            name: '男'
          }, {
            id: 0,
            name: '女'
          }],
          span: 24
        }, {
          label: '类型',
          prop: 'employeeType',
          inputType: 'select',
          options: [ {
            name: '白名单',
            id: 1
          }, {
            name: '黑名单',
            id: 2
          }],
          span: 24
        }, {
          label: '公司',
          prop: 'employeeCompanyCode',
          inputType: 'select',
          required: true,
          options: [],
          span: 24
        }, {
          label: '部门',
          prop: 'employeeDepartmentCode',
          inputType: 'select',
          options: [],
          span: 24
        }, {
          label: '门禁卡号',
          prop: 'accessCardCode',
          inputType: 'input',
          span: 24
        }, {
          label: '有效期',
          prop: 'validity',
          inputType: 'select',
          options: [{
            name: '永久有效',
            id: 1
          }, {
            name: '临时名单',
            id: 2
          }],
          span: 24
        }, {
          label: '有效期截止时间',
          prop: 'expirationTime',
          inputType: 'daterange',
          type: 'date',
          hide: false,
          span: 24
        }],
        formRules: {},
        form: {
          employeeCompanyCode: undefined,
          employeeDepartmentCode: undefined,
          employeeType: 1
        },
        oldForm: {
          employeeCompanyCode: undefined,
          employeeDepartmentCode: undefined
        },
        serviceCode: '',
        inputDisabled: false,
        isEdit: false,
        midway: true
      },
      batchDialog: {
        title: '上传人像数据',
        show: false,
        fileType: undefined,
        sequenceNo: undefined,
        activities: [{
          name: '下载模板',
          fileName: '人员导入模板.zip',
          onClick: () => this.downLoadTemplate(),
          onDelete: () => {}
        }, {
          name: '上传人员数据',
          onClick: () => this.updateData('excelFile'),
          fileName: '',
          onDelete: () => this.deleteFile('excelFile')
        }, {
          name: '提交',
          onClick: () => this.saveData()
        }],
        success: false,
        loading: false,
        activetTabsName: '1',
        verify: {
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          },
          tableData: [],
          tableCols: [
            { label: '公司',
              prop: 'companyName'
            },
            { label: '部门',
              prop: 'departmentName'
            },
            { label: '姓名',
              prop: 'personName'
            },
            { label: '员工编号',
              prop: 'personNo'
            },
            { label: '门禁卡号',
              prop: 'doorAccessCardNo'
            },
            { label: '证件号',
              prop: 'identityNo'
            },
            { label: '登记照片',
              prop: 'regImage',
              minWidth: '123px',
              custom: true
            },
            { label: '手机号码',
              prop: 'mobilePhone'
            },
            { label: '性别',
              prop: 'sex',
              render: (h, scoped) => {
                const { types } = this.$_useTypes(SEX_TYPE)
                return <span>{types[scoped.row.sex]}</span>
              }
            },
            { label: '类型',
              prop: 'roleText'
            },
            { label: '到期时间',
              prop: 'endDate'
            },
            { label: '核查结果',
              prop: 'checkResultText',
              minWidth: '130px',
              render: (h, scoped) => {
                return <div>{scoped.row.checkResultText.join(',')}</div>
              }
            }
          ]
        },
        imgVerify: {
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          },
          tableData: [],
          tableCols: [
            { label: '公司',
              prop: 'companyName'
            },
            { label: '部门',
              prop: 'departmentName'
            },
            { label: '姓名',
              prop: 'personName'
            },
            { label: '员工编号',
              prop: 'personNo'
            },
            { label: '门禁卡号',
              prop: 'doorAccessCardNo'
            },
            { label: '证件号',
              prop: 'identityNo'
            },
            { label: '登记照片',
              prop: 'regImage',
              minWidth: '123px',
              custom: true
            },
            { label: '手机号码',
              prop: 'mobilePhone'
            },
            { label: '性别',
              prop: 'sex',
              render: (h, scoped) => {
                const { types } = this.$_useTypes(SEX_TYPE)
                return <span>{types[scoped.row.sex]}</span>
              }
            },
            { label: '类型',
              prop: 'roleText'
            },
            { label: '到期时间',
              prop: 'endDate'
            },
            { label: '核查结果',
              prop: 'checkResultText',
              render: (h, scoped) => {
                return <div>{scoped.row.checkResultText.join(',')}</div>
              }
            }
          ]
        }
      },
      authDialog: {
        title: '人员授权',
        show: false,
        select: [],
        data: []
      }
    }
  },
  created () {
    if(this.$route.query.personName) {
      this.searchItems[0].initValue = this.$route.query.personName;
      this.searchVal['employeeName'] = this.$route.query.personName;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dialog.serviceCode = moment().format('YYYYMMDDHHmmss');
      if (this.searchItems[4].props.options.length === 0) {
        getDictionaryInfo(1266).then(res => {
          if (res.code === '200') {
            this.dialog.formItems[7].options = res.data;
            this.searchItems[4].props.options = res.data;
            res.data.map(employee => {
              this.employeeCompany[employee.id] = {code: employee.code, name: employee.name};
              this.employeeCompanyCode[employee.code] = employee.id;
            });
          }
        });
      }
      this.onCurrentChange(1)
    })
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    FormItem,
    dialogCont,
    UploadFile,
    AuthEntrance
  },
  methods: {
    exportInfo() {
      exportEmployeeInfo().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        console.log(url)
        download(url, "人员信息.xls");
      })
    },
    // 日期选项
    onSearch (val) {
      this.searchVal = {
        ...val,
        employeeCompany: this.employeeCompany[val.employeeCompany] && this.employeeCompany[val.employeeCompany].code,
        employeeDepartment: this.employeeDepartment[val.employeeDepartment] && this.employeeDepartment[val.employeeDepartment].code
      }
      this.onCurrentChange(1);
    },
    searchChange (val) {
      if (!!val.employeeCompany && (val.employeeCompany !== this.searchChangeValue.employeeCompany)) {
        getDictionaryInfo(val.employeeCompany).then(res => {
          if (res.code === '200') {
            this.searchChangeValue = {
              ...this.searchChangeValue,
              ...val,
              employeeDepartment: null
            };
            this.searchItems[5].props.options = res.data;
            this.searchItems[4].initValue = val.employeeCompany;
            res.data.map(employeeDepar => {
              this.employeeDepartment[employeeDepar.id] = {code: employeeDepar.code, name: employeeDepar.name};
              this.employeeDepartmentCode[employeeDepar.code] = employeeDepar.id;
            });
          }
        });
      }
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
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1);
    },
    changeUploadFile (list) {
      console.log('list', list);
      this.dialog.form.registrationPhotos = list.length > 0 ? list[0].path : undefined;
      this.dialog.fileList = list;
    },
    onSelectionChange (args) {
      this.selectsList = args.map(arg => {
        return {
          employeeCode: arg.employeeCode,
          employeeName: arg.employeeName
        }
      });
    },
    showView (type, item) {
      if (type === 'detail') {
        this.dialog.show = true;
        if (this.dialog.formItems[7].options.length === 0) {
          getDictionaryInfo(1266).then(res => {
            if (res.code === '200') {
              this.dialog.formItems[7].options = res.data;
              res.data.map(employee => {
                this.employeeCompany[employee.id] = {code: employee.code, name: employee.name};
                this.employeeCompanyCode[employee.code] = employee.id;
              });
            }
          });
        }
        if (item) {
          this.dialog.title = '编辑人员信息';
          this._getDoorAccessEmployeeInfoDetail(item.employeeCode)
        }
      } else if (type === 'del') {
        this.$confirm('此操作将永久删除该所选人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const employeeCode = [item.employeeCode];
          removeDoorAccessEmployeeInfo(employeeCode).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.onCurrentChange(this.page.current);
            }
          });
        });
      } else if (type === 'auth') {
        this.selectsList = [{
          employeeCode: item.employeeCode,
          employeeName: item.employeeName
        }];
        getDoorAccessPermission(item.employeeIdentity).then(res => {
          if (res.code === '200') {
            this.authDialog.select = res.data.map(key => key.serialNumber);
            this.authDialog.show = true;
          }
        });
      }
    },
    _getDoorAccessEmployeeInfoDetail (employeeCode) {
      getDoorAccessEmployeeInfoDetail(employeeCode).then(async res => {
        if (res.code === '200') {
          const employeeCompanyId = this.employeeCompanyCode[res.data.employeeCompanyCode];
          await getDictionaryInfo(employeeCompanyId).then(infoRes => {
            if (infoRes.code === '200') {
              this.dialog.formItems[8].options = infoRes.data;
              infoRes.data.map(employeeDepar => {
                this.employeeDepartment[employeeDepar.id] = {code: employeeDepar.code, name: employeeDepar.name};
                this.employeeDepartmentCode[employeeDepar.code] = employeeDepar.id;
              });
            }
          });
          const employeeDepartmentId = this.employeeDepartmentCode[res.data.employeeDepartmentCode];
          this.dialog.form = {
            ...res.data,
            employeeCompanyCode: employeeCompanyId,
            employeeDepartmentCode: employeeDepartmentId
          };
          this.dialog.oldForm = JSON.parse(JSON.stringify(this.dialog.form));
          this.dialog.fileList = [{
            url: `${baseURL || config.baseURL.dev}/upload/${res.data.registrationPhotos}`,
            path: res.data.registrationPhotos,
            name: '登记照片'
          }];
        }
      })
    },
    handleChangeFormItem (val) {
      if (JSON.stringify(this.dialog.oldForm) !== JSON.stringify(val)) {
        if (this.dialog.oldForm.validity !== val.validity) {
          if (val.validity === 1) {
            this.dialog.formItems[11].hide = true;
          } else if (val.validity === 2) {
            this.dialog.formItems[11].hide = false;
          }
        }
        if (this.dialog.oldForm.employeeCompanyCode !== val.employeeCompanyCode) {
          getDictionaryInfo(val.employeeCompanyCode).then(res => {
            if (res.code === '200') {
              this.dialog.formItems[8].options = res.data;
              res.data.map(employeeDepar => {
                this.employeeDepartment[employeeDepar.id] = {code: employeeDepar.code, name: employeeDepar.name};
                this.employeeDepartmentCode[employeeDepar.code] = employeeDepar.id;
              });
              val.employeeDepartmentCode = undefined;
            }
          });
        }
        if (this.dialog.oldForm.employeeDepartmentCode !== val.employeeDepartmentCode) {
          this.dialog.form.employeeDepartmentCode = val.employeeDepartmentCode;
        }
        this.dialog.oldForm = JSON.parse(JSON.stringify(val));
      }
    },
    handleSelectFormItem (val) {
      if (JSON.stringify(this.dialog.oldForm.employeeDepartmentCode) !== JSON.stringify(val.employeeDepartmentCode)) {
        this.dialog.form = {...this.dialog.oldForm};
        this.dialog.form.employeeDepartmentCode = val.employeeDepartmentCode;
        this.dialog.oldForm = JSON.parse(JSON.stringify(val));
      }
    },
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.type = undefined;
      this.dialog.index = undefined;
      this.dialog.form = {};
      this.dialog.oldForm = {};
      this.$refs.visitorFormItem.resetForm();
      this.dialog.fileList = [];
      this.dialog.title = '新增人员信息';
    },
    async dialogSubmit () {
      let message = '新增成功';
      const formData = await this.$refs.visitorFormItem.getValue();
      const parames = {
        ...formData,
        registrationPhotos: this.dialog.fileList[0].path,
        employeeCompanyCode: this.employeeCompany[formData.employeeCompanyCode].code,
        employeeDepartmentCode: this.employeeDepartment[formData.employeeDepartmentCode].code,
        visitorType: 1
      };
      if (this.dialog.form.id) {
        message = '修改成功';
        parames.id = this.dialog.form.id;
      }
      if (this.dialog.type !== 'verfiy') {
        editDoorAccessEmployeeInfo(parames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: message,
              type: 'success',
              position: 'bottom-right'
            });
            this.dialogCancel();
            this.onCurrentChange(this.page.current);
          }
        });
      } else if (this.dialog.index !== undefined) {
        const tableData = {
          ...parames,
          companyName: this.employeeCompany[formData.employeeCompanyCode].name,
          departmentName: this.employeeDepartment[formData.employeeDepartmentCode].name,
          personName: parames.employeeName,
          personNo: parames.employeeCode,
          doorAccessCardNo: parames.accessCardCode,
          identityNo: parames.employeeIdentity,
          regImage: parames.registrationPhotos,
          mobilePhone: parames.employeePhone,
          sex: parames.employeeSex,
          role: parames.employeeType,
          endDate: parames.expirationTime
        };
        this.batchDialog.verify.tableData[this.dialog.index] = tableData;
        this.$set(this.batchDialog.verify.tableData[this.dialog.index], tableData)
        this.$refs.verfiyTable.updateTable();
        this.dialogCancel();
      }
    },
    batchAdd () {
      this.batchDialog.show = true;
    },
    batchDialogCancel () {
      this.batchDialog.show = false;
      this.batchDialog.fileType = undefined;
      this.batchDialog.success = false;
      this.batchDialog.loading = false;
      this.batchDialog.sequenceNo = undefined;
      this.setFileName(undefined, undefined)
      this.batchDialog.activetTabsName = '1';
      this.batchDialog.verify.tableData = [];
      this.batchDialog.imgVerify.tableData = '1';
      this.batchDialog.verify.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.batchDialog.imgVerify.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
    },
    batchDialogSubmit () {

    },
    handleFileChange (val) {
      console.log(val)
      this.batchDialog.loading = true;
      this.batchDialog.fileLoading = true;
      const fileItem = val.target.files[0];
      this[this.batchDialog.fileType] = fileItem;
      this.setZipData(fileItem);
    },
    setFileName (type, fileItem) {
      this.batchDialog.activities[1].fileName = fileItem ? fileItem.name : undefined;
    },
    setZipData (fileItem) {
      const wfForm = new FormData();
      wfForm.append('file', fileItem);
      this.setFileName(this.batchDialog.fileType, fileItem);
      this.batchDialog.success = true;
      this.batchDialog.loading = false;
      // importPersonFromZip(wfForm).then(res => {
      //   if (res.code === '200') {
      //     this.batchDialog.success = true;
      //     this.batchDialog.sequenceNo = res.data;
      //     this.setFileName(this.batchDialog.fileType, fileItem);
      //   }
      //   this.batchDialog.loading = false;
      // });
    },
    downLoadTemplate () {
      downloadTemplate().then(res => {
        let blob = new Blob([res.data]);
        let url = window.URL.createObjectURL(blob);
        download(url, '人员导入模板.zip');
      });
    },
    updateData (type) {
      this.$refs.inputFile.click();
      this.batchDialog.fileType = type;
    },
    deleteFile (type) {
      this[type] = undefined;
      this.batchDialog.success = false;
      this.batchDialog.sequenceNo = undefined;
      this.setFileName(type, undefined)
    },
    saveData () {
      if (!this.batchDialog.sequenceNo) {
        this.$notify({
          title: '失败',
          message: '请先上传人员数据',
          type: 'error',
          position: 'bottom-right'
        });
        return;
      }
      importFailedList(this.batchDialog.sequenceNo).then(res => {
        if (res.code === '200') {
          let verifyTable = [];
          this.batchDialog.verify.tableData = res.data;
          if (res.data.length === 0) {
            this.$notify({
              title: '成功',
              message: '人员数据上传成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.batchDialogCancel();
            this.onCurrentChange(this.page.current);
          }
        }
      });
    },
    async showVerfiyView (type, item, index) {
      this.dialog.type = 'verfiy';
      this.dialog.index = index;
      if (type === 'detail') {
        this.dialog.show = true;
        if (this.dialog.formItems[7].options.length === 0) {
          getDictionaryInfo(1266).then(res => {
            if (res.code === '200') {
              this.dialog.formItems[7].options = res.data;
              res.data.map(employee => {
                this.employeeCompany[employee.id] = {code: employee.code, name: employee.name};
                this.employeeCompanyCode[employee.code] = employee.id;
              });
            }
          });
        }
        if (item) {
          this.dialog.title = '编辑人员信息';
          this.dialog.form = {
            ...item,
            employeeName: item.personName,
            employeeCode: item.personNo,
            accessCardCode: item.doorAccessCardNo,
            employeeIdentity: item.identityNo,
            registrationPhotos: item.regImage,
            employeePhone: item.mobilePhone,
            employeeSex: item.sex,
            employeeType: item.role,
            expirationTime: item.endDate
          };
          this.dialog.fileList = [{
            url: `${baseURL || config.baseURL.dev}/upload/${item.regImage}`,
            path: item.regImage,
            name: '登记照片'
          }];
          // if (item.id) {
          if (!item.employeeCompanyCode) {
            return;
          }
          const employeeCompanyId = this.employeeCompanyCode[item.employeeCompanyCode];
          getDictionaryInfo(employeeCompanyId).then(async infoRes => {
            if (infoRes.code === '200') {
              this.dialog.formItems[8].options = infoRes.data;
              await infoRes.data.map(employeeDepar => {
                this.employeeDepartment[employeeDepar.id] = {code: employeeDepar.code, name: employeeDepar.name};
                this.employeeDepartmentCode[employeeDepar.code] = employeeDepar.id;
              });
              const employeeDepartmentId = this.employeeDepartmentCode[item.employeeDepartmentCode];
              this.dialog.form = {
                ...this.dialog.form,
                employeeCompanyCode: employeeCompanyId,
                employeeDepartmentCode: employeeDepartmentId
              };
              this.dialog.oldForm = JSON.parse(JSON.stringify(this.dialog.form));
            }
          });
        }
      } else if (type === 'del') {
        this.$confirm('此操作将永久删除该所选人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchDialog.verify.tableData.splice(index, 1);
        });
      } else if (type === 'submit') {
        const importStatus = await this._saveImportFailedPerson(this.batchDialog.verify.tableData);
        if (importStatus && importStatus.data) {
          this.batchDialog.sequenceNo = importStatus.data;
          this.batchDialog.verify.tableData = [];
          this.saveData();
        }
      }
    },
    _saveImportFailedPerson (item) {
      return saveImportFailedPerson(item).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '重新上传成功',
            type: 'success',
            position: 'bottom-right'
          });
          return res;
        }
        return false;
      });
    },
    onVerifyCurrentChange (val) {
      this.batchDialog.verify.page.current = val;
      // this.getDataAllList()
    },
    onVerifyPageSizeChange (val) {
      this.batchDialog.verify.page.pageSize = val
      this.onCurrentChange(1)
    },
    changeUploadRegImageFile (val, scope) {
      const index = scope.index;
      this.batchDialog.imgVerify.tableData[index].regImage = val.path;
      this.batchDialog.imgVerify.tableData[index].regImageUrl = val.url;
    },
    onImgVerifyCurrentChange (val) {
      this.batchDialog.imgVerify.page.current = val;
      // this.getDataAllList()
    },
    onImgVerifyPageSizeChange (val) {
      this.batchDialog.imgVerify.page.pageSize = val
      this.onCurrentChange(1)
    },
    authDialogCancel () {
      this.authDialog.show = false;
      this.selectsList = [];
      this.authDialog.select = [];
      this.$refs.pageTable.getPageTable();
    },
    authDialogSubmit (seletData) {
      let deviceInfo = [];
      seletData.map(item => {
        item && item.nodeCode && deviceInfo.push({
          deviceName: item.nodeName,
          serialNumber: item.nodeCode
        })
      });
      const parames = this.selectsList.map(selectObj => {
        return {
          ...selectObj,
          deviceInfo
        }
      });
      saveDoorAccessPermission(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '批量授权成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.authDialogCancel();
        }
        this.$forceUpdate()
      });
    },
    batchAuth () {
      this.authDialog.show = true;
    }
  }
}
</script>

<style lang="less">
#entrancePersonalInformation{
  .fileInput{
    position: absolute;
    opacity: 0;
  }
}
.entrancePersonalInformationDialog{
  .el-upload{
    display: flex;
    height: auto;
    width: auto;
    margin-bottom: 10px;/*no*/
  }
  .avatar-uploader{
    align-items: center;
    ul{
      li{
        &:nth-of-type(2){
          display: none;
        }
      }
    }
  }
  .resource_img {
    width: 182px;/*no*/
    height: 152px;/*no*/
    // background: #e6e6e6;
    background: transparent;
    border-radius: 5px;/*no*/
    // margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    border: 2px dashed rgba(44, 52, 58, 1);/*no*/
    // border: 1px solid #9c9c9c;/*no*/
    .upload_img {
      margin: 0 auto;
      // margin-top: 72px;
      // margin-bottom: 15px;
      padding:0 40px;/*no*/
      height: 30px;/*no*/
      line-height: 30px;/*no*/
      text-align: center;
      background: rgba(72, 128, 255, 1);
      box-shadow: 0px 4px 7px 0px rgba(72, 128, 255, 0.5);/*no*/
      border-radius: 19px;/*no*/
      color: #fff;
      position: relative;
      .el-icon-top {
        position: absolute;
        right: 2px;/*no*/
        top: 50%;
        transform: translateY(-50%);
        width: 26px;/*no*/
        height: 26px;/*no*/
        line-height: 26px;/*no*/
        border-radius: 50%;
        background: rgba(56, 107, 225, 1);
        font-size: 12px;/*no*/
        color: #fff;
      }
    }
  }
}
.entrancePersonalInformationBatchDialog{
  .el-dialog__body{
    button{
      position: relative;
    }
    .el-timeline{
      display: flex;
      flex-direction: row;
      padding:0px 0 30px;/*no*/
      margin-bottom: 10px;/*no*/
    }
    .el-timeline-item {
      flex: 1;
      padding-bottom: 0;
      .el-timeline-item__tail {
        display: flex;
        right: 0px;
        left: auto;
        top: 50%;
        transform: translateY(-50%);
        width: 80%;
        height: 1px;/*no*/
        background: #E4E7ED;
        border: none;
      }

      .el-timeline-item__dot {
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        /*no*/
      }

      .el-timeline-item__wrapper {
        top: 50%;
        transform: translateY(-50%);
        .el-timeline-item__content {
          .content {
            button{
              width: 120px;/*no*/
              position: relative;
              .fileInput{
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
              }
            }
            .fileContainer{
              margin-top: 10px;/*no*/
              padding: 5px 5px;/*no*/
              position: absolute;
              bottom: -30px;/*no*/
              left: 28px;/*no*/
              right: 0;
              cursor: pointer;
              .fileName{
                height: 100%;
                color: #909399;
                line-height: inherit;
                margin-right: 10px;/*no*/
              }
              label{
                position: absolute;
                right: 5px;/*no*/
                top: 50%;
                transform: translateY(-50%);
                line-height: inherit;
                i{
                  &.el-icon-upload-success{
                    color: #67c23a;
                  }
                  &.el-icon-loading{
                    display: none;
                  }
                  &.el-icon-close{
                    cursor: pointer;
                    display: none;
                  }
                }
              }
              &:hover{
                background: #e9e8e8;
                .fileName{
                  color:#409eff;
                }
                label{
                  i{
                    &.el-icon-upload-success{
                      display: none;
                    }
                    &.el-icon-loading{
                      display: none;
                    }
                    &.el-icon-close{
                      display: block;
                    }
                  }
                }
              }
              &.is-loading{
                label{
                  display: block;
                  i{
                    &.el-icon-upload-success{
                      display: none;
                    }
                    &.el-icon-loading{
                      display: block;
                    }
                    &.el-icon-close{
                      display: none;
                    }
                  }
                }
              }
              &.is-success{
                label{
                  display: block;
                }
              }
            }
          }
        }
      }
      &:last-child{
        .el-timeline-item__tail{
          display: none;
        }
      }
    }
    .dot {
      width: 19px;
      /*no*/
      height: 19px;
      /*no*/
      line-height: 19px;
      /*no*/
      border-radius: 50%;
      // background: rgba(29, 41, 87, 1);
      border: 2px solid rgba(72, 128, 255, 1);
      /*no*/
      font-size: 12px;
      /*no*/
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color:#000;
    }
  }
}
</style>
