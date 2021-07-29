<template>
  <div id="formItem">
    <el-form
      ref="formData"
      :model="preForm"
      :label-width="labelWidth"
      :rules="rules"
    >
       <baseInfo :formItems="formItems" :disabled="disabled" :form="preForm" @change="val => handleChangeForm(val)"/>
    </el-form>
    <div class="handle-footer" v-if="isEdit && haveFoot">
      <el-button class="reset-btn" @click="$_resetForm">
        取消
      </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$_loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import baseInfo from './base';
export default {
  data () {
    return {
      unChange: true,
      preForm: JSON.parse(JSON.stringify(this.form))
    };
  },
  components: {
    baseInfo
  },
  props: {
    form: {
      type: Object,
      default  () {
        return {}
      }
    },
    formItems: {
      type: Array,
      default () {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return false
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submit: Function,
    labelWidth: {
      type: [Number, String],
      default: '120px'
    },
    haveFoot: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'form': {
      deep: true,
      handler: function (nowVal, oldVal) {
        this.preForm = JSON.parse(JSON.stringify(nowVal));
      }
    },
    layout (val) {
      this.$set(this.layout, val);
    },
    preForm (val) {
    }
  },
  computed: {
  },
  methods: {
    submitForm () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          var $this = this;
          this.$emit('submit', this.preForm)
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    cancelForm () {
      this.$refs.formData.resetFields();
    },
    change (e) {
      this.$forceUpdate()
    },
    getValue (name) {
      if (name) {
        return this.preForm[name];
      }
      return this.preForm;
    },
    handleChangeForm (val) {
      // this.$emit('change', val);
    }
  },
  mounted () {
    var $this = this;
  }
};
</script>

<style lang="less" scoped>
#formItem{
  // .comp-wrapper-header{
  //   padding: 0;
  // }
  .el-form-item {
    height: 25px !important;/*no*/
    margin-bottom: 12px;
    label{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      line-height: 25px;/*no*/
      color:rgba(230,236,255,1);
    }
    input{
      font-size:12px;/*no*/
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(230,236,255,1);
      background:rgba(34,44,81,0.5);
      border-radius:4px;/*no*/
      border:1px solid rgba(98,117,191,1);
    }
    .el-form-item__content{
      height: 25px;/*no*/
      line-height: 25px;/*no*/
    }
    .el-input{
      width: 100% !important;
      input{
        height: 25px !important;/*no*/
      }
    }
  }
  .el-input-number{
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    >span{
      height: 17.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.el-input-number__increase{
        top: 2px;
      }
    }
    .el-input{
      input{
        text-align: left;
      }
    }
  }
  .radioGroup{
    width: 100%;
    text-align: left;
  }
}
.handle-footer {
  height: 70px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px -3px 4px 0px rgba(222, 222, 222, 0.5);
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 1;
  button {
    width: 88px;
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
}
</style>
