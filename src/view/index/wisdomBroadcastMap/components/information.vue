<template>
  <div id="broadcastInformation" class="info" v-if="show">
        <div class="correct">
          <el-button icon="el-icon-close" @click="closeInformation"></el-button>
          <div class="title" @click="handleToDetail(info)">{{info.audioDeviceName}}<img src="../images/img4.png"/></div>
          <div class="flexRow address"><img src="../images/img12.png" />{{info.installAddress}}</div>
          <div>IMEI号：{{info.imei}}</div>
          <div class="flexRow">最后上报时间：{{info.lastReportTime}}</div>
          <div class="flexRow">
            <div>经度：{{info.longitude}}</div>
            <div>纬度：{{info.latitude}}</div>
          </div>
          <div class="flexRow">
            <div>设备状态：{{info.onlineStatusText}}</div>
            <div>音量：{{info.deviceVolume}}分贝</div>
          </div>
          <div
            v-for="audioFile in info.audioMediaDtoList"
            :key="audioFile.fileCode"
            class="audioContent"
          >
            <audioContainer
              :file="{
                url: audioFile.fileUrl,
                name: audioFile.fileName,
                code: audioFile.fileCode
              }"
              :deleteShow="false"
            />
          </div>
        </div>
  </div>
</template>

<script>
import audioContainer from '@/components/upload/audio';
export default {
  name: 'broadcastInformation',
  data () {
    return {
    };
  },
  watch: {
    info (val) {
      this.info = val;
    },
    show (val) {
      this.show = val;
    }
  },
  components: {
    audioContainer
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
#broadcastInformation{
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
      .correct >button{
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
        min-width: 333px;/*no*/
        background:url('../images/img11.png') no-repeat center;
        background-size: 100% 100%;
        color: #fff;
        .orange{
          color:#FF720D;
        }
        .warn{
          color:#FF3C30;
        }
        >div{
          width: 100%;
          // color: #fff;
          >div{
            flex: 1;
            text-align: left;
            // color: #fff;
          }
          span.diamond{
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
        .audioContent{
          margin-top: 5px;/*no*/
          /deep/.name{
            right: 5px;/*no*/
          }
        }
      }
}
</style>
