<template>
  <div>
    <svg width="282" height="244" viewBox="0 0 282 244" class="side_Path1"></svg>
    <div class="ball"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.ball {
  position: absolute;
  top: 1%;
  left: -1%;
  width: 30px;
  height: 7px;
  background: url("../../images/line.png") no-repeat;
  background-size: 100% 100%;
  transform: translate(-18px, -5px);
  offset-path: path("m19.5,15c0,0 86,51 86,51c0,0 0,64 0,64c0,0 141,82 141,82");
  offset-distance: 0%;
  animation: ball 5s linear 0s infinite;
}
.side_Path1 {
  background-image: url("../../images/lj1.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>