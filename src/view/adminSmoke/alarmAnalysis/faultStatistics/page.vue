<template>
  <div id="faultStatisticPage">
    <div class="flexRow titleHeader">
        <div class="title">烟感设备</div>
        <span class="status">故障</span>
    </div>
    <FormItemText
        :layout="baseInfoItems"
        labelWidth="0px"
    >
    </FormItemText>
    <card title="故障处理进展" :className="'adminCard'">
        <el-steps finish-status="success">
            <el-step
                v-for="item in stepList"
                :key="item.dealNode"
            >
            <div slot="title">
                {{item.dealNote}}
            </div>
            <div slot="description">
                <div>{{item.dealTime}}</div>
                <div>{{item.dealer}}</div>
                <div>{{item.dealReason}}</div>
            </div>
            </el-step>
        </el-steps>
    </card>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import {
  getSmokeDetectorDeviceDtl,
  getSmokeDetectorWorkOrder
} from 'api/smokeDetectorMap';
export default {
  data () {
    return {
      baseInfoItems: [{
        id: 'serialNumber',
        label: 'IMEI',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'installAddress',
        label: '安装位置',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmNo',
        label: '告警编号',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmName',
        label: '故障类型',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'alarmTime',
        label: '故障时间',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'securityUser',
        label: '维护负责人',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'securityUserTel',
        label: '联系电话',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 8
      }, {
        id: 'alarmStatusText',
        label: '告警状态',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 8
      }, {
        id: 'faultTimeLen',
        label: '故障持续时长',
        value: '',
        unit: '',
        class: 'noBottom',
        span: 8
      }],
      editData: {},
      stepList: []
    };
  },
  props: {
    listData: {
    }
  },
  components: {
    card,
    FormItemText
  },
  mounted () {
    this.$nextTick(() => {
      if (this.routeName === 'faultStatisticPage') {
        this.editData = this.common['faultStatisticPage'];
        if (this.editData && this.editData.serialNumber) {
          this.init();
        }
      }
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    init () {
      getSmokeDetectorDeviceDtl(this.editData.serialNumber).then(async res => {
        if (res.code === '200') {
          const baseInfoItems = await this.$_setItem(this.baseInfoItems, res.data);
          this.baseInfoItems = baseInfoItems;
        }
      });
      this._getSmokeDetectorWorkOrder({
        alarmNo: this.editData.alarmNo,
        serialNumber: this.editData.serialNumber
      });
    },
    _getSmokeDetectorWorkOrder (data) {
      getSmokeDetectorWorkOrder(data).then(res => {
        if (res.code === '200') {
          this.stepList = res.data;
        }
      });
    }
  }
};
</script>

<style lang="less">
#faultStatisticPage{
    .titleHeader{
        padding: 10px;/*no*/
        border-bottom: 1px solid #ccc;/*no*/
        margin-bottom: 10px;/*no*/
        .title{
            font-size: 14px;/*no*/
            color: #000;
            margin-right: 5px;/*no*/
            display: flex;
            align-items: center;
        }
        .status{
            background: blue;
            color: #fff;
            font-size: 12px;/*no*/
            padding: 2px 5px;/*no*/
        }
    }
    #formItemText{
        padding: 10px;/*no*/
        margin-bottom: 10px;/*no*/
        background: #fff;
        .el-form-item{
            .el-form-item__content{
                color:rgba(73,73,73,1);
            }
        }
    }
}
</style>
