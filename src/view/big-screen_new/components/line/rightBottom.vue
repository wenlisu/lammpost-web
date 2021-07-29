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
  top: 3%;
  left: 2%;
  width: 30px;
  height: 7px;
  background: url("../../images/line.png") no-repeat;
  background-size: 100% 100%;
  transform: translate(-18px, -5px);
  offset-path: path("m259.5,235c0,0 -104,-62 -104.5,-62c0.5,0 -0.5,-62 -0.5,-62c0,0 -143,-93 -143.5,-93");
  offset-distance: 0%;
  animation: ball 5s linear 0s infinite;
}
.side_Path1 {
  background-image: url("../../images/lj4.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>