<template>
  <div id="mapTitle">
    {{name}}
  </div>
</template>

<script>

export default {
  name: 'mapTitle',
  data () {
    return {
    };
  },
  props: {
    name: String
  }
};
</script>

<style lang="less" scoped>
#mapTitle{
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 20px;
  background: linear-gradient(180deg, #FFFFFF 0%, #C7DEFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 21px;
  margin-bottom: 10px;/*no*/
  position: relative;
  &::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 15px;
    height: 12px;
    background: linear-gradient(90deg, rgba(94, 174, 255, 0) 0%, #538CFF 100%);
  }
}
</style>
