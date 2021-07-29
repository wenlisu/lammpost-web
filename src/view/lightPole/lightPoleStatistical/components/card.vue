<template>
  <div id="card" :class="className">
    <div class="flexRow flexCenter cardTitle" v-if="title">
        <img src="../images/img1.png"/>
        {{title}}
        <slot name="titleOther"></slot>
    </div>
    <div class="flexRow cardLabers" v-if="labers && labers.length && labers.length > 0">
        <div
            class="flexRow flexCenter"
            v-for="(laber, index) in labers"
            :key="index"
        >
            <span :style="{background: laber.background}"/>{{laber.name}}
        </div>
    </div>
    <slot name="labers" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
    };
  },
  props: {
    title: '',
    labers: {
      type: Array,
      default: () => {
        return []
      }
    },
    className: ''
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
    }
  }
};
</script>

<style lang="less">
#card{
    width: 100%;
    padding-top: 50px;
    background: rgba(32,45,85,.49);
    position: relative;
    >.cardTitle{
      position: absolute;
      top: 11px;/*no*/
      left: 16px;/*no*/
      font-size:14px;/*no*/
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(160,172,216,1);
      img{
        width: 26px;
        height: 13px;
        margin-right: 8px;
      }
    }
    >.cardLabers{
      position: absolute;
      top: 11px;/*no*/
      right: 20px;/*no*/
      >div{
        margin-right: 21px;
        font-size:12px; /*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        span{
          display: inline-block;
          width:20px;
          height:4px;
          background:rgba(72,128,255,1);
          border-radius:2px;/*no*/
          margin-right: 6px;/*no*/
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    &.adminCard{
      background: #fff;
      padding-left: 16px;/*no*/
      padding-right: 16px;/*no*/
      .cardTitle{
        color: rgb(121, 111, 111);
        font-weight: normal;
        padding-left: 10px;/*no*/
        img{
          display: none;
        }
        &::after{
          content: '';
          width: 4px;/*no*/
          height: 13px;/*no*/
          background: #265ACA;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      #formItemText{
        .el-form-item{
          .el-form-item__content{
            color: rgb(51, 51, 51);
          }
        }
      }
    }
}
</style>
