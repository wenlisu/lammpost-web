/* eslint-disable camelcase */
<template>
  <div
  id='smokeDetectorMap'
  :style="{
    backgroundImage: `url(${titleTypeIndex.body})`,
    backgroundSize: '100% 100%'
  }"
  >
    <div class="mapTitle">
      <img :src="titleTypeIndex.title" @click="goBack" v-if="type !== 'template'"/>
      <ul class="titleList">
        <li
          v-for="item in titleTypeList"
          :key="item.id"
          :class="{'active': titleTypeIndex.id === item.id}"
          @click="handleChangeMap(item)"
        >
          {{item.name}}
        </li>
      </ul>
    </div>
    <dv-loading v-if="!baiduMapShow"></dv-loading>
    <div class="map" :class="baiduMapShow && 'readyMap'">
      <div
        :class="{
          'active': titleTypeIndex.id === 'smoke'
        }"
      >
        <smokeMap />
      </div>
      <div
        :class="{
          'active': titleTypeIndex.id === 'entrance'
        }"
      >
        <entranceMap :show="baiduMapShow && titleTypeIndex.id === 'entrance'"/>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import smokeMap from './components/smokeMap';
import entranceMap from './components/entranceMap';
import smokeT from './images/img12.png';
import smokeB from './images/img1.png';
import entranceT from './images/entranceT.png';
import entranceB from './images/entranceB.png';
/** 空气质量 */

export default {
  name: 'smokeDetectorMap',
  data () {
    return {
      titleTypeIndex: {
        id: 'smoke',
        name: '智慧烟感',
        title: smokeT,
        body: smokeB
      },
      titleTypeList: [{
        id: 'smoke',
        name: '智慧烟感',
        title: smokeT,
        body: smokeB
      }, {
        id: 'entrance',
        name: '智慧门禁',
        title: entranceT,
        body: entranceB
      }],
      baiduMapShow: false
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        // this.titleTypeIndex = this.titleTypeList[0];
        this.baiduMapShow = true;
      }, 1000);
    });
  },
  components: {
    smokeMap,
    entranceMap
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    handleChangeMap (item) {
      this.baiduMapShow = false;
      this.titleTypeIndex = item;
      setTimeout(() => {
        this.baiduMapShow = true;
      }, 500);
    },
    init () {
    },
    goBack () {
      this.$router.push({
        name: 'lightPoleMap'
      });
    }
  }
}
</script>

<style lang="less" scoped>
#smokeDetectorMap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: -1px;/*no*/
  .mapTitle{
    position: relative;
    min-height: 43px;/*no*/
    img{
      width: 100%;
      height: auto;
      cursor: pointer;
    }
    .titleList{
      position: absolute;
      bottom: 0;
      left: 4%;/*no*/
      display: flex;
      flex-direction: row;
      li{
        width: 145px;
        height: 43px;
        padding-bottom: 8px;
        background: url(./images/img3.png) no-repeat center;
        background-size: 100% 100%;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;/*no*/
        cursor: pointer;
        &:first-child{
          background: url(./images/img18.png) no-repeat center;
          background-size: 100% 100%;
          &.active{
            background: url(./images/img10.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
        &.active{
          background: url(./images/img17.png) no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
  }
  .map {
    width: 100%;
    // height: calc(100%);/*no*/
    flex: 1;
    position: relative;
    background-size: cover;
    visibility: hidden;
    &.readyMap{
      visibility: visible;
    }
    >div{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      display: none;
      &.active{
        display: flex;
      }
    }
  }
}
</style>
