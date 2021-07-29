<template>
  <div class="adminSideMenu">
    <el-menu
      class="el-menu-vertical"
      :collapse="openMenu"
      background-color="#FFF"
      text-color="#333"
      active-text-color="#5189FF"
      :default-active="defaultActive"
      unique-opened
    >
      <!-- <el-menu-item
        @click="activeTage(itemSon)"
        v-if="!itemPar.children"
        :key="itemPar.name"
        :index="itemPar.name"
        class="menuItem"
      >
        <i :class="itemPar.icon"></i>
        <span slot="title">{{ itemPar.meta.title }}</span>
      </el-menu-item> -->
      <el-submenu
        :index="itemPar.name"
        v-for="(itemPar, index) in menuData"
        :key="itemPar.name"
      >
        <template slot="title">
          <i :class="itemPar.icon"></i>
          <span slot="title">{{ itemPar.meta.title }}</span>
        </template>
        <!-- 二级 -->
        <el-menu-item
          @click="activeTage(itemSon)"
          v-if="
            (itemPar.children &&
              itemPar.children.length > 0 &&
              (!itemSon.children || itemSon.children.length <= 0)) ||
            itemSon.children[0].meta.hidden
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
            itemSon.children.length >= 1 &&
            !itemSon.children[0].meta.hidden
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
            v-if="
              itemSon.children &&
              itemSon.children.length > 0 &&
              (!itemSonSub.children ||
                itemSonSub.children.length <= 0 ||
                (itemSonSub.children.length > 0 &&
                  itemSonSub.children[0].meta.hidden))
            "
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
            v-if="
              itemSon.children &&
              itemSon.children.length > 0 &&
              itemSun.children &&
              itemSun.children.length >= 1 &&
              !itemSun.children[0].meta.hidden
            "
            v-for="itemSun in itemSon.children"
            :key="itemSun.name"
            :index="itemSun.name"
          >
            <span slot="title">
              <i class="pos-r" :class="itemSun.icon" style="top: -2px"></i>
              {{ itemSun.meta.title }}
            </span>
            <el-menu-item
              v-if="
                itemSun.children &&
                itemSun.children.length > 0 &&
                (!itemSunSub.children || itemSunSub.children.length <= 0) &&
                !itemSunSub.meta.hidden
              "
              @click="activeTage(itemSunSub)"
              :index="itemSunSub.name"
              v-for="itemSunSub in itemSun.children"
              :key="itemSunSub.name"
            >
              <i :class="itemSunSub.icon"></i>
              <span slot="title">{{ itemSunSub.meta.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "", // 当前选中菜单的title名
    };
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
      default: "",
    },
    openMenu: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    menuData(val) {},
  },
  methods: {
    // 左侧菜单激活时候
    activeTage(item) {
      this.$emit("on-select", {
        name: item.name,
        title: item.meta.title,
        icon: item.icon,
      });
    },
  },
};
</script>

<style lang="less">
.adminSideMenu {
  // position: fixed;
  // bottom: 0;
  // top: 59px;
  // width: 220px;
  // bottom: 0;
  background: #ffffff;

  // 滚动条
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 2px; /*no*/
    height: 2px; /*no*/
    border-radius: 10px; /*no*/
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: transparent;
    background-clip: padding-box;
    min-height: 28px; /*no*/
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }
  .el-menu-vertical {
    width: 100%;
    border: 0;
    // padding-bottom: 50px;
  }

  .el-menu-item.is-active {
    background-color: #0d1831 !important;
    // border-right: 2px solid #2573F1;
    i {
      color: rgba(81, 137, 255, 1) !important;
    }
    span {
      color: rgba(81, 137, 255, 1) !important;
    }
  }

  .el-submenu {
    &.is-active {
      > .el-submenu__title,
      ul > li {
        background-color: #fff !important;
        &.is-active {
          background-color: #f0f5ff !important;
          position: relative;
        }
        &.is-active:not(.is-opened)::after {
          content: "";
          width: 4px; /*no*/
          height: 50px; /*no*/
          right: 0;
          bottom: 0;
          background: #2573f1;
          position: absolute;
        }
      }
    }
    > .el-submenu__title {
      height: 56px; /*no*/
      line-height: 56px; /*no*/
    }
  }

  .el-menu--vertical {
    .el-menu-item.is-active {
      background-color: #0d1831 !important;
      // border-right: 2px solid #2573F1;
      i {
        color: #333 !important;
      }
    }
  }

  .el-menu-item,
  .el-submenu__title {
    height: 46px; /*no*/
    line-height: 46px; /*no*/
    font-size: 16px; /*no*/
    i {
      color: #333;
    }
    i.el-submenu__icon-arrow {
      margin-top: -4px; /*no*/
      color: #909399;
    }
    &:hover {
      // background-color: #2573F1 !important;
      // box-shadow: 0px 0px 11px 2px #f5f5f5;
      color: #333 !important;
      i {
        color: #333 !important;
      }
    }
  }

  .el-menu--collapse
    li[role="menuitem"].el-submenu.is-active
    .el-submenu__title {
    i {
      color: #fff !important;
    }
    background-color: #2573f1 !important;
  }
}
.adminSideMenu {
  .el-menu--inline .el-submenu__title,
  .el-menu-item {
    font-size: 14px !important; /*no*/
    height: 50px; /*no*/
  }
}
</style>

