<template>
  <div id="dataDetail">
      <card title="水表信息" :className="'adminCard basicsCard'">
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
        <div class="saveButton">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="saveData">保存</el-button>
        </div>
      </card>
  </div>
</template>

<script>
import card from 'view/lightPole/lightPoleStatistical/components/card';
import FormItem from '@/components/adminFormItem';
import { getWaterMeterDeviceDtl, editWaterMeterDeviceDtl } from 'api/water'
export default {
  components: {
    card,
    FormItem
  },
  data() {
    return {
      midway: true,
      isEdit: true,
      inputDisabled: false,
      form: {
        serialNumber: undefined,
        deviceName: undefined,
        installAddress: undefined,
        deviceTypeName: undefined,
        waterMeterDiameter: undefined,
        userName: undefined,
        userTel: undefined,
        unitPrice: undefined,
        flowWarningThreshold: undefined,
        peakPeriod: undefined,
        thresholdUnpaidAmount: undefined,
        peakHourPricing: undefined,
        offPeak: undefined,
        troughPricing: undefined
      },
      formItems: [{
        label: '水表编码',
        prop: 'serialNumber',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '水表名称(房间号)',
        prop: 'deviceName',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '水表地址',
        prop: 'installAddress',
        inputType: 'input',
        required: false,
        span: 24,
        disabled: true
      }, {
        label: '水表口径',
        prop: 'waterMeterDiameter',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '用户名称',
        prop: 'userName',
        inputType: 'input',
        required: false,
        span: 12
      }, {
        label: '手机号码',
        prop: 'userTel',
        inputType: 'input',
        required: false,
        span: 12
      }, {
        label: '日常水表单价',
        prop: 'unitPrice',
        inputType: 'inputUnit',
        required: false,
        span: 12,
        unit: '元/m³',
        disabled: true
      }, {
        label: '瞬时流量预警阀值',
        prop: 'flowWarningThreshold',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '高峰时段',
        prop: 'peakPeriod',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '未缴费金额预警阀值',
        prop: 'thresholdUnpaidAmount',
        inputType: 'inputUnit',
        required: false,
        span: 12,
        unit: '元',
        disabled: true
      }, {
        label: '高峰时段计价',
        prop: 'peakHourPricing',
        inputType: 'inputUnit',
        required: false,
        span: 12,
        unit: '元/m³',
        disabled: true
      }, {
        label: '低谷时段',
        prop: 'offPeak',
        inputType: 'input',
        required: false,
        span: 12,
        disabled: true
      }, {
        label: '低谷时段计价',
        prop: 'troughPricing',
        inputType: 'inputUnit',
        required: false,
        span: 12,
        unit: '元/m³',
        disabled: true
      }]
    }
  },
  created() {
    const serialNumber = this.$route.query.serialNumber
     this._getWaterMeterDeviceDtl(serialNumber)
  },
  methods: {
    _getWaterMeterDeviceDtl(serialNumber) {
      getWaterMeterDeviceDtl(serialNumber).then(res => {
        if(res.code == '200') {
          const data = {
            ...res.data,
            ...res.data.waterMeterConfigDto,
            ...res.data.waterMeterInfoDto,
            ...res.data.waterMeterPayInfoDto
          }
          for(let key in this.form) {
            this.form[key] = data[key] || ''
          }
        }
      })
    },
    async saveData () {
      const formData = await this.$refs.formItem.getValue()
      const data = {
        serialNumber: this.$route.query.serialNumber,
        userName: formData.userName,
        userTel: formData.userTel
      }
      this._editWaterMeterDeviceDtl(data)

    },
    _editWaterMeterDeviceDtl (data) {
      editWaterMeterDeviceDtl(data).then(res => {
        if(res.code == '200') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            position: 'bottom-right'
          })
          this.$router.push({
            name: 'waterMeterManagement'
          })
        }
      }) 
    },
    cancel() {
      this.$router.push({
        name: 'waterMeterManagement'
      })
    }
  }
}
</script>

<style scoped>
  .saveButton {
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }
  .saveButton .el-button--primary {
    background-color: #2573f1 !important;
    border-color: transparent;
  }
  .saveButton .el-button {
    border: 1px solid #409eff !important;
    font-size: 14px;
    width: 100px;
    border-radius: 0 !important;
}
</style>