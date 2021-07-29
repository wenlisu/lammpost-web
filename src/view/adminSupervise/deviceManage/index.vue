/* 智慧监测-设备管理 */
/* eslint-disable camelcase */
<template>
  <div id='superviseDeviceManage' >
    <div class="flexRow deviceList">
      <div class="item">
        <div>设备总数：</div>
        <div><span>{{info.totalCount}}</span>个</div>
      </div>
      <div class="item">
        <div>在线设备：</div>
        <div><span>{{info.onlineCount}}</span>个</div>
      </div>
      <div class="item">
        <div>离线设备：</div>
        <div><span>{{info.offlineCount}}</span>个</div>
      </div>
      <div class="item">
        <div>报警设备：</div>
        <div><span>{{info.alarmCount}}</span>个</div>
      </div>
      <div class="item">
        <div>故障设备：</div>
        <div><span>{{info.faultCount}}</span>个</div>
      </div>
    </div>
    <!-- 设备管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="设备管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add');"
        otherBtnVisible
        :otherBtnLists="[{
          label: '设置阀值',
          disabled: selectsList.length === 0,
          click: () => setValue()
        }]"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="60"
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
                @click.prevent.stop="setValue({
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="showView('del', {
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
        :formItems="formItems"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
        :midway="midway"
        :labelWidth="'85px'"
      />
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import Flex from '@/components/flex';
import {
  getSmokeDetectorDeviceForPage,
  getSmokeDetectorOnLineStatus,
  getSmokeDetectorCurrentStatus
} from 'api/smokeDetectorMap';
import {
  getAmbientMonitoringDeviceForPage,
  getAmbientMonitoringRunStatus,
  saveAmbientMonitoringThreshold
} from 'api/supervise';
export default {
  name: 'superviseDeviceManage',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        span: 12,
        type: 'dataPicker',
        label: '时间',
        props: {
          fieldName: 'time'
        }
      }, {
        type: 'input',
        label: '设备名称',
        props: {
          fieldName: 'deviceName'
        }
      }, {
        type: 'input',
        label: '安装地址',
        props: {
          fieldName: 'installAddress'
        }
      }, {
        type: 'select',
        label: '在线状态',
        props: {
          fieldName: 'onlineStatus',
          options: [{
            id: 1,
            name: '在线'
          }, {
            id: 2,
            name: '离线'
          }, {
            id: 3,
            name: '预警'
          }, {
            id: 4,
            name: '报警'
          }]
        }
      }],
      info: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '设备名称',
          prop: 'deviceName'
        },
        { label: 'IMEI',
          prop: 'imei'
        },
        { label: '安装地址',
          prop: 'installAddress',
          minWidth: '110px'
        },
        { label: '经度',
          prop: 'longitude'
        },
        { label: '纬度',
          prop: 'latitude'
        },
        { label: '在线状态',
          prop: 'onlineStatusText'
        },
        { label: '最后上报时间',
          prop: 'lastReportDate',
          minWidth: '110px'
        },
        { label: '温度报警范围(℃)',
          prop: 'lastReportTime',
          minWidth: '120px',
          render: (h, scoped) => {
            return <div>{scoped.row.temperatureLowThreshold}~{scoped.row.temperatureMaxThreshold}</div>
          }
        },
        { label: '湿度报警范围(%)',
          prop: 'lastReportTime',
          minWidth: '120px',
          render: (h, scoped) => {
            return <div>{scoped.row.humidityLowThreshold}~{scoped.row.humidityMaxThreshold}</div>
          }
        },
        { label: '噪声报警范围(分贝)',
          prop: 'lastReportTime',
          minWidth: '130px',
          render: (h, scoped) => {
            return <div>{scoped.row.noiseLowThreshold}~{scoped.row.noiseMaxThreshold}</div>
          }
        },
        { label: 'PM2.5报警范围(ug/m³)',
          prop: 'lastReportTime',
          minWidth: '130px',
          render: (h, scoped) => {
            return <div>{scoped.row.pmLowThreshold}~{scoped.row.pmMaxThreshold}</div>
          }
        },
        { label: 'PM10报警范围(ug/m³)',
          prop: 'lastReportTime',
          minWidth: '130px',
          render: (h, scoped) => {
            return <div>{scoped.row.pmTenLowThreshold}~{scoped.row.pmTenMaxThreshold}</div>
          }
        }
      ],
      selectsList: [],
      addDialog: {
        show: false,
        item: null,
        title: '全部环境监测器阀值设置'
      },
      inputDisabled: false,
      isEdit: true,
      form: {
        temperatureLowThreshold: undefined,
        temperatureMaxThreshold: undefined,
        humidityLowThreshold: undefined,
        humidityMaxThreshold: undefined,
        noiseLowThreshold: undefined,
        noiseMaxThreshold: undefined,
        pmLowThreshold: undefined,
        pmMaxThreshold: undefined,
        pmTenLowThreshold: undefined,
        pmTenMaxThreshold: undefined
      },
      formItems: [{
        label: '温度下限',
        prop: 'temperatureLowThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: '温度上限',
        prop: 'temperatureMaxThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: '湿度下限',
        prop: 'humidityLowThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: '湿度上限',
        prop: 'humidityMaxThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: '噪声下限',
        prop: 'noiseLowThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: '噪声上限',
        prop: 'noiseMaxThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: 'PM2.5下限',
        prop: 'pmLowThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: 'PM2.5上限',
        prop: 'pmMaxThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: 'PM10下限',
        prop: 'pmTenLowThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }, {
        label: 'PM10上限',
        prop: 'pmTenMaxThreshold',
        inputType: 'input',
        required: true,
        span: 12
      }],
      formRules: {
      },
      midway: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
      getAmbientMonitoringRunStatus({}).then(res => {
        if (res.code === '200') {
          this.info = res.data;
        }
      });
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
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1]
      };
      delete this.searchVal.time;
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
      getAmbientMonitoringDeviceForPage(data).then(res => {
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
      this.selectsList = args.map(arg => arg.serialNumber);
    },
    setValue (item) {
      this.addDialog.show = true;
      this.addDialog.item = item;
      this.form = {
        temperatureLowThreshold: item.temperatureLowThreshold,
        temperatureMaxThreshold: item.temperatureMaxThreshold,
        humidityLowThreshold: item.humidityLowThreshold,
        humidityMaxThreshold: item.humidityMaxThreshold,
        noiseLowThreshold: item.noiseLowThreshold,
        noiseMaxThreshold: item.noiseMaxThreshold,
        pmLowThreshold: item.pmLowThreshold,
        pmMaxThreshold: item.pmMaxThreshold,
        pmTenLowThreshold: item.pmTenLowThreshold,
        pmTenMaxThreshold: item.pmTenMaxThreshold
      }
    },
    dialogAddCancel () {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.addDialog.item = null;
      this.form = {
        temperatureLowThreshold: undefined,
        temperatureMaxThreshold: undefined,
        humidityLowThreshold: undefined,
        humidityMaxThreshold: undefined,
        noiseLowThreshold: undefined,
        noiseMaxThreshold: undefined,
        pmLowThreshold: undefined,
        pmMaxThreshold: undefined,
        pmTenLowThreshold: undefined,
        pmTenMaxThreshold: undefined
      };
    },
    async dialogAddSubmit (val) {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        temperatureLowThreshold: +formData.temperatureLowThreshold,
        temperatureMaxThreshold: +formData.temperatureMaxThreshold,
        humidityLowThreshold: +formData.humidityLowThreshold,
        humidityMaxThreshold: +formData.humidityMaxThreshold,
        noiseLowThreshold: +formData.noiseLowThreshold,
        noiseMaxThreshold: +formData.noiseMaxThreshold,
        pmLowThreshold: +formData.pmLowThreshold,
        pmMaxThreshold: +formData.pmMaxThreshold,
        pmTenLowThreshold: +formData.pmTenLowThreshold,
        pmTenMaxThreshold: +formData.pmTenMaxThreshold
      };
      if (this.addDialog.item) {
        parames.address = this.addDialog.item.address;
        parames.area = this.addDialog.item.area;
        parames.city = this.addDialog.item.city;
        parames.serialNumberList = [this.addDialog.item.serialNumber];
      } else {
        parames.serialNumberList = [...this.selectsList]
      }
      saveAmbientMonitoringThreshold(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogAddCancel();
          this.getDataAllList();
        }
      });
    }
  }
}
</script>

<style lang="less">
#superviseDeviceManage{
  .deviceList{
    padding: 20px;/*no*/
    background: #fff;
    position: relative;
    &::after{
      content: '';
      height: 1px;/*no*/
      width: calc(100% - 40px);/*no*/
      background: #D8D8D8;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .item{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-right: 25px;/*no*/
      >div{
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #464646;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        span{
          font-size: 18px;/*no*/
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #F66211;
          margin-left: 5px;/*no*/
        }
      }
      &:nth-of-type(2) {
        span{
          color:#2EAD60;
        }
      }
      &:nth-of-type(3) {
        span{
          color:#FE3939;
        }
      }
      &:nth-of-type(4) {
        span{
          color:#C954EA;
        }
      }
      &:nth-of-type(5) {
        span{
          color:#F38F20;
        }
      }
    }
  }
}
</style>
