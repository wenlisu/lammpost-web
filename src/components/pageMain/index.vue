<template>
  <div :class="className" :id="idName">
    <div id="pageMain">
      <el-breadcrumb separator="/" v-if="breadShow">
        <el-breadcrumb-item
          v-for="(item, index) in currentTitleLists"
          :key="index"
          :to="index !== currentTitleLists.length - 1 && { name: item.name }"
          replace
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import img2 from "./images/img2.png";
export default {
  name: "pageMain",
  data() {
    return {
      img2: img2,
      currentTitleLists: this.currentTitleList,
    };
  },
  props: {
    idName: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
    breadShow: {
      type: Boolean,
      default: true,
    },
    currentTitleList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {},
  },
  watch: {
    currentTitleList(val) {
      this.currentTitleLists = val;
    },
  },
};
</script>

<style lang="less" scoped>
#pageMain {
  height: 100%;
  .el-breadcrumb {
    background: #0c0f1a;
    padding: 0 10px 10px; /*no*/
    /deep/.el-breadcrumb__item {
      span {
        color: #fff !important;
        font-size: 12px; /*no*/
      }
    }
  }
}
</style>
