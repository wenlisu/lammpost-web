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
  left: 2%;
  width: 30px;
  height: 7px;
  background: url("../../images/line.png") no-repeat;
  background-size: 100% 100%;
  transform: translate(-18px, -5px);
  offset-path: path("m9.5,242c0,0 98,-59 98,-59c0,0 -1,-71 -1,-71c0,0 175,-110 175,-110");
  offset-distance: 0%;
  animation: ball 5s linear 0s infinite;
}
.side_Path1 {
  background-image: url("../../images/lj2.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>