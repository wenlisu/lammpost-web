<template>
  <div class="container">
    <div class="dot">
      <img src="../../images/wifi_1.png" alt="" />
    </div>
    <div class="pulse"></div>
    <div class="pulse1"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
@keyframes warn {
  0% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.5;
  }

  50% {
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0.7;
  }

  75% {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes warn1 {
  0% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.1;
  }

  50% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.3;
  }

  75% {
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0.5;
  }

  100% {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 0;
  }
}

.container {
  position: relative;
  width: 120px;
  height: 120px;
  // left: 10px;
  // top: 10px;
}
/* 中间保持大小不变的图片 */
.dot {
  position: absolute;
  width: 57px;
  height: 52px;
  // left: 139px;
  // top: 105px;
  z-index: 2;
  transform: translate(5px, -30px);
}
/* 向外扩散变大的圆圈 第一个圆 */
.pulse {
  position: absolute;
  width: 67px;
  height: 39px;
  // left: 120px;
  // top: 120px;
  background: radial-gradient(
    rgba(26, 174, 255, 0),
    rgba(10, 124, 189, 0),
    rgba(0, 150, 238, 0.25)
  );
  border: 1px solid #2cc7ff;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn 2s linear;
  -moz-animation: warn 2s linear;
  animation: warn 2s linear;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  // box-shadow: 1px 1px 30px #3399ff; /* 阴影效果 */
}
/* 向外扩散变大的圆圈 第二个圆 */
.pulse1 {
  position: absolute;
  width: 67px;
  height: 39px;
  // left: 120px;
  // top: 120px;
  background: radial-gradient(
    rgba(26, 174, 255, 0),
    rgba(10, 124, 189, 0),
    rgba(0, 150, 238, 0.25)
  );
  border: 1px solid #2cc7ff;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn1 2s linear;
  -moz-animation: warn1 2s linear;
  animation: warn1 2s linear;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  // box-shadow: 1px 1px 30px #3399ff; /* 阴影效果 */
}
</style>