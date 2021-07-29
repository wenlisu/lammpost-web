<template>
  <div id="adminContent" class="h1">
    <div
      class="cont-left pos-f"
      :style="{ width: openMenu ? '55px' : '220px' }"
    >
      <adminSideMenu
        :openMenu="openMenu"
        :default-active="tageActive"
        :menuData="menuData"
        @on-select="openMenuSelect"
      ></adminSideMenu>
    </div>

    <header id="topHeader">
      <span class="main-header-title" @click="goIndex">
        <span class="system_logo"></span>
        城市基础设施管理平台
      </span>
      <scrollView>
        <ul class="flexRow mainHeaderList">
          <li
            v-for="(item, index) in menuParentList"
            :key="item.name + index"
            @click="changeMenuParent(item)"
            :class="{ isActive: filtrKey === item.name }"
          >
            <i :class="item.meta.icon" />
            <span class="title">{{ item.meta.title }}</span>
          </li>
        </ul>
      </scrollView>
      <flex inline align="center" justify="flex-end">
        <el-dropdown @command="handleCommand">
          <span class="h-handler flexRow flexCenter dropdown-link">
            <img class="avatar" />
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="h-handler">
          <el-button type="text" class="quit-button" @click="_outUserLogin">
            <i class="iconfont icon-tuichu"></i>
            退出</el-button
          >
        </div>
      </flex>
    </header>
    <div
      class="cont-right pos-a"
      :style="{ left: openMenu ? '55px' : '220px' }"
    >
      <tabs
        @close-type="closeType"
        :menuTagsData="menuTagsData"
        @delTage="delTage"
        @on-select="_tageActive"
        :defaultTage="tageActive"
      ></tabs>
      <!-- <div class="pageTitle">
        <span
          :style="{color:(currentRouteName==item.name?'#065BDC':'#606060')}"
          v-for="(item, index) in currentTitleList"
          :key="index"
        >
          <span>{{item.title}}</span>
          <span style="padding:0 5px" v-if="index!=currentTitleList.length-1">/</span>
        </span>
      </div> -->
      <div
        class="back"
        :style="{
          display:
            this.$route.matched[this.$route.matched.length - 1].name === 'edit'
              ? 'block'
              : 'none',
        }"
      >
        <el-button type="primary" class="quit-button" @click="goBack">
          <i class="el-icon-back"></i>
          返回
        </el-button>
      </div>
      <keep-alive :include="keepAliveName" :max="8">
        <router-view
          ref="keepAlive229"
          class="mainContent"
          :style="{
            paddingBottom: contentPaddingBottom,
          }"
        >
        </router-view>
      </keep-alive>
    </div>
    <!-- 修改密码弹框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="modifyShow"
      width="30%"
      @open="onOpen"
      @close="canceledit"
    >
      <div v-if="modifyShow">
        <FormItem
          ref="modifyPassWord"
          :formItems="pw.formItems"
          :rules="pw.formRules"
          :disabled="pw.inputDisabled"
          :isEdit="pw.isEdit"
          :form="pw.form"
          :midway="pw.midway"
          @change="handleChangeFormItem"
          @submit="checkPass"
          :labelWidth="'120px'"
        ></FormItem>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </span>
    </el-dialog>
    <div class="loading-bg" v-if="$_loading"></div>
    <div class="loading noselect pos-f" v-if="$_loading">
      <i
        class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"
      ></i>
      <span class="f-13">正在加载，请稍后...</span>
    </div>
  </div>
</template>

<script>
import Flex from "@/components/flex";
import Tabs from "components/tabs/tabs";
import adminSideMenu from "components/adminSideMenu/adminSideMenu";
import scrollView from "@/components/sideMenu/scrollView";
import Config from "@/config";
import FormItem from "@/components/adminFormItem";
import dialogCont from "components/dialog";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getPublicKey, updatePassword } from "api/user";
import { encrypt, decrypt } from "util/jsencrypt";
export default {
  name: "adminContent",
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原密码不能为空"));
      }
      this.pw.form["oldPassword"] = value;
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      this.pw.form["newPassword"] = value;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.pw.form.confirmPassword !== "") {
          this.$refs.modifyPassWord.$refs.preForm.validateField(
            "confirmPassword"
          );
        }
        callback();
      }
    };
    var checkNewPass = (rule, value, callback) => {
      this.pw.form["confirmPassword"] = value;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pw.form.newPassword) {
        console.log(value, this.pw.form);
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      pw: {
        formItems: [
          {
            label: "用户账户",
            value: "",
            required: false,
            span: 24,
          },
          {
            label: "原密码",
            prop: "oldPassword",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "新密码",
            prop: "newPassword",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "确认密码",
            prop: "confirmPassword",
            inputType: "input",
            required: true,
            span: 24,
          },
        ],
        formRules: {
          oldPassword: [
            { required: true, validator: validatePass, trigger: "blur" },
          ],
          newPassword: [
            { required: true, validator: validatePass2, trigger: "blur" },
          ],
          confirmPassword: [
            { required: true, validator: checkNewPass, trigger: "blur" },
          ],
        },
        form: {
          username: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
        inputDisabled: false,
        isEdit: false,
        midway: true,
      },
      modifyShow: false,
      dialog: {
        note: false, // 便签
        content: "", // 便签内容
      },
      menuActiveClass: false, // 当前被选中菜单
      menuBdWidth: "0px", // 右侧宽度
      openMenu: false, // logo
      zoom: false, // 是否全屏
      openUserCenter: false, // 个人头像下的菜单栏
      currentRouteName: "", // 当前路由name
      filtrKey: "admin",
      menuData: [],
      menuParentList: [],
      // currentTitleList:[]//当前路由标题列表
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.filtrKey = this.$route.matched[0].name;
      this.menuParentList = this.menuList.filter(
        (ls) => ls.name.indexOf("admin") > -1
      );
      const menuData = this.menuParentList.find(
        (ls) => ls.name === this.filtrKey
      );
      this.menuData = menuData.children;
    });
  },
  methods: {
    ...mapMutations([
      "set_menuTags",
      "set_delMenuTage",
      "set_openPage",
      "set_menuTagsList",
      "set_closeAllTab",
      "set_keepAliveRouter",
    ]),
    ...mapActions({
      userLoginOut: "user/userLoginOut",
    }),
    // 页面刷新
    _refreshPage() {
      window.location.reload();
      this.$router.push({
        name: "indexPage",
      });
    },
    // 点击左侧菜单添加tage
    openMenuSelect(list) {
      this.set_openPage(list.name);
      this.set_menuTags(list);
      this.$router.push({
        name: list.name,
      });
    },
    // 关闭当前tage
    delTage(name) {
      this.set_delMenuTage(name);
      this.$router.push({
        name: this.openPage,
      });
    },
    // 当前选中的tage
    _tageActive(toName) {
      this.set_openPage(toName);
    },
    // 个人头像下的菜单栏
    _openUserCenter(flag) {
      this.openUserCenter = flag;
    },
    // 打开侧栏
    _openMenu() {
      this.openMenu = !this.openMenu;
    },
    // 窗口缩放
    _zoom() {
      this.zoom = !this.zoom;
    },
    // 取消修改
    canceledit() {
      this.modifyShow = false;
    },
    // 打开修改密码弹框
    onOpen() {
      this.pw.form["username"] = this.userName;
      this.pw.formItems[0]["value"] = this.userName;
    },
    handleCommand(command) {
      if (command == "modify") {
        this.modifyShow = true;
      }
    },
    handleChangeFormItem(val) {
      // 确认密码
      // if (val.newPassword && val.confirmPassword) {
      //   val.newPassword == val.confirmPassword
      //     ? (this.pw.same = true)
      //     : (this.pw.same = false);
      // }
    },
    // 确认修改
    async confirmModify() {
      this.$refs["modifyPassWord"].submitForm();
    },
    async _getPublicKey() {
      let res = await getPublicKey({});
      console.log(res);
      if (res.code == "200") {
        return res.data;
      }
    },
    _updatePassword(params) {
      updatePassword(params).then((res) => {
        if (res.code == "200") {
          this.$notify({
            title: "成功",
            message: "密码已修改，请重新登录",
            position: "bottom-right",
            type: 'success'
          });
          this._outUserLogin();
        }
      });
    },
    // 最后确认后调接口修改
    async checkPass(formData) {
      let publicKey = await this._getPublicKey();
      console.log(formData);
      let params = {
        confirmPassword: encrypt(formData.confirmPassword, publicKey),
        newPassword: encrypt(formData.confirmPassword, publicKey),
        oldPassword: encrypt(formData.oldPassword, publicKey),
        privateKey: publicKey,
      };
      this._updatePassword(params)
    },
    // 退出登录
    _outUserLogin() {
      this.userLoginOut()
        .then(() => {
          // Cookies.remove("username");
          // Cookies.remove("password");
          // Cookies.remove("rememberMe");
        })
        .catch((err) => {
          this.$notify.error({
            title: "失败",
            message: err,
            position: "bottom-right",
          });
        });
    },
    // tab当前关闭菜单方式
    closeType(type) {
      if (!this.menuTags.length) return;
      switch (type) {
        case "all": // 关闭全部
          this.set_openPage("indexPage");
          // 首页没有打开过缓存则在首页进行关闭操作
          if (this.keepAliveName.some((i) => i == "indexPage")) {
            this.set_menuTagsList([]);
            this.set_keepAliveRouter("indexPage");
          } else {
            this.set_closeAllTab(true);
            // 清空操作放在首页进行 (没有缓存下首页打开有需要时间,会有卡顿情况)
            this.set_menuTagsList([]);
            // this.set_keepAliveRouter('indexPage');
          }

          break;
        case "other": // 关闭其他
          if (
            this.menuTags.length === 1 &&
            this.menuTags[0].name === this.openPage
          ) {
            return;
          }
          for (let i = 0; i < this.menuTags.length; i++) {
            if (this.menuTags[i].name === this.openPage) {
              let a = this.menuTags.slice(i, i + 1);
              this.set_menuTagsList(a);
              return;
            }
          }
          break;
      }

      this.$router.push({
        name: this.openPage,
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goIndex() {
      this.$router.push({
        name: Config.homeName,
      });
    },
    changeMenuParent(item) {
      const children = item.children;
      this.set_menuTagsList([]);
      this.menuData = children;
      this.filtrKey = item.name;
      this.$router.push({
        name: `${children[0].children[0].name}`,
      });
    },
  },
  computed: {
    ...mapGetters(["menuList", "menuTags", "openPage", "keepAliveName"]),
    // menuParentList () {
    //   const parentList = this.menuList.filter(ls => ls.name.indexOf('admin') > -1);
    //   console.log('parentList', parentList);
    //   return parentList;
    // },
    // filtrKey () {
    //   console.log(this.$route)
    //   const filtrKey = 'admin';
    //   return filtrKey;
    // },
    // 左侧菜单列表
    // menuData () {
    //   const menuList = this.menuParentList.find(ls => ls.name === this.filtrKey);
    //   return menuList.children;
    // },
    // 当前打开的tags路由列表
    menuTagsData() {
      return this.menuTags;
    },
    // 当前选中的tage
    tageActive() {
      if (this.openPage === Config.homeName) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$router.push(
          Config.homeName,
          () => {},
          () => {}
        );
      }
      return this.openPage;
    },
    userName() {
      return this.$store.state.user.username;
    },
    // 菜单标题
    // currentTitleList () {
    //   let currentTitleList = []; // 当前路由标题列表
    //   this.currentRouteName = this.$route.name;
    //   this.$route.matched.map(item => {
    //     currentTitleList.push({
    //       name: item.name,
    //       title: item.meta.title
    //     });
    //   });
    //   return currentTitleList;
    // },
    contentPaddingBottom() {
      const { name: routeName, query } = this.$route;
      if (
        ["landTradeConfig"].includes(routeName) &&
        ["add", "edit"].includes(query.configType)
      ) {
        return "90px";
      }
      return "0";
    },
  },
  components: {
    Tabs,
    adminSideMenu,
    Flex,
    scrollView,
    dialogCont,
    FormItem,
  },
};
</script>

<style lang="less">
</style>


<style lang="less">
@import "./main.less";
#adminContent {
  // position: relative;
  .pageTitle {
    margin: 10px 0px 0px 20px; /*no*/
    padding-bottom: 10px; /*no*/
    border-bottom: 1px solid #dddddd; /*no*/
    font-size: 16px; /*no*/
  }
  .back {
    margin: 10px 0px 10px 20px; /*no*/
  }
  .mainContent {
    padding: 20px; /*no*/
    height: calc(100vh - 130px); /*no*/
    // min-width: 1366px;
    // overflow: auto;
    background: #e5e7ec;
    // margin: 20px;
    padding: 20px; /*no*/
    margin-top: 20px; /*no*/
    padding-top: 0;
    box-sizing: border-box;
    > .comp-page-table {
      padding: 0 20px; /*no*/
      background: #fff;
    }
  }

  .noteBox {
    border: 0;
    width: 100%;
  }

  .transformRotate {
  }
  .icon-tuichu {
    width: 20px; /*no*/
  }

  .dialog-bg {
    z-index: 1000;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>



