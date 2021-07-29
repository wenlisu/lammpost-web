/* eslint-disable camelcase */
<template>
  <div id='smokeDeviceManage' >
    <div class="flexRow deviceList">
      <div class="item">
        <div>设备总数：</div>
        <div><span>{{info.deviceCount}}</span>个</div>
      </div>
      <div class="item">
        <div>正常设备：</div>
        <div><span>{{info.normalCount}}</span>个</div>
      </div>
      <div class="item">
        <div>报警设备：</div>
        <div><span>{{info.alarmCount}}</span>个</div>
      </div>
      <div class="item">
        <div>故障设备：</div>
        <div><span>{{info.offlineCount}}</span>个</div>
      </div>
      <div class="item">
        <div>预警设备：</div>
        <div><span>{{info.warningCount}}</span>个</div>
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
              <!-- <el-button
                type="text"
                size="small"
                title="查看"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView('detail', {
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button> -->
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
    <!-- 设置阈值弹出框 -->
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
        :labelWidth="'105px'"
      />
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
  getSmokeDetectorDeviceForPage,
  getSmokeDetectorOnLineStatus,
  getSmokeDetectorCurrentStatus
} from 'api/smokeDetectorMap';
import { setThresholdValue } from 'api/admin'
export default {
  name: 'smokeDeviceManage',
  data () {
    return {
      // 设置阈值相关属性 start
      midway: true,
      isEdit: true,
      inputDisabled: false,
      form: {
        smokeConcentrationLowThreshold: undefined,
        temperatureLowThreshold: undefined
      },
      formItems: [{
        label: '烟雾浓度预警值',
        prop: 'smokeConcentrationLowThreshold',
        inputType: 'input',
        required: false,
        span: 24
      },{
        label: '温度预警阈值',
        prop: 'temperatureLowThreshold',
        inputType: 'input',
        required: false,
        span: 24
      }],
      formRules: {},
      addDialog: {
        show: false,
        item: null,
        title: '全部烟感探测器阈值设置'
      },
      // 设置阈值相关属性 end
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
          options: []
        }
      }],
      info: {},
      // 分页
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectsList: [],
      tableData: [],
      tableCols: [
        { label: '设备名称',
          prop: 'deviceName'
        },
        { label: '设备类型',
          prop: 'deviceTypeName'
        },
        { label: 'IMEI',
          prop: 'serialNumber'
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
          prop: 'lastReportTime',
          minWidth: '110px'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.onCurrentChange(1);
      getSmokeDetectorOnLineStatus().then(res => {
        if (res.code === '200') {
          const statusTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          getSmokeDetectorCurrentStatus({
          }).then(res => {
            if (res.code === '200') {
              this.info = res.data;
            }
          });
          this.$set(this.searchItems[3].props, 'options', statusTypes);
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
    setValue () {
      this.addDialog.show = true;
    },
    dialogAddCancel () {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.addDialog.item = null;
    },
    async dialogAddSubmit () {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        smokeConcentrationLowThreshold: +formData.smokeConcentrationLowThreshold,
        temperatureLowThreshold: +formData.temperatureLowThreshold,
        parkCode: "",
        floorCode: "",
        buildingCode: "",
        areaCode: "",
        serialNumberList: this.selectsList,
        smokeConcentrationMaxThreshold: +formData.smokeConcentrationLowThreshold,
        temperatureMaxThreshold: +formData.temperatureLowThreshold
      };
      setThresholdValue(JSON.stringify(parames)).then(res => {
        console.log(res)
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
      })

    },
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
      getSmokeDetectorDeviceForPage(data).then(res => {
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
  }
}
</script>

<style lang="less">
#smokeDeviceManage{
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
