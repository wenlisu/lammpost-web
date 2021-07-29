<template>
  <div>
    <svg width="282" height="244" viewBox="0 0 282 244" class="side_Path2"></svg>
    <div class="ball"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.ball {
  position: absolute;
  top: 0%;
  left: -2%;
  width: 30px;
  height: 7px;
  background: url("../../images/line.png") no-repeat;
  background-size: 100% 100%;
  transform: translate(-18px, -5px);
  offset-path: path("m277.5,3c0,0 -99,62 -99,62c0,0 1,62 1,62c0,0 -180,108 -180,108");
  offset-distance: 0%;
  animation: ball 5s linear 0s infinite;
}
.side_Path2 {
  background-image: url("../../images/lj3.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
.lj1 {
  width: 282px;
  height: 244px;

  /* img {
    width: 100%;
    height: 100%;
  } */
}
</style>