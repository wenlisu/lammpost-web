<template>
  <div id="mainContent" class="h1">
    <div class="topMean cl">
      <div class="flexRow logo f-l" @click="goBigScreen">
        <div class="flexCenter img">
          <img src="~common/images/logo2.png" alt="中国联通" />
        </div>
        城市基础设施管理平台
      </div>
      <div class="cont-left f-l">
        <SideMenu
          :openMenu="openMenu"
          :default-active="tageActive"
          :menuData="menuData"
          @on-select="openMenuSelect"
        ></SideMenu>
      </div>
      <div class="icon-left f-l" v-if="false">
        <i
          class="iconfont icon-zhankaicaidan f-20"
          @click="_openMenu"
          :title="openMenu ? '展开' : '收起'"
        ></i>
        <i class="el-icon-refresh f-20" @click="_refreshPage" title="刷新"></i>
      </div>
      <div class="icon-right f-r mr-10">
        <div class="flexRow h-handler">
          <el-select v-model="optionValue" placeholder="请选择" @change="handleOptionChange">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="item.relationName"
              :value="item.code">
            </el-option>
          </el-select>
          <el-button type="text" class="quit-button" @click="_outUserLogin">
            <i class="iconfont icon-tuichu"></i>
            退出</el-button
          >
        </div>
        <!-- <div class="flexCenter dateTime">
          {{time}}
        </div> -->
        <div
          class="userCenter innBlock pos-r"
          @mouseover="_openUserCenter(true)"
          @mouseout="_openUserCenter(false)"
          v-if="false"
        >
          <transition name="fadeInUp">
            <ul class="showUserCenter pos-a f-14" v-if="openUserCenter">
              <!-- <li><router-link to="" tag="div"><i class="iconfont icon-iconfontgerenzhongxin"></i>个人中心</router-link></li>-->
              <li
                @click="
                  openMenuSelect({
                    icon: 'iconfont icon-mimaffffffpx',
                    name: 'updatePassword',
                    title: '修改密码',
                  })
                "
              >
                <i class="iconfont icon-mimaffffffpx"></i>修改密码
              </li>
              <li class="divider"></li>
              <li @click="_outUserLogin()">
                <i class="iconfont icon-tuichu"></i>退出登录
              </li>
            </ul>
          </transition>
          <div class="user-img mr-10 innBlock">
            <i class="iconfont icon-iconfontgerenzhongxin f-20"></i>
          </div>
          <span class="f-16 innBlock" style="color: #333">您好，</span>
          <span class="f-16 innBlock" style="color: #333">
            <span
              class="innBlock text-overflow"
              :title="userName"
              style="min-width: 38px; max-width: 100"
              >{{ userName }}</span
            >
            <i
              class="el-icon-arrow-down f-14 f-w"
              style="margin-left: 20px; color: #2e3033"
            ></i>
          </span>
        </div>
      </div>
    </div>

    <div class="cont-right pos-a">
      <tabs
        @close-type="closeType"
        :menuTagsData="menuTagsData"
        @delTage="delTage"
        @on-select="_tageActive"
        :defaultTage="tageActive"
        v-if="false"
      ></tabs>
      <keep-alive :include="keepAliveName" :max="8">
        <router-view ref="keepAlive229" class="mainContent"></router-view>
      </keep-alive>
    </div>

    <!-- loading -->
    <div class="loading-bg" v-if="$_loadingCont"></div>
    <div class="loading noselect pos-f" v-if="$_loadingCont">
      <i
        class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"
      ></i>
      <span class="f-13">正在加载，请稍后...</span>
    </div>

    <!-- 便签 -->
    <!-- <dialog-cont
      @on-cancel="dialog.note=false"
      width="300px"
      title="便签"
      :sureVisible="false"
      :cancelVisible="false"
      :visible="dialog.note"
    >
      <textarea
        class="noteBox f-13"
        style="width:100%;max-width:100%;border:0;outline: none;max-height:100%;height:135px;color:#333"
        v-model="dialog.content"
      ></textarea>
    </dialog-cont> -->
  </div>
</template>

<script>
import moment from "moment";
import Tabs from "components/tabs/tabs";
import SideMenu from "components/sideMenu/sideMenu";
import Config from "@/config";
import Cookies from "js-cookie";
import {
  getProjectByUser
} from 'api/user';
// import dialogCont from 'components/dialog';
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "mainContent",
  data() {
    return {
      dialog: {
        note: false, // 便签
        content: "", // 便签内容
      },
      menuActiveClass: false, // 当前被选中菜单
      menuBdWidth: "0px", // 右侧宽度
      openMenu: false, // logo
      zoom: false, // 是否全屏
      openUserCenter: false, // 个人头像下的菜单栏
      time: "",
      timer: null,
      optionValue: undefined,
      options: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.options = this.appCodes.appCodes;
      this.optionValue = this.appCodes.appCode;
      this.timer = setInterval(this.changeTime, 1000);
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
      "set_common",
      'set_appCodes'
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
      if (list.target && list.href) {
        window.open(list.href, "_blank");
        return;
      }
      if (list.name !== "lotAdmin" && list.name !== "toiltAppMap" && list.name !== 'wisdomAppParkReport' && list.name !== 'smokeAppMap') {
        this.$router.push({
          name: list.name,
        });
      } else {
        let pageName = list.name == 'lotAdmin' ? 'equipmentAccess' : list.name
        let routeUrl = this.$router.resolve({
          name: pageName,
        });
        window.open(routeUrl.href, "_blank");
        // this.$router.push({
        //   name: 'equipmentAccess'
        // });
      }
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
            // 清空操作放在首页进行 (没有缓存下首页打开有需要时间,会有卡顿情况)
            this.set_closeAllTab(true);
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
    changeTime() {
      const myDate = new Date();
      const weekend = myDate.getDay();
      const weeks = new Array(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      );
      const day = weeks[weekend];
      const timeDay = `${moment().format("YYYY年MM月DD日 HH:mm:ss")}`;
      this.time = `${timeDay} ${day}`;
      this.set_common({
        time: `${moment().format("HH:mm:ss")}`,
        timeDay,
      });
    },
    goBigScreen() {
      this.$router.push({
        name: Config.homeName,
      });
    },
    handleOptionChange (val) {
      this.optionValue = val;
      this.set_appCodes({
        appCodes: this.appCodes.appCodes,
        appCode: val
      });
      window.location.reload();
    }
  },
  computed: {
    ...mapGetters([
      "menuList",
      "menuTags",
      "openPage",
      "keepAliveName",
      "loadingCont",
      'appCodes'
    ]),
    // 左侧菜单列表
    menuData() {
      const menuList = this.menuList.filter(
        (ls) => ls.name.indexOf("admin") === -1
      );
      console.log('menuList', menuList)
      return menuList;
    },
    // 当前打开的tags路由列表
    menuTagsData() {
      return this.menuTags;
    },
    // 当前选中的tage
    tageActive() {
      if (this.openPage === Config.homeName) {
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
    $_loadingCont() {
      return this.loadingCont;
    },
  },
  components: {
    Tabs,
    SideMenu,
    // dialogCont
  },
  beforeDestroy() {
    this.timer = null;
    clearInterval(this.timer);
  },
};
</script>

<style lang="less">
</style>


<style lang="less" scoped>
@import "./main.less";
#mainContent {
  .mainContent {
    width: 100%;
    // border-left: 1px solid #e1e1e1;
    height: calc(100vh - 80px);
    overflow-y: auto;
    background: #0c0f1a;
    padding: 10px; /*no*/
    // padding-top: 0;
    &::-webkit-scrollbar {
      width: 3px; /*no*/
    }
        &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
      background: #4a5b8f;
    }
        &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2); /*no*/
      border-radius: 0;
      background: transparent;
    }
  }

  .noteBox {
    border: 0;
    width: 100%;
  }

  .transformRotate {
  }
}
</style>



