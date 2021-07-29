<template>
  <div id="videoAddress">
             <!-- <iframe
      ref="iframe"
      id="iframe"
          :src="'static/alarmWeb/alarmWeb.html'"
          width="100%"
          height="100%"
          allow="autoplay"
          border="0"
          scrolling="no"
          allowfullscreen
          @load="loadIframe"
      ></iframe> -->
         <iframe
         ref="iframe"
          v-bind:src="src"
          name="iframe"
          frameborder="0"
          allowfullscreen
          allow="autoplay"
          scrolling="no"
          id="serviceAddress"
      ></iframe>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
// import moment from 'moment';
import EZUIKit from 'ezuikit-js';
import searchForm from 'components/adminSearchForm/searchForm';
import { getEvents } from 'api/IBM';
import { routePush } from '@/util/util';
export default {
  name: 'videoAddress',
  props: {
    cameraId: {
      type: [Number, String],
      default: undefined
    }
  },
  data () {
    return {
      src: `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${this.common.accessToken}&templete=2`,
      width: '100%',
      height: '100%',
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
      this.player = new EZUIKit.EZUIPlayer('serviceAddress');
      this.player.play();
      // this.init(this.$route.query.channel, this.$route.query.type);
      // this.initSize(this.$route.query.width, this.$route.query.height);
    });
  },
  watch: {
    $route (to, from) {
    }
  },
  methods: {
    async init (channel, type) {
      if (channel && type) {
        this.src = `http://221.7.245.168:10800/play.html?channel=${channel}&iframe=yes&aspect=340x240`;
      } else {
        this.src = 'static/alarmWeb/alarmWeb.html';
      }
    },
    initSize (width, height) {
      console.log(width);
      this.$refs.iframe.width = width || '100%';
      this.$refs.iframe.height = height || '100%';
      // this.width = width;
      // this.height = height;
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
#videoAddress {
  padding: 0;
  display: flex;
  justify-content: center;
 #iframe{
      height: 100%;/*no*/
      width: 100%;
      overflow: hidden;
    }
}
</style>
