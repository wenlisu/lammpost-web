<template>
  <div id="videoPlayback">
    <div class="video">
      <div class="iframe">
      <iframe
        ref="iframe"
        id="iframe"
        :src="src"
        width="100%"
        height="100%"
        allow="autoplay"
        border="0"
        scrolling="no"
        allowfullscreen
      ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import EZUIKit from 'ezuikit-js';
import searchForm from 'components/adminSearchForm/searchForm';
import { getEvents } from 'api/IBM';
import { routePush } from '@/util/util';
export default {
  name: 'videoPlayback',
  props: {
    cameraId: {
      type: [Number, String],
      default: undefined
    },
    src: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      editData: {},
      videoPath: '',
      loading: false,
      searchVal: {},
      searchChangeVal: {},
      searchItems: [{
        type: 'select',
        label: '摄像头',
        labelWidth: '65px',
        hide: true,
        props: {
          fieldName: 'cameraIds',
          options: [{
            id: '1',
            name: '室内半球'
          }, {
            id: '2',
            name: '海康机枪554端口'
          }, {
            id: '3',
            name: '测试机枪554'
          }]
        }
      }, {
        type: 'dataPicker',
        label: '回访时间',
        labelWidth: '70px',
        initValue: moment().format('YYYYMMDD'),
        props: {
          type: 'date',
          fieldName: 'data',
          format: 'yyyyMMdd',
          width: '150px'
        }
      }],
      player: null
    };
  },
  computed: {
    ...mapGetters(['common'])
  },
  components: {
    searchForm
  },
  mounted () {
    this.$nextTick(async () => {
      // this.init();
      this.player = new EZUIKit.EZUIPlayer('iframe');
      this.player.play();
    })
  },
  watch: {
  },
  methods: {
    init () {
      this.searchVal = {
        data: moment().format('YYYYMMDD')
      };
      this.videoPath = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.rec&autoplay=1&accessToken=${this.common.accessToken}&begin=20201112&end=20201112`;
    },
    onSearch (val) {
      if ((val.data !== this.searchVal.data)) {
        this.searchVal = {
          ...val
        };
      }
    }
  },
  created () {
  },
  beforeDestroy () {
  },
  destroyed () {
    this.player.stop();
  }
};
</script>
<style lang="less" scoped>
#videoPlayback {
  #adminSearchForm{
    padding: 20px 15px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 4px 0px rgba(213,213,213,0.5);/*no*/
    margin-bottom: 10px;/*no*/
  }
  .video{
    // height: calc(100% - 82.3px);/*no*/
    // padding: 10px;/*no*/
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 4px 0px rgba(213,213,213,0.5);/*no*/
    overflow: hidden;
    video{
      width: 100%;
      height: auto;
    }
    .iframe{
      height: 455px;/*no*/
      width: 100%;
      overflow: hidden;
    }
    iframe{

        width: 100%;/*no*/
      height: 100%;/*no*/
      position: relative;
      top: 0%;
      left: 0%;
      bottom: 0;
      right: 0;
      z-index: 0;
      &.video{
      width: 145%;/*no*/
      height: 895px;/*no*/
      position: relative;
      top: -42%;
      left: -36.5%;
      transform: scale(0.9);
      z-index: 0;
      }
    }
    .panel{
      margin-top: 20px;
      .title{
        font-size:14px;
        padding-left: 10px;
        border-left: 4px solid #FF6701;/*no*/
      }
    }
  }
}
@media screen and (max-width: 1230px) {
    .video{
      height: 750px !important;
      // overflow: auto !important;
      // iframe{
      //   top: -36% !important;
      // }
    }
}
// @media screen and (max-width: 1270px) {
//   .iframe{
//     iframe{
//       top: -48% !important;
//       left: -36% !important;
//     }
//   }
// }
</style>
