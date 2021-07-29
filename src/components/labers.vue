<template>
  <div id="labers" class="flexRow" :class="location">
    <div
      class="flexRow laberItem"
      v-for="item in items"
      :key="item.name"
      :class="type"
    >
    <span :style="{ background: `${item.color}`, width: `${item.width}`, height: `${item.height}` }" />
    {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'labers',
  data () {
    return {
    };
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'default'
    },
    location: {
      type: String,
      default: () => {
        return 'center'
      }
    }
  }
};
</script>

<style lang="less" scoped>
#labers{
  width: 100%;
  justify-content: center;
  .laberItem{
    flex: 1;
    font-size: 12px;/*no*/
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    // margin-right: 20px;/*no*/
    align-items: center;
    justify-content: center;
    word-break: keep-all;
    &:last-child{
      margin-right: 0;
    }
    span{
      width: 10px;/*no*/
      height: 10px;/*no*/
      background: #4AD3AB;
      border-radius: 2px;/*no*/
      margin-right: 4px;/*no*/
    }
    &.circle{
      span{
        border-radius: 100px;
      }
    }
  }
  &.left{
    justify-content: flex-start;
  }
  &.right{
    justify-content: flex-end;
  }
}
</style>
