<template>
  <div id="login">
    <div class="flexCloumn flexCenter content pos-a">
      <div class="platform-logo">
        <el-avatar shape="square" :size="'large'" :src="logo"></el-avatar>
        <h4>城市基础设施管理平台</h4>
      </div>
      <div class="cont-login">
        <p>登录</p>
        <form class="login-form">
          <label>账号</label>
          <div class="item">
            <el-input
              placeholder="请输入账号"
              autocomplete="new-password"
              prefix-icon="iconfont icon-xingzhuang1"
              v-model="form.username"
              clearable
            ></el-input>
          </div>
          <label>密码</label>
          <div class="item" style="display: none">
            <el-input
              type="password"
              name="password"
              placeholder="请输入密码"
              autocomplete="new-password"
              prefix-icon="iconfont icon-mimasuo"
              v-model="form.password"
              @keyup.enter.native="loginTo"
              clearable
            ></el-input>
          </div>
          <div class="item">
            <el-input
              type="password"
              name="password"
              placeholder="密码"
              autocomplete="new-password"
              prefix-icon="iconfont icon-mimasuo"
              v-model="form.password"
              @keyup.enter.native="loginTo"
              clearable
            ></el-input>
          </div>
          <!-- <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox> -->
          <el-button
            :disabled="butDisabled"
            @click="loginTo"
            :class="{ butDisabled: butDisabled }"
            :loading="butDisabled"
            class="form-but"
          >
            <span v-if="butDisabled">登录中...</span>
            <span v-else>登&nbsp;&nbsp;录</span>
          </el-button>
        </form>
      </div>
    </div>
    <!-- 底部动效 -->
    <div class="bottom-animation">
      <lineComponent :width="494" :height="19" className="line1" />
      <lineComponent :width="494" :height="19" className="line2" />
      <lineComponent :width="229" :height="75" className="line3" :type="2" />
      <lineComponent :width="229" :height="75" className="line4" :type="2" />
      <lineComponent :width="170" :height="75" className="line5" :type="2" />
      <lineComponent :width="170" :height="75" className="line7" :type="2" />
      <div class="device_1">
        <centerDevice />
      </div>
      <div class="device_2"><frontDevice :src="device2" /></div>
      <div class="device_3"><frontDevice :src="device3" /></div>
      <div class="device_4"><besideDevice :src="device4" /></div>
      <div class="device_5"><besideDevice :src="device5" /></div>
      <!-- <div class="device_6"><miniDevice :src="device6"/></div> -->
    </div>
    <!-- loading -->
    <div class="loading-bg" v-if="butDisabled"></div>
    <div class="loading noselect pos-f" v-if="butDisabled">
      <i
        class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"
      ></i>
      <span class="f-13">登录中，请稍后...</span>
    </div>
    <div class="ft f-12 cont-w tx-center mt-20 mb-50" v-if="false">
      Copyright ©1999-2019 ChinaUnicom All Rights
      Reserved.中国联合网络通信有限公司广东省分公司
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Cookies from "js-cookie";
import { mapActions, mapMutations } from "vuex";
import { getLocal } from "util/tool";
// import { encrypt, decrypt } from "util/jsencrypt";
import Config, { baseURL } from "@/config";
import logo from "common/images/logo-l.png";
import { getDeviceRequestDateInterval } from "api/index";
import { getAccessToken } from "api/screen";
import { getProjectByUser } from "api/user";
import centerDevice from "./components/device_1.vue";
import lineComponent from "./components/line.vue";
import frontDevice from "./components/device_2.vue";
import besideDevice from "./components/device_3.vue";
import miniDevice from "./components/device_4.vue";
import device2 from "./images/device2.png";
import device3 from "./images/device3.png";
import device4 from "./images/device4.png";
import device5 from "./images/device5.png";
import device6 from "./images/device6.png";
export default {
  name: "login",
  components: {
    centerDevice,
    lineComponent,
    frontDevice,
    besideDevice,
    miniDevice,
  },
  data() {
    return {
      device6: device6,
      device5: device5,
      device4: device4,
      device2: device2,
      device3: device3,
      logo: logo,
      form: {
        username: "",
        password: "",
      },
      showBg2: false,
      butDisabled: false, // 登陆按钮状态
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions({
      userLoginTo: "user/userLoginTo",
      getUserRoleRouter: "getUserRoleRouter",
    }),
    ...mapMutations({
      setUserInfo: "user/setUserInfo",
      set_dynamicMenuList: "set_dynamicMenuList",
    }),
    // 登陆
    loginTo() {
      if (this.form && this.form.username && this.form.password) {
        this.butDisabled = true;
        // if (this.form.rememberMe) {
        //   Cookies.set("username", this.form.username, { expires: 24 });
        //   Cookies.set("password", encrypt(this.form.password), {
        //     expires: 24,
        //   });
        //   Cookies.set("rememberMe", this.form.rememberMe, { expires: 24 });
        // } else {
        //   Cookies.remove("username");
        //   Cookies.remove("password");
        // }
        this.userLoginTo({ ...this.form })
          .then((resData) => {
            getProjectByUser().then((res) => {
              if (res.code === "200") {
                let { data } = res;
                data[0] && data[0].code
                  ? (data = data)
                  : data.push({ relationName: "", code: "" });
                store.commit("set_appCodes", {
                  appCodes: data,
                  appCode: data[0].code,
                });
                getDeviceRequestDateInterval().then((updateRes) => {
                  if (updateRes.code === "200") {
                    store.commit("set_updateTime", {
                      ...updateRes.data,
                    });
                    localStorage.setItem(
                      "baseURL",
                      baseURL || Config.baseURL.dev
                    );
                  }
                });
                // 获取rolecode传进去
                this.getUserRoleRouter(resData.username).then((res) => {
                  this.setUserInfo({
                    username: resData.realName,
                    user: resData.modifyUser,
                  });
                  this.$router.push({
                    path: "/",
                  });
                });
                getAccessToken().then((res) => {
                  if (res.code === "200") {
                    store.commit("set_common", {
                      accessToken: res.data,
                      screenFrame: "index",
                    });
                  }
                });
              }
            });
          })
          .catch((err) => {
            this.butDisabled = false;
          });
      } else {
        this.$message.error("请填写您的登陆账号 / 密码");
        this.butDisabled = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
// 重置
.login-form {
  .item {
    overflow: hidden;
    color: #fff;
    /deep/.el-input.el-input--suffix .el-input__inner {
      padding-right: 30px;
    }
    /deep/.el-input.el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
    /deep/.el-input__prefix {
      top: 2px;
      left: 12px;
      i {
        font-size: 18px;
        color: #cddcf6;
      }
    }
    /deep/.input {
      background: rgba(10, 12, 33, 0.15) !important;
    }
    /deep/.el-input__inner {
      border: 1px solid #9ac6fe;
      border-radius: 0;
      background: rgba(10, 12, 33, 0.15) !important;
      font-size: 14px; /*no*/
      height: 40px !important;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
      box-shadow: unset;
      &:focus {
        color: #fff;
        border: 1px solid #9ac6fe;
        border-radius: 0;
        background: rgba(10, 12, 33, 0.15);
        // outline: none;
        // background:rgba(241,247,255,1);
        // border: 1px solid rgba(12, 103, 173, 1); /*no*/
      }
    }
  }

  .form-but,
  .form-but:hover,
  .form-but:active,
  .form-but&.is-disabled {
    margin-top: 21px;
    width: 100%;
    height: 50px;
    padding: 14px 20px;
    line-height: 0px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 400;
    background: linear-gradient(0deg, #0e89e7 0%, #20bffa 50%, #24c4ff 100%);
    border: 1px solid;
    border-image: linear-gradient(0deg, #0db2ff 0%, #00deff 100%) 1 1;
    border-radius: 0px;
    box-shadow: -4px 0px 0px NaNpx rgba(2, 79, 180, 0.46);
    color: rgba(255, 255, 255, 1) !important;
    // text-shadow: 0px 2px 4px rgba(10,12,33,0.15); /*no*/
    // background: linear-gradient(146deg, #00cbff 7%, #007fd4 93%) !important;
    // box-shadow: unset; /*no*/
    // border-radius: 0px; /*no*/
  }

  .butDisabled,
  .butDisabled:hover {
    background-color: #fab6b6;
  }
}

/* 谷歌浏览器记住密码 默认样式修改 begin */
input:focus:-webkit-autofill,
input:-webkit-autofill {
  -webkit-text-fill-color: #fff !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(23, 97, 171, 0) inset !important;
  transition: background-color 500000s ease-in-out 50000s;
}

.lineComponent {
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  // animation: lineing 1s linear infinite;
  &.line1 {
    width: 32%;
    // height: 19px;
    overflow: hidden;
    top: 32%;
    transform: translateX(-112%);
    // animation: lineing1 1s linear infinite;
  }
  &.line2 {
    width: 32%;
    overflow: hidden;
    top: 32%;
    left: 54%;
    transform: rotateY(180deg);
    // animation: lineing1 1s linear infinite;
  }
  &.line3 {
    height: 50%;
    width: 10%;
    overflow: hidden;
    top: 30%;
    transform: translateX(-153%);
    // animation: lineing2 1s linear infinite;
  }
  &.line5 {
    height: 40%;
    width: 12%;
    overflow: hidden;
    top: 38%;
    transform: rotateX(180deg) translateX(-290%);
    // animation: lineing3 1s linear infinite;
  }
  &.line4 {
    height: 50%;
    width: 10%;
    overflow: hidden;
    top: 30%;
    left: 55%;
    transform: rotateY(180deg);
    // animation: lineing2 1s linear infinite;
  }
  &.line7 {
    height: 40%;
    width: 12%;
    overflow: hidden;
    top: 37%;
    left: 72%;
    transform: rotate(180deg);
    // animation: lineing3 1s linear infinite;
  }
}
@keyframes lineing1 {
  0% {
    width: 0%;
  }
  100% {
    width: 32%;
  }
}
@keyframes lineing2 {
  0% {
    width: 0%;
  }
  100% {
    width: 10%;
  }
}
@keyframes lineing2 {
  0% {
    width: 0%;
  }
  100% {
    width: 12%;
  }
}
/* 谷歌浏览器记住密码 默认样式修改 end */
</style>

<style lang="less" scoped>
@import "./login.less";
</style>




