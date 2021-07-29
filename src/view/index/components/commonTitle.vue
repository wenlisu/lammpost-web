<template>
  <div class="common-box">
    <span class="txt">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
};
</script>

<style scoped lang="less">
.common-box {
  width: 100%;
  background: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #2c5b94);
  padding-left: 24px;
  padding-bottom: 10px;
  border-left: 4px solid #28deff;
  padding-top: 5px;
  position: relative;
  display: flex;
  justify-content: space-between;
  &::after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 1px;
    background: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #108dff 98%);
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .txt {
    font-size: 28px;
    font-family: YouSheBiaoTiHei;
    text-align: left;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 0px 2px 4px 0px #1c4696;
  }
}
</style>