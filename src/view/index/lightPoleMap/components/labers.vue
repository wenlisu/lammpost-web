<template>
  <div id="lightLabers" class="flexRow labers">
    <div>
      <img :src="light" :style="styles"/>
      {{lightText}}
    </div>
    <div>
      <img :src="bad" :style="styles"/>
      {{badText}}
    </div>
    <div>
      <img :src="close" :style="styles"/>
      {{closeText}}
    </div>
  </div>
</template>

<script>
import light from '@/common/images/markers/lamp1.png';
import bad from '@/common/images/markers/lamp2.png';
import close from '@/common/images/markers/lamp3.png';
export default {
  name: 'lightLabers',
  data () {
    return {
    };
  },
  props: {
    light: {
      type: String,
      default: light
    },
    lightText: {
      type: String,
      default: '开启'
    },
    bad: {
      type: String,
      default: bad
    },
    badText: {
      type: String,
      default: '报警'
    },
    close: {
      type: String,
      default: close
    },
    closeText: {
      type: String,
      default: '关闭'
    },
    styles: ''
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    init () {
    }
  }
};
</script>

<style lang="less">
#lightLabers{
  min-width: 230px;
  height: auto;
    &.labers{
      position: absolute;
      bottom: 10px;
      right: 0;
      z-index: 11;
      >div{
        width: 33%;
        height:auto;
        padding: 10px;/*no*/
        margin-right: 10px;/*no*/
        background:linear-gradient(180deg,rgba(22,24,48,0.81) 0%,rgba(22,24,48,0.81) 100%);
        box-shadow:0px 2px 4px 0px rgba(146,146,146,0.5);
        border-radius:4px;
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color: #fff;
        white-space:nowrap;
        img{
          width: 11px;
          height: auto;
          margin-right: 8 px;
        }
      }
    }
}
</style>
