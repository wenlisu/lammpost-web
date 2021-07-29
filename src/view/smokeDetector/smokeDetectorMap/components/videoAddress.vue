<template>
  <div id="videoAddress">
        <iframe
         ref="iframe"
          v-bind:src="src"
          style="width: 100%;height: 100%"
          name="iframe"
          frameborder="0"
          allowfullscreen
          allow="autoplay"
          scrolling="no"
      ></iframe>
      <el-drawer
        title="我是标题"
        :with-header="false"
        :visible.sync="drawer.show"
        :direction="drawer.direction"
        :before-close="handleCloseDrawer"
        :modal-append-to-body="false"
      >
        <div class="flexCloumn btnList">
          <div
            class="submitBtn"
            size="small"
            v-for="item in drawer.btnItems"
            :key="item.id"
            @mousedown="item.mousedown"
            @mouseup="item.mouseup"
          >
            <!-- <i class="iconfont icon-chaxun"></i> -->
            {{item.name}}
          </div>
        </div>
      </el-drawer>
      <div class="kongzhi-icon" @click="handleMore(serialNumber)"><i class="iconfont icon-shexiangtoukongzhi-copy" /></div>
  </div>
</template>
<script>
import searchForm from 'components/adminSearchForm/searchForm';
import { postData } from '@/util/util';
export default {
  name: 'videoAddress',
  props: {
    cameraId: {
      type: [Number, String],
      default: undefined
    },
    srcUrl: {
      type: String,
      default: undefined
    },
    serialNumber: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      src: 'static/alarmWeb/alarmSingWeb.html',
      drawer: {
        show: false,
        direction: 'rtl',
        currentDev: '',
        btnItems: [{
          id: 'a',
          name: '上转',
          mousedown: () => {
            this.handleDeviceContral(0);
          },
          mouseup: () => {
            this.handleDeviceContral(0, 'stop');
          }
        }, {
          id: 'b',
          name: '下转',
          mousedown: () => {
            this.handleDeviceContral(1);
          },
          mouseup: () => {
            this.handleDeviceContral(1, 'stop');
          }
        }, {
          id: 'c',
          name: '左转',
          mousedown: () => {
            this.handleDeviceContral(2);
          },
          mouseup: () => {
            this.handleDeviceContral(2, 'stop');
          }
        }, {
          id: 'd',
          name: '右转',
          mousedown: () => {
            this.handleDeviceContral(3);
          },
          mouseup: () => {
            this.handleDeviceContral(3, 'stop');
          }
        }, {
          id: 'e',
          name: '左上转',
          mousedown: () => {
            this.handleDeviceContral(4);
          },
          mouseup: () => {
            this.handleDeviceContral(4, 'stop');
          }
        }, {
          id: 'f',
          name: '左下转',
          mousedown: () => {
            this.handleDeviceContral(5);
          },
          mouseup: () => {
            this.handleDeviceContral(5, 'stop');
          }
        }, {
          id: 'g',
          name: '放大',
          mousedown: () => {
            this.handleDeviceContral(8);
          },
          mouseup: () => {
            this.handleDeviceContral(8, 'stop');
          }
        }, {
          id: 'h',
          name: '缩小',
          mousedown: () => {
            this.handleDeviceContral(9);
          },
          mouseup: () => {
            this.handleDeviceContral(9, 'stop');
          }
        }, {
          id: 'i',
          name: '近聚焦',
          mousedown: () => {
            this.handleDeviceContral(10);
          },
          mouseup: () => {
            this.handleDeviceContral(10, 'stop');
          }
        }, {
          id: 'j',
          name: '远聚焦',
          mousedown: () => {
            this.handleDeviceContral(11);
          },
          mouseup: () => {
            this.handleDeviceContral(11, 'stop');
          }
        }]
      }
    };
  },
  components: {
    searchForm
  },
  mounted () {
    this.$nextTick(async () => {
      this.init();
    });
  },
  watch: {
    srcUrl (val) {
      this.init();
    }
  },
  methods: {
    async init () {
      if (this.srcUrl && (this.srcUrl !== this.src)) {
        this.src = this.srcUrl;
      }
    },
    loadIframe () {
      const iframeMain = this.$refs.iframe;
      const y = (iframeMain.contentWindow || iframeMain.contentDocument);
      const cssStyle = 'body { background: red; } ';
      let style = y.document.createElement('style');
      style.type = 'text/css';
      const head = y.document.getElementsByTagName('head')[0];
      if (style.styleSheet) {
        style.styleSheet.cssText = cssStyle;
      } else {
        style.appendChild(y.document.createTextNode(cssStyle));
      }
      head.appendChild(style);
    },
    // 控制摄像头
    async handleDeviceContral (direction, type = 'start') {
      const parames = {
        speed: 1,
        direction,
        deviceSerial: this.drawer.currentDev
      };
      const res = await postData(`api/lapp/device/ptz/${type}`, parames);
    },
    // 打开控制遮罩
    handleMore (devCode) {
      this.drawer.show = true;
      this.drawer.currentDev = devCode
    },
    // 关闭遮罩
    handleCloseDrawer () {
      this.drawer.show = false;
    }
  },
  created () {
  },
  beforeDestroy () {
  }
};
</script>
<style lang="less" scoped>
#videoAddress {
  padding: 0;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
  iframe{
    height: 100%;/*no*/
    // min-height: 140px;/*no*/
    width: 100%;
    overflow: hidden;
  }
  .kongzhi-icon {
    position: absolute;
    bottom: 14px;
    color: #fff;
    right: 114px;
    cursor: pointer;
  }
  .el-drawer__wrapper{
    position: absolute;
    /deep/.el-drawer__container{
      >div{
        width: 103px !important;/*no*/
        overflow: auto;
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
      }
    }
    .el-drawer__body{
      .btnList{
        padding: 15px;/*no*/
        >div{
          cursor: pointer;
          padding: 0 13px;/*no*/
          min-width:70px;/*no*/
          height:30px;/*no*/
          background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
          border-radius:4px;/*no*/
          line-height: 28px;/*no*/
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(230,236,255,1);
          margin-bottom: 10px;/*no*/
          text-align: center;
          span{
            font-size:12px;/*no*/
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(230,236,255,1);
          }
        }
      }
    }
  }
}
</style>
