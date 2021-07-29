<template>
  <div id="updatePassword">
    <div class="content-view pt-20">
        <el-form status-icon :model="dataInfo" label-width="85px" ref="formData" :rules="rules">
        <el-row :gutter="10">
            <el-col :span="24">
            <el-form-item label="旧密码：" prop="oldPassword">
                <el-input type="password" v-model="dataInfo.oldPassword" suffix-icon="iconfont icon-mimaffffffpx f-14">
                <i
                    slot="suffix"
                    title="请输入旧密码"
                    v-if="rulesTips.oldPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="新密码：" prop="newPassword">
                <el-input type="password" v-model="dataInfo.newPassword" suffix-icon="iconfont icon-mimaffffffpx f-14">
                <i
                    slot="suffix"
                    title="请输入新密码"
                    v-if="rulesTips.newPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input type="password" v-model="dataInfo.confirmPassword" suffix-icon="iconfont icon-mimaffffffpx f-14">
                <i
                    slot="suffix"
                    title="请输入确认新密码"
                    v-if="rulesTips.confirmPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <div class="btnInfo text-center mt-10">
                <el-button
                size="small"
                type="primary"
                @click="submitForm(1)"
                :disabled="$_loading"
                >确认</el-button>
                <el-button  size="small" @click="$_resetForm">重置</el-button>
            </div>
            </el-col>
        </el-row>
        </el-form>
    </div>
  </div>
</template>

<script>
import {updatePassword} from 'api/user.js'
export default {
  name: 'updatePassword',
  data () {
    return {
      dataInfo: {
        confirmPassword: '', // 确认新密码
        newPassword: '', // 新密码
        oldPassword: '' // 旧密码
      },
      // 验证
      rules: {
        confirmPassword: [
          { required: true, validator: this.$_checkValidate, trigger: 'change' }
        ], // 确认新密码
        newPassword: [
          { required: true, validator: this.$_checkValidate, trigger: 'change' }
        ], // 新密码
        oldPassword: [
          { required: true, validator: this.$_checkValidate, trigger: 'change' }
        ] // 旧密码
      },
      // 验证提示
      rulesTips: {
        confirmPassword: false, // 确认新密码
        newPassword: false, // 新密码
        oldPassword: false // 旧密码
      }
    };
  },
  methods: {
    // 确定数据
    submitForm () {
      const _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          updatePassword(this.dataInfo).then(res => {
            if (res.code == '200') {
              this.$notify({
                title: '成功',
                message: '修改密码成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.$_resetForm()
            }
          })
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
    // 重置验证规则状态
    resetRulesTips () {
      this.rulesTips = Object.assign(this.rulesTips, {
        confirmPassword: false, // 确认新密码
        newPassword: false, // 新密码
        oldPassword: false // 旧密码
      });
    }
  },
  components: {}
};
</script>
