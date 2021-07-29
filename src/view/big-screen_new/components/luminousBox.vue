<!-- 中间列表数据框 -->
<template>
  <div
    class="flexRow spaceBetween animated infinite luminousBoxFlow luminousBox"
  >
    <span class="title"> {{ title }}</span>
    <span class="value"
      >{{ value }}<span class="unit">{{ unit }}</span></span
    >
  </div>
</template>
<script>
export default {
  name: "luminousBox",
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    unit: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.luminousBox {
  display: flex;
  align-items: center;
  min-width: 232px;
  height: 35px;
  padding: 6px 0 6px 17px;
  opacity: 1;
  background: linear-gradient(
    270deg,
    rgba(36, 60, 114, 0),
    rgba(19, 83, 134, 0.72) 80%,
    rgba(74, 111, 170, 0)
  );
  border: 1px solid;
  border-image: linear-gradient(
      270deg,
      rgba(81, 217, 250, 0),
      #28b1f2 79%,
      rgba(40, 177, 242, 0)
    )
    1 1;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(105, 239, 255, 0),
      #69efff 56%,
      rgba(56, 218, 255, 0)
    );
  }
  .title {
    font-size: 16px;
    font-family: PingFangSC;
    font-weight: 600;
    text-align: left;
    color: #d1ecff;
    line-height: 22px;
    letter-spacing: 1px;
  }
  .value {
    font-size: 20px;
    font-family: PingFangSC;
    font-weight: 600;
    text-align: right;
    color: #ffffff;
    line-height: 28px;
    .unit {
      font-size: 14px;
      font-family: PingFangSC;
      margin-left: 5px;
    }
  }
}
</style>
