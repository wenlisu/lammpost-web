<template>
  <div id="headerTitle" class="pos-r">
      <!-- 需要显示的的隐藏内容插槽 -->
      <slot name="searchBox" ref="searchBox"></slot>
  </div>
</template>

<script>
export default {
  props: {
    titleBtn: {
      type: String,
      default: '新增'
    },
    search: {
      type: Boolean,
      default: true
    },
    // 添加按钮显示
    addBtnVisible: {
      type: Boolean,
      default: false
    },
    // 是否显示查询按钮
    otherBtnVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchName: '查询', // 查询按钮显示文字
      slideSearchBox: false, // 查询列表是否隐藏
      searchActiveClass: false // 查询按钮选中样式
    };
  },
  methods: {
    // 显示隐藏收缩列表
    // slideSearch() {
    //   this.slideSearchBox = !this.slideSearchBox;
    //   this.searchActiveClass = this.slideSearchBox ? true : false;
    //   this.searchName = this.slideSearchBox ? "隐藏" : "查询";
    // },
    // 点击查询
    // searchBtn() {
    //   this.$emit("on-search", true);
    // },
    // 点击重置
    // resetBtn() {
    //   this.$_resestSearchModel(this.$refs.searchBox);
    //   this.$emit("on-resetBtn", true);
    // },
    // 点击新增按钮
    addBtn () {
      this.$emit('on-addBtn', true);
    }
  }
};
</script>

<style lang="less">
#headerTitle {
  display: flex;
  padding: 20px 20px 10px;
  position: relative;
  &::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;/*no*/
    background:rgba(43,126,242,1);
    border-radius:1px;/*no*/
  }
  .el-button.default.active {
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  .btnInfo {
    min-width: 100px;
    margin-top: 1px;/*no*/
  }
}
</style>

<style lang="less" scoped>
#headerTitle {
  margin-bottom: 10px;/*no*/
  background:rgba(32,45,85, 0.49);
  border-radius:4px;
  .search{
    right: 0;
    top: 0;
    &.hasbtnList{
      border-right: 1px solid rgba(217,217,217,0.5);;
    padding-right: 20px;
    }

  }

  .searchBox{}
  .btnList {
    background-color: #d1e9ff;
    border: 1px solid #b7ddff;
    border-radius: 2px;
    margin-bottom: 5px;
    font-size: 14px;
    color: #1890FF;
    min-width: 75px;
    padding: 9px 14px 9px 8px;
    cursor: pointer;
    &:last-child{margin-bottom: 0}
    i{margin-right: 8px}
    &.addBtn{
      i.add-icon{vertical-align: middle;width: 25px;height: 25px;background:#1890FF;border-radius: 50%;color: #fff;text-align: center;line-height: 25px; }
    }
  }
}
</style>
