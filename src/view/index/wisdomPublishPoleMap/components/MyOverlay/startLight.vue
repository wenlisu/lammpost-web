<template>
  <div class="container">
    <div class="dot">
      <img src="../../images/led-on.png" alt="" />
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
  width: 30%;
  height: 30%;
  left: -5%;
  top: -25%;
  z-index: 2;
  // transform: translate(19px, -15px);
}
/* 向外扩散变大的圆圈 第一个圆 */
.pulse {
  position: absolute;
  width: 30%;
  height: 15%;
  left: -8%;
  top: -7%;
  // background: radial-gradient(
  //   rgba(26, 174, 255, 0),
  //   rgba(10, 124, 189, 0),
  //   #0096ee
  // );
  // border: 2px solid #2cc7ff;
  background: radial-gradient(
    rgba(253, 157, 32, 0),
    rgba(253, 157, 32, 0),
    rgba(253, 157, 32, 0),
    #d0881a
  );
  border: 1px solid #d08719;
  border-radius: 50%;
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
  width: 30%;
  height: 15%;
  left: -8%;
  top: -7%;
  background: radial-gradient(
    rgba(253, 157, 32, 0),
    rgba(253, 157, 32, 0),
    #d28816
  );
  border: 2px solid #d28816;
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