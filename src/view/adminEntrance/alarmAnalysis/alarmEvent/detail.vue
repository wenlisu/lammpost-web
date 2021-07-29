<template>
  <div id="entranceAlarmEventDetail">
    <card title="基本信息" :className="'adminCard'">
      <FormItemText
        :layout="formItems"
        labelWidth="0px"
      >
      </FormItemText>
    </card>
    <card title="事件处理进展" :className="'adminCard'">
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
import card from 'view/lightPole/lightPoleStatistical/components/card';
import FormItemText from '@/components/formItemText/formItemText';

export default {
  data () {
    return {
      editData: {},
      formItems: [{
        id: 'terminalName',
        label: 'IMEI',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '安装位置',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '告警编号',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '告警类型',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '告警时间',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '告警级别',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '维护负责人',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'terminalName',
        label: '联系电话',
        value: '',
        unit: '',
        span: 8
      }],
      stepList: []
    };
  },
  mounted () {
    this.$nextTick(() => {
      if (this.openPage === 'entranceAlarmEventDetail') {
        this.editData = this.common['entranceAlarmEventDetail'];
        this.init();
      }
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  components: {
    card,
    FormItemText
  },
  methods: {
    init () {
    }
  }
};
</script>

<style lang="less">
#entranceAlarmEventDetail{
}
</style>
