<template>
  <div id="radioType" class="flexRow flexCenter" :class="className">
    <div class="flexRow flexCenter main">
      <img :src="types[type].icon"/>
      {{text || types[type].text}}
    </div>
  </div>
</template>

<script>
import onLine from 'common/images/index/onLine.png';
import fault from 'common/images/index/radioFault.png';
import off from 'common/images/index/OFF.png';

const types = {
  1: {
    icon: onLine,
    text: 'ON'
  },
  2: {
    icon: fault,
    text: 'FAULT'
  },
  3: {
    icon: off,
    text: 'OFF'
  }
}
export default {
  name: 'radioType',
  data () {
    return {
      types
    };
  },
  props: {
    type: [Number, String],
    text: String,
    className: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
#radioType{
  font-size:12px;/*no*/
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  // color:rgba(255,255,255,1);
  .main{
    width: 65px;
    justify-content: flex-start;
    img{
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
  }
  &.adminRadioType {
    color: #555660;
    font-family: 'Microsoft YaHei', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
  }
}
</style>
