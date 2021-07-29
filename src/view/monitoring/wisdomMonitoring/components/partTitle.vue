<template>
  <div class="partTitle">
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["title"]
};
</script>

<style lang="less" scoped>
.partTitle {
  position: relative;
  width: 100%;
  height: 44px;
  // opacity: 0.32;
  background: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #2c5b94);
  border-bottom: 3px solid;
  border-image: -webkit-linear-gradient(
    270deg,
    rgba(32, 45, 85, 0.2),
    #108dff 98%
  );
  border-image: -moz-linear-gradient(
    270deg,
    rgba(32, 45, 85, 0.2),
    #108dff 98%
  );
  border-image: linear-gradient(270deg, rgba(32, 45, 85, 0.2), #108dff 98%);
  &::before {
    position: absolute;
    top: 2px;
    display: inline-block;
    content: "";
    width: 4px;
    height: 100%;
    background: #28deff;
  }
  p {
    padding-left: 20px;
    font-size: 28px;
    font-family: YouSheBiaoTiHei;
    text-align: left;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 0px 2px 4px 0px #1c4696;
  }
}
</style>