<template>
  <div id="wrpaBox" class="flexCenter">
    <img
      v-if="homeDataList.Type === '图片'"
      :src=" `${baseURL || config.baseURL.dev}/upload${homeDataList.Src}`"
      alt
    />
    <video
      id="videoTime"
      v-if="homeDataList.Type === '视频'"
      autoplay
      muted
      @ended="goOnClick"
      controls
      :src=" `${baseURL || config.baseURL.dev}/upload${homeDataList.Src}`"
    />
    <div class="textTemplate"  v-if="homeDataList.Type === '文字'">
      {{homeDataList.Src}}
    </div>
  </div>
</template>

<script>
import config, { baseURL } from '@/config';
export default {
  props: {
    indexData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      config,
      baseURL,
      homeDataList: {
        Type: null,
        Src: null
      },
      timer: null,
      playTimer: null,
      nowIndex: 0
    }
  },
  created () {
    if (this.indexData.length > 0) {
      this.clearInfo();
      this.getData()
    }
  },
  watch: {
    indexData: {
      handler (newValue) {
        if (newValue.length > 0) {
          this.clearInfo();
          this.indexData = newValue;
          this.getData();
        } else {
          this.clearInfo();
        }
      }
    }
  },
  methods: {
    clearInfo () {
      clearInterval(this.timer);
      clearInterval(this.playTimer);
      this.timer = null;
      this.playTimer = null;
      this.nowIndex = 0
      this.homeDataList = {
        Type: null,
        Src: null
      };
    },
    getData () {
      this.homeDataList = this.indexData[0];
      if (this.getType(this.homeDataList && this.homeDataList.Type)) {
        this.timer = setTimeout(() => {
          this.starPlay()
        }, this.getStayTime(this.homeDataList.stayTime));
      }
    },
    starPlay () {
      this.nowIndex++
      if (this.nowIndex > this.indexData.length - 1) {
        clearInterval(this.playTimer);
        this.playTimer = null;
        this.nowIndex = 0
        this.homeDataList = this.indexData[this.nowIndex]
        if (this.getType(this.homeDataList && this.homeDataList.Type)) {
          this.playTimer = setTimeout(() => {
            this.starPlay()
          }, this.getStayTime(this.homeDataList.stayTime));
        }
      } else {
        clearInterval(this.playTimer);
        this.playTimer = null;
        this.homeDataList = this.indexData[this.nowIndex]
        if (this.getType(this.homeDataList && this.homeDataList.Type)) {
          this.playTimer = setTimeout(() => {
            this.starPlay()
          }, this.getStayTime(this.homeDataList.stayTime));
        }
      }
    },
    getStayTime (time) {
      return time * 1000;
    },
    getType (type) {
      return type ? (type === '图片' || type === '文字') : false
    },
    goOnClick () {
      this.starPlay()
    }
  },
  destroyed () {
    this.clearInfo();
  }
}
</script>
<style lang="less">
#wrpaBox{
  height: 100%;
  width: 100%;
  // padding: 5px 0;/*no*/
  video{
    width: 100%;
    height: 100%;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .textTemplate{
    width: 100%;
    height: 100%;
    padding: 10px;/*no*/
    overflow: auto;
    background:linear-gradient(171deg,rgba(21,173,182,1) 0%,rgba(49,72,219,1) 100%);
    box-shadow:0px 2px 9px 0px rgba(72,128,255,0.5);/*no*/
    border-radius:5px;/*no*/
    display: flex;
    flex-direction: column;
    font-size:12px;/*no*/
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
}
</style>
