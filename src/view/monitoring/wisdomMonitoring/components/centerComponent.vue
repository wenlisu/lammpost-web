<template>
  <div>
    <ul class="node">
      <li>
        <i>
          <img src="../images/start.png" alt="" />
        </i>
        <p>开启</p>
      </li>
      <li>
        <i>
          <img src="../images/end.png" alt="" />
        </i>
        <p>关闭</p>
      </li>
    </ul>
  </div>
</template>

<script>
import partTitle from "../../../index/components/commonTitle";
import * as echarts from "echarts"; // 引入echarts
export default {
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {});
  },
  components: {
    partTitle
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.node {
  position: absolute;
  bottom: 20px;
  left: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  li {
    display: flex;
    align-items: center;
    margin-right: 20px;
    i {
      display: inline-block;
      width: 42px;
      height: 27px;
      margin-right: 10px;
      img {
        max-width: 100%;
      }
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 20px;
      letter-spacing: 0px;
    }
  }
}
.center_bg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  // width: calc(100% - 1180px);
  width: 820px;
  height: 250px;
  padding: 20px;
  background: url("../images/c_bg.png") center center no-repeat;
  background-size: 100% 100%;
  .centerLine {
    width: 100%;
    height: 180px;
  }
}
</style>
