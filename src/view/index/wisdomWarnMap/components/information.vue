<template>
  <div id="warnInformation" class="info" v-if="show">
        <div class="correct">
          <el-button icon="el-icon-close" @click="closeInformation"></el-button>
          <div class="title" @click="handleToDetail(info)">{{info.deviceName}}<img src="../images/img4.png"/></div>
          <div class="flexRow address"><img src="../images/img12.png" />{{info.address}}</div>
          <div class="flexRow">
            <div>IMEI号：{{info.imei}}</div>
          </div>
          <div class="flexRow">
            <div>经度：{{info.longitude}}</div>
            <div>纬度：{{info.latitude}}</div>
          </div>
          <div class="flexRow">
            <div>报警状态：{{info.alarmCallStatusText}}</div>
          </div>
          <div class="flexRow" v-if="info.alarmCallStatus === 2 || info.alarmCallStatus === 3">
            <div>报警开始时间：{{info.callTime}}</div>
          </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'warnInformation',
  data () {
    return {
      collapseActiveNames: ['1']
    };
  },
  watch: {
    info (val) {
      this.info = val;
    },
    show (val) {
      this.show = val;
    },
    effextArray (val) {
      this.effextArray = val;
    }
  },
  components: {
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    effextArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    handleToDetail (item) {
      this.$emit('detail', item)
    },
    closeInformation () {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less">
#warnInformation{
      &.info{
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
      #radioType{
        justify-content: flex-start;
      }
      >div{
      padding: 35px 36px 35px 25px;
      }
      button{
        position: absolute;
        top: 0;
        right: 0;
        padding: 0;
        border-radius: 0;
        width:20px;
        height:20px;
        background:rgba(103,112,148,1);
        /deep/i{
          color: #fff;
          font-size: 12px;
        }
      }
      >div>div{
        margin-bottom: 10px;
        font-size:12px;/*no*/
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        &.title{
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          font-size:14px;/*no*/
          cursor: pointer;
          img{
            width: 17px;
            height: 12px;
            margin-left: 8px;
          }
        }
        &:last-child{

        }
      }
    }
  .correct{
    background:url('../images/img11.png') no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    >div:not(.effect){
      width: 500px;
      // color: #fff;
      >div{
        // width: 50%;
        flex: 1;
        text-align: left;
        word-break: break-all;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        padding-right: 10px;/*no*/
        // color: #fff;
      }
      span{
        font-size: 12px;/*no*/
        color: #fff;
        padding:1px 7px;/*no*/
        background:linear-gradient(141deg,rgba(49,205,151,1) 0%,rgba(31,171,142,1) 100%);
        border-radius: 50px;
        &.greent{
          background:linear-gradient(141deg,rgba(135,199,68,1) 0%,rgba(94,147,48,1) 100%);
        }
        &.yellow{
          background:linear-gradient(141deg,rgba(251,186,69,1) 0%,rgba(233,156,33,1) 100%);
        }
        &.orange{
          background:linear-gradient(141deg,rgba(251,115,69,1) 0%,rgba(233,86,33,1) 100%);
        }
      }
    }
    .effect{
      width: 500px;
      margin-bottom: 0;
      .title{
        width: 100%;
        padding-bottom: 5px;/*no*/
        border-bottom: 1px solid #2e3d6b;/*no*/
      }
      #wrpaBox{
        display: flex;
        width: 240px;/*no*/
        height: 160px;/*no*/
      }
    }
    .updateTime{
      color:rgba(135,145,190,1);
      margin-bottom: 0;
    }
    .address{
      align-items: center;
      img{
        width: 14px;
        height: 16px;
        margin-right: 6px;
      }
    }
    .imgList{
      min-width: 256px;
      max-width: 500px;
      img, video{
        width: calc(50% - 3px);/*no*/
        height:79px;
        &:first-child{
          margin-right: 6px;/*no*/
        }
      }
    }
    .el-switch{
      width:29px;/*no*/
      height:13px;/*no*/
      /deep/.el-switch__core{
        height: 100%;
        &::after{
          top: 0;
          width:11px;/*no*/
          height:11px;/*no*/
          background:rgba(255,255,255,1);
          box-shadow:0px 3px 7px 0px rgba(27,104,126,0.5);
        }
      }
      &.is-checked{
        /deep/.el-switch__core{
          &::after{
            margin-left: -12px;/*no*/
          }
        }
      }
    }
    .tabTitle{
      font-size:12px;/*no*/
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(255,255,255,1);
      padding: 8px 10px;
      position: relative;
      border-bottom: 1px solid rgba(46, 61, 107, 1);/*no*/
      &::after{
        content: '';
        width:3px;/*no*/
        height:12px;/*no*/
        background:rgba(216,216,216,1) linear-gradient(138deg,rgba(62,210,240,1) 0%,rgba(58,104,211,1) 100%);
        border-radius:1px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }
  }
}
</style>
