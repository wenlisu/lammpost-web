<template>
  <div id="mobile_map">
    <div class="head_title">视频监控</div>
    <baidu-map
      class="bm-view"
      ak="ZyKWZjnDOAUE4WEq9Qu9SMT4b9v8iUGM"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @zoomend="onZoomend"
      v-show="baiduMapShow"
    >
      <bm-marker
        v-for="(item, index) in bmMarkers"
        :key="`${index}+${item.id}`"
        :position="item.position"
        :icon="{url: item.url, size: item.size}"
        :zIndex="item.zIndex"
        :dragging="false"
        @click="onClickMarker(item)"
        :title="item.name"
      ></bm-marker>
    </baidu-map>
    <div class="marker_item" v-if="tableActiveName" @click="goDetail">{{tableActiveName}}</div>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map-v3';
import {
  BmMarker
} from 'vue-baidu-map-v3/components';
export default {
  data () {
    return {
      center: '广州塔',
      zoom: 16,
      baiduMapShow: false,
      bmMarkers: [],
      tableActiveId: '',
      tableActiveName: ''
    };
  },
  components: {
    BaiduMap,
    BmMarker
  },
  methods: {
    handler ({ BMap, map }) {
      // let mapStyle = { style: 'midnight' };
      setTimeout(() => {
        // map.setMapStyleV2({
        //   styleId: "02b81ab7cd95f6aece86c3500bf9b3cf"
        // });
        this.baiduMapShow = true;
        this.bmMarkers = this.getMarkerData();
      }, 550);
    },
    onZoomend ({ target }) {
      this.zoom = target.Na;
    },
    getMarkerData () {
      let obj = {
        batteryInUse: 3,
        name: '智能灯杆-0972A873(摄像头1)',
        batteryPosition: 1,
        batteryStatus: 1,
        id: 1,
        imei: '0972A873AAF211EA8A5A00163E02E0CA',
        lampEquipStatus: 3,
        lampStatus: 1,
        latitude: '113.33108',
        longitude: '23.112176',
        payWay: '1',
        position: {
          lng: '113.33108',
          lat: '23.112176'
        },
        power: '8000',
        price: '1.5',
        serialNumber: '3F4B0D1EAAFF11EA8A5A00163E02E0CA',
        size: {
          height: 80,
          width: 67
        },
        status: 1,
        terminalName: '智能灯杆-0972A873',
        url:
          'data:image/png;base64,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',
        zIndex: 1
      };
      let obj1 = {
        batteryInUse: 3,
        name: '智能灯杆-0972A873(摄像头2)',
        batteryPosition: 1,
        batteryStatus: 1,
        id: 1,
        imei: '0972A873AAF211EA8A5A00163E02E0CA',
        lampEquipStatus: 3,
        lampStatus: 1,
        latitude: '113.333164',
        longitude: '23.113399',
        payWay: '1',
        position: {
          lng: '113.333164',
          lat: '23.113399'
        },
        power: '8000',
        price: '1.5',
        serialNumber: '3F4B0D1EAAFF11EA8A5A00163E02E0CA',
        size: {
          height: 80,
          width: 67
        },
        status: 1,
        terminalName: '智能灯杆-0972A873',
        url:
          'data:image/png;base64,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',
        zIndex: 1
      };
      let obj2 = {
        batteryInUse: 3,
        name: '智能灯杆-0972A873(摄像头3)',
        batteryPosition: 1,
        batteryStatus: 1,
        id: 1,
        imei: '0972A873AAF211EA8A5A00163E02E0CA',
        lampEquipStatus: 3,
        lampStatus: 1,
        latitude: '113.336739',
        longitude: '23.112228',
        payWay: '1',
        position: {
          lng: '113.336739',
          lat: '23.112228'
        },
        power: '8000',
        price: '1.5',
        serialNumber: '3F4B0D1EAAFF11EA8A5A00163E02E0CA',
        size: {
          height: 80,
          width: 67
        },
        status: 1,
        terminalName: '智能灯杆-0972A873',
        url:
          'data:image/png;base64,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',
        zIndex: 1
      };
      let data = [obj, obj1, obj2];
      return data;
    },
    onClickMarker (target) {
      this.tableActiveName = target.name;
      this.tableActiveId = target.imei;
    },
    goDetail () {
      this.$router.push({name: 'monitorList'})
    }
  },
  created () {
    // document.html.style.minWidth = 'auto'
    document.body.style.minWidth = 'auto';
  }
};
</script>
<style lang="less" scoped>
html,
body {
  min-width: auto !important;
}
#mobile_map {
  // width: 375px;
  height: 100%;
  .head_title {
    background: #ff6701;
    text-align: center;
    height: 88px;
    font-size: 32px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 88px;
  }
  .bm-view {
    width: 100%;
    height: calc(100% - 88px);
    position: relative;
  }
  .marker_item {
    position: absolute;
    bottom: 30px;
    left: 24px;
    right: 24px;
    height: 146px;
    padding-left: 40px;
    line-height: 146px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 9px 0px rgba(205, 205, 205, 0.5);
    font-size:30px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(50,50,50,1);
    &::after{
      content: '';
      height: 146px;
      width: 6px;
      top: 0;
      left:0px;
      background: #F9672C;
      position: absolute;
    }
  }
}
</style>
