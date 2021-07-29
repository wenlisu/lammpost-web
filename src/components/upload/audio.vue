<template>
  <span class="flexRow tsp-audio" :class="{'playing': status==1}" >
        <audio width="260" ref="audio" onload="test" class="audio" :src="file.url" controls="controls">浏览器不支持录音播放</audio>
        <span class="name"><scrollText>{{file.name}}</scrollText></span>
        <span class="icon delete" @click.prevent.stop="handleRemove" v-if="deleteShow">
          <i class="iconfont icon-shanchu2"/>
        </span>
    </span>
</template>
<script>
import 'mediaelementjs/full';
import 'mediaelementjs/build/mediaelementplayer.min.css';
import scrollText from '@/components/scrollText';
export default {
  props: {
    file: {
      type: Object,
      default: () => {}
    },
    deleteShow: {
      type: Boolean,
      default: true
    }
  },
  // 初始化参数
  data () {
    return {
      status: 0 // 0 pause, 1 play
    };
  },
  components: {
    scrollText
  },
  mounted () {
    var self = this;
    let audio = this.$refs.audio;
    new MediaElementPlayer(audio);
    audio.addEventListener('play', function (e) { self.status = 1; })
    audio.addEventListener('pause', function (e) { self.status = 0; })
  },
  methods: {
    handleRemove () {
      this.$emit('handleRemove', this.file);
    }
  }
};
</script>
<style lang="less">
.tsp-audio{
  position: relative;
  .name{
    position: absolute;
    width: 40%;
    top: 5px;/*no*/
    right: 27px;/*no*/
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .mejs__container{
    width: 100% ;/*no*/
    height: auto;
    padding: 6px;/*no*/
    background: #D1E7FF;
    .mejs__controls{
      position: relative;
      background: transparent;
      height: 100%;
      margin: 0;
      padding: 0;
      .mejs__playpause-button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;/*no*/
        height: 24px;/*no*/
        background: linear-gradient(135deg, #20C5A2 0%, #2DB18E 100%);
        box-shadow: 0px 2px 4px 0px rgba(144, 178, 255, 0.5);/*no*/
        position: relative;
        button{
          width: 11px;/*no*/
          height: 11px;/*no*/
          display: flex;
          position: relative;
          margin: 0;
          padding: 0;
        }
        &.mejs__replay, &.mejs__play{
          button {
            background: url(./images/play.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
        &.mejs__pause{
          button{
            background: url(./images/pause.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
      .mejs__time{
        position: absolute;
        top: 0;
        left: 35px;/*no*/
        padding: 0;
        font-size: 12px;/*no*/
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #101010;
        height: auto;
        &.mejs__currenttime-container{
        }
        &.mejs__duration-container{
          left: 75px;/*no*/
        }
      }
      .mejs__time-rail{
        height: auto;
        margin: 0;
        margin-left: 10px;/*no*/
        display: flex;
        align-items: flex-end;
        .mejs__time-total{
          display: flex;
          margin-top: 0;
          background: #FDFDFD;
          height: 4px;/*no*/
          .mejs__time-current{
            height: 100%;
            background: linear-gradient(270deg, #30BDDE 0%, #5E7FF1 100%);
          }
          .mejs__time-loaded{
            height: 100%;
          }
          .mejs__time-handle{
            border: 2px solid transparent;/*no*/
          }
          .mejs__time-hovered{
            height: 4px;/*no*/
          }
        }

      }
      .mejs__volume-button, .mejs__horizontal-volume-slider{
        display: none !important;
      }
    }
  }
  .icon{
    margin-left: 10px;/*no*/
    display: flex;
    align-items: center;
    i{
      font-size: 12px;/*no*/
      font-weight: bold;
      background-image: -webkit-linear-gradient(-45deg, #4E93E7 20%, #265ACA 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
