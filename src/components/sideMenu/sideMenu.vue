<template>
  <div class="sideMenu">
    <scrollView>
      <el-menu
        class="el-menu-vertical"
        :collapse="openMenu"
        background-color="#141F40"
        text-color="#7383B2"
        active-text-color="#fff"
        :default-active="defaultActive"
        :default-openeds="['lightPoleMap']"
        mode="horizontal"
      >
        <el-menu-item
          :index="itemPar.name"
          v-for="(itemPar, index) in menuData"
          :key="itemPar.name"
          v-if="!itemPar.children && itemPar.meta.address === 'before'"
          @click="activeTage(itemPar)"
          >{{ itemPar.meta.title }}</el-menu-item
        >
        <el-submenu
          :index="itemPar.name"
          v-for="(itemPar, index) in menuData"
          :key="itemPar.name"
          :popper-class="`slidePoperItem`"
          v-if="itemPar.children && itemPar.children.length > 0"
        >
          <template slot="title">
            <i :class="itemPar.icon"></i>
            <span slot="title">{{ itemPar.meta.title }}</span>
          </template>
          <!-- 二级 -->
          <el-menu-item
            @click="activeTage(itemSon)"
            v-if="
              itemPar.children &&
              itemPar.children.length > 0 &&
              (!itemSon.children || itemSon.children.length <= 0)
            "
            v-for="itemSon in itemPar.children"
            :key="itemSon.name"
            :index="itemSon.name"
            class="menuItem"
          >
            <i :class="itemSon.icon"></i>
            <span slot="title">{{ itemSon.meta.title }}</span>
          </el-menu-item>
          <!-- 三级 -->
          <el-submenu
            v-if="
              itemPar.children &&
              itemPar.children.length > 0 &&
              itemSon.children &&
              itemSon.children.length >= 1
            "
            v-for="itemSon in itemPar.children"
            :key="itemSon.name"
            :index="itemSon.name"
          >
            <span slot="title">
              <i class="pos-r" :class="itemSon.icon" style="top: -2px"></i>
              {{ itemSon.meta.title }}
            </span>
            <el-menu-item
              @click="activeTage(itemSonSub)"
              :index="itemSonSub.name"
              v-for="itemSonSub in itemSon.children"
              :key="itemSonSub.name"
            >
              <i :class="itemSonSub.icon"></i>
              <span slot="title">{{ itemSonSub.meta.title }}</span>
            </el-menu-item>
            <!-- 四级 -->
            <el-submenu
              v-if="false"
              v-for="itemSon in itemPar.children"
              :key="itemSon.name"
              :index="itemSon.name"
            >
              <span slot="title">
                <i class="pos-r" :class="itemSon.icon" style="top: -2px"></i>
                {{ itemSon.meta.title }}
              </span>
              <el-menu-item
                @click="activeTage(itemSonSub)"
                :index="itemSonSub.name"
                v-for="itemSonSub in itemSonSub.children"
                :key="itemSonSub.name"
              >
                <i :class="itemSonSub.icon"></i>
                <span slot="title">{{ itemSonSub.meta.title }}</span>
              </el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-submenu>
        <el-menu-item
          :index="itemPar.name"
          v-for="(itemPar, index) in menuData"
          :key="itemPar.name"
          v-if="!itemPar.children && itemPar.meta.address === 'after'"
          @click="activeTage(itemPar)"
          >{{ itemPar.meta.title }}
        </el-menu-item>
      </el-menu>
    </scrollView>
  </div>
</template>

<script>
import scrollView from "./scrollView";
export default {
  data() {
    return {
      title: "", // 当前选中菜单的title名
    };
  },
  components: {
    scrollView,
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultActive: {
      type: String,
      default: "lightPole",
    },
    openMenu: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log("menuData", this.menuData);
    });
  },
  methods: {
    // 左侧菜单激活时候
    activeTage(item) {
      this.$emit("on-select", {
        ...item.meta,
        name: item.name,
        title: item.meta.title,
        icon: item.icon,
      });
    },
  },
};
</script>

<style lang="less">
// /deep/.el-menu--horizontal>.el-menu-item {
//   float: none;
// }
.sideMenu {
  width: 100%;
  // position: fixed;
  // bottom: 0;
  // top: 59px;
  // width: 220px;
  // bottom: 0;
  background: transparent;
  // overflow: hidden;
  // 滚动条
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 2px;
    height: 2px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: transparent;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }
  .el-menu-vertical {
    width: 100%;
    border-bottom: none !important;
  }

  .el-menu-item.is-active {
    border: none;
    color: rgb(115, 131, 178) !important;
    i {
      color: #fff !important;
    }
  }

  .el-submenu > .el-submenu__title {
    height: 80px !important;
    line-height: 80px !important;
    border: none !important;
  }
  /deep/.el-menu--horizontal > .el-menu-item,
  .el-menu--horizontal > .el-submenu {
    float: none !important;
    display: inline-block !important;
  }
}
.sideMenu {
  ul.el-menu {
    > li {
      float: none;
      height: 80px;
      line-height: 80px;
      display: inline-block;
    }
  }
  .el-menu--vertical {
    .el-menu-item.is-active {
      // background-color: #1890ff !important;
      // border-right: 2px solid #1890ff;
      i {
        color: rgb(204, 204, 204) !important;
      }
    }
  }

  .el-menu-item,
  .el-submenu__title {
    font-size: 16px !important; /*no*/
    color: #7383b2;
    padding: 0 15px !important;
    border-bottom: 0 !important;
    i.iconfont {
      color: #7383b2 !important;
      font-size: 14px; /*no*/
    }
    i.el-submenu__icon-arrow {
      color: #7383b2;
      font-size: 8px; /*no*/
      font-weight: bold;
      margin-top: 2px !important; /*no*/
    }
    &:hover {
      color: #fff !important;
      i {
        color: #fff !important;
      }
    }
  }

  // @media screen and (max-width: 1500px) {
  //   .el-menu-item, .el-submenu__title {
  //       font-size: 14px !important;/*no*/
  //    }
  // }
  .el-submenu.is-active .el-submenu__title {
    position: relative;
    color: #fff;
    background-color: #273661 !important;
    // &::after{
    //   content: '';
    //   height:3px;
    //   background:linear-gradient(276deg,rgba(37,168,203,1) 0%,rgba(88,160,255,1) 100%);
    //   border-radius:4px;
    //   position: absolute;
    //   bottom: 0;
    //   left: 20px;/*no*/
    //   right: 20px;/*no*/
    // }
    i {
      color: #fff !important;
    }
  }
}
.slidePoperItem {
  // display: flex !important;
  .el-menu--popup {
    min-width: 160px; /*no*/
    background: #273661 !important;
    padding: 0px;
    // &::before{
    //   content: none;
    // }
    .el-menu-item,
    .el-submenu {
      min-width: 160px; /*no*/
      background: #273661 !important;
      position: relative;
      padding-left: 25px !important; /*no*/
      &::after {
        content: "";
        width: 4px; /*no*/
        height: 4px; /*no*/
        background: #7b91d4;
        position: absolute;
        top: 50%;
        left: 10px; /*no*/
        transform: translateY(-50%);
      }
      .el-submenu__title {
        background: #273661 !important;
        padding-left: 0;
        i.el-submenu__icon-arrow {
          color: rgb(115, 131, 178);
        }
      }
      &.is-active,
      &:hover {
        background: #354778 !important;
        &::after {
          background: #fff;
        }
        .el-submenu__title {
          background: #354778 !important;
          i {
            color: #f6f8ff;
          }
        }
      }
      .el-menu--horizontal {
        .el-menu--popup {
          margin-left: 1px !important; /*no*/
          li {
            background: #354778 !important;
            color: #ffffff !important;
            &::after {
              content: none;
            }
            &:hover {
              background: #273661 !important;
            }
            &.is-active {
              background: #273661 !important;
            }
          }
        }
      }
    }
  }
  &:last-child {
    .el-menu--popup {
      .el-submenu {
        .el-menu--horizontal {
          left: auto !important;
          right: 160px; /*no*/
        }
      }
    }
  }
}
</style>

