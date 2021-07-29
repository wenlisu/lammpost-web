<template>
  <div id="mobile_Login">
    <div class="head_title">登录</div>
    <div class="flexCenter login_content">
    <div class="flexCloumn flexCenter content">
      <div class="cont-login">
        <p>Hi！</p>
        <p>欢迎登录</p>

        <form class="login-form">
          <div class="item">
            <el-input
              placeholder="账号"
              prefix-icon="iconfont icon-xingzhuang1"
              v-model="form.username"
              clearable
            ></el-input>
          </div>
          <div class="item">
            <el-input
              type="password"
              placeholder="密码"
              prefix-icon="iconfont icon-mimasuo"
              v-model="form.password"
              @keyup.enter.native="loginTo"
              clearable
            ></el-input>
          </div>

          <el-button
             :disabled="butDisabled"
            @click="loginTo"
            :class="{'butDisabled':butDisabled}"
            :loading="butDisabled"
            class="form-but"
          >
            <span v-if="butDisabled">登录中...</span>
            <span v-else>登&nbsp;&nbsp;录</span>
          </el-button>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { getLocal, delLocal, saveLocal, hasOneOf } from 'util/tool';
import { getEvents } from 'api/IBM';
import Config from '@/config';
import axios from 'axios';
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '888888'
      },
      showBg2: false,
      butDisabled: false // 登陆按钮状态
    };
  },
  computed: {
  },
  methods: {
    ...mapActions({
      userLoginTo: 'user/userLoginTo',
      getUserRoleRouter: 'getUserRoleRouter'
    }),
    ...mapMutations({
      setUserInfo: 'user/setUserInfo'
    }),
    // 登陆
    loginTo () {
      if (this.form && this.form.username && this.form.password) {
        this.butDisabled = true;
        this.userLoginTo({ ...this.form })
          .then(resData => {
            // 获取rolecode传进去
            this.getUserRoleRouter(resData.username).then(res => {
              this.setUserInfo({
                username: resData.realName,
                user: resData.modifyUser
              });
              // this.$router.addRoutes(routes)
              // this.$router.options.routes = this.$router.options.routes.concat(routes);
              const pushName = getLocal('pushName');
              this.$router.push({ name: Config.homeName }, () => {
                pushName && this.$router.push(pushName)
              });
              delLocal('pushName');
            });
          })
          .catch(err => {
            this.butDisabled = false;
          });
      } else {
        this.$message.error('请填写您的登陆账号 / 密码');
        this.butDisabled = false;
      }
    }
  },
  created () {
    document.body.style.minWidth = 'auto';
    document.getElementById('app').style.overflow = 'auto';
    // this.getList();
  }
};
</script>
<style lang="less" scoped>
#mobile_Login {
    height: 100%;
  .head_title {
    background: #ff6701;
    text-align: center;
    height: 88px;
    font-size: 32px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 88px;
  }
  .login_content {
    height: calc(100% - 30%);
    .content{
        width: 80%;
        padding: 30px 30px;
        border: 1px solid #ddd;
        .cont-login{
            width: 100%;
        }
        p{
                font-size: 30px;
                font-weight: bold;
                margin-bottom: 10px;
        }
        /deep/.el-input__inner{
            padding-left: 40px;
        }
    }
.login-form {
  .item {
    overflow: hidden;
    color: #c4c4c4;
    margin-bottom: 20px;
    .el-input--suffix .el-input__inner {
      padding-right: 43px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 43px;
    }
    .el-input__prefix {
      top: 2px;
      left: 12px;
      i{
        font-size: 20px;
      }
    }
    .el-input__inner{
                  border:1px solid rgba(186,186,186,1);/*no*/
            border-radius: 0;
            font-size: 14px;/*no*/
            background-color: transparent;
            height: 40px !important;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(77,77,77,1);
      &:focus{
        outline: none;
        background:rgba(241,247,255,1);
        border:1px solid rgba(12,103,173,1);/*no*/
      }
    }
  }

  .form-but, .form-but:hover, .form-but:active, .form-but&.is-disabled {
    margin-top: 10px;
    width: 100%;
    height: 66px;
    line-height: 0px;
    font-size:32px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(255,255,255,1) !important;
    background:#ff6701 !important;
    border-radius:4px;/*no*/
  }

  .butDisabled,
  .butDisabled:hover {
    background-color: #fab6b6;
  }
}
  }
}
</style>
