<template>
  <div class="warm-map-box">
    <div class="map">
      <baidu-map
        ref="map"
        class="bm-view"
        ak="IoC3dZUFGLc7AP7uPiQxBqA7QtcvQ7dU"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @ready="handler"
        @zoomend="onZoomend"
        :class="baiduMapShow && 'readyMap'"
      >
        <bm-polyline
          v-for="(item, index) in polylinePath"
          :key="index"
          :path="item"
          stroke-color="url(#MyGradient)"
          :stroke-opacity="1"
          :stroke-weight="8"
          strokeStyle="solid"
          :editing="false"
        ></bm-polyline>
        <my-overlay
          v-for="(item, index) in allPoint"
          :key="index"
          :position="item.center"
          :status="item.status"
          ref="layer"
          :allInfo="{ ...item, ...info[item.serialNumber]}"
          @getDetail="getAlarmDetail"
        >
        </my-overlay>

        <div class="tipIcon">
          <div class="normal">
            <img src="./images/normal.png" alt="" srcset="" />
            <span>正常</span>
          </div>
          <div class="alarm">
            <img src="./images/error.png" alt="" srcset="" />
            <span>报警</span>
          </div>
        </div>
      </baidu-map>
    </div>
    <div class="left-info">
      <info />
    </div>
    <div class="right-chart">
      <chart />
    </div>
  </div>
</template>

<script>
import commonTitle from "../components/commonTitle";
import info from "./components/newInfo";
import chart from "./components/chart.vue";
// import infoTable from "./components/infoTable/table";
import MyOverlay from "./components/MyOverlay";
// import { CanvasLayer } from '@/common/js/CanvasLayer';
// import { svgPathCurv } from '@/util/util';

// 局部引入百度地图
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import bmPolyline from "vue-baidu-map/components/overlays/Polyline";
import {
  getAmbientMonitoringMap,
  getAmbientMonitoringDtl,
} from "api/supervise";

export default {
  components: {
    MyOverlay,
    commonTitle,
    info,
    chart,
    BaiduMap,
    // infoTable,
    bmPolyline,
  },
  data() {
    return {
      currentShowIndex: 0,
      myLayer: null,
      infoTimer: null,
      // 每条路上的报警器经纬度及状态
      linePoint: [
        [
          {
            center: {
              lng: 113.204103,
              lat: 23.146474,
            },
            status: 1,
          },
          {
            center: {
              lng: 113.2202,
              lat: 23.055525,
            },
            status: 0,
          },
          {
            center: {
              lng: 113.302988,
              lat: 23.066165,
            },
            status: 1,
          },
          {
            center: {
              lng: 113.346107,
              lat: 23.037966,
            },
            status: 0,
          },
        ],
        [
          {
            center: { lng: 113.168458, lat: 23.140625 },
            status: 1,
          },
          {
            center: { lng: 113.177657, lat: 23.067761 },
            status: 0,
          },
          {
            center: { lng: 113.182831, lat: 22.989535 },
            status: 1,
          },
        ],
        [
          {
            center: { lng: 113.109889, lat: 23.139794 },
            status: 0,
          },
          {
            center: { lng: 113.109098, lat: 23.126933 },
            status: 1,
          },
          {
            center: { lng: 113.076975, lat: 23.125204 },
            status: 0,
          },
          {
            center: { lng: 113.153582, lat: 23.14644 },
            status: 1,
          },
          {
            center: { lng: 113.15042, lat: 23.126367 },
            status: 0,
          },
        ],
      ],
      allPoint: [], // 所有报警器的经纬度
      active: true,
      road: [], // 道路的起始点
      polylinePath: [], // 根据起始点获取到道路的所有坐标
      svgPath: [],
      center: {
        lng: 113.270218,
        lat: 23.134245,
      },
      zoom: 12,
      baiduMapShow: false,
      map: null,
      BMap: null,
      canvasLayer: null,
      canvasLayerPointer: null,
      info: {},
    };
  },
  destroyed() {
    this.infoTimer && clearTimeout(this.infoTimer)
  },
  methods: {
    async handler({ BMap, map }) {
      this.map = map; // 百度地图实例化对象
      this.BMap = BMap;
      const points = await this._getInfo();
      let startP = points[0].center;
      let endP = points[points.length - 1].center;
      this.getPoints(startP, endP);
      setTimeout(async () => {
        map.setMapStyleV2({
          styleId: "02b81ab7cd95f6aece86c3500bf9b3cf",
        });
        // 插入渐变
        let mapE = document.getElementsByClassName("bm-view")[0];
        let svgE = mapE.getElementsByTagName("svg");
        let def = `<defs>
        <linearGradient id="MyGradient">
          <stop offset="0%" stop-color="rgba(98,242,255,0.28)" />
          <stop offset="50%" stop-color="rgba(75,234,255,1)" />
          <stop offset="100%" stop-color="rgba(51,225,255,0.02)" />
        </linearGradient>
      </defs>`;
        const svgArr = [...svgE];
        if (svgArr.length) {
          svgArr.map((item) => {
            item.insertAdjacentHTML("afterBegin", def);
          });
        }

        // 初始化第一个信息弹框
        this.myLayer = this.$refs.layer;
        if (this.myLayer) {
          const detailInfo = await this._getBriefInfo(this.allPoint[0])
          this.allPoint[0] = { ...this.allPoint[0], ...detailInfo };
          this.myLayer[0].allInfo = { ...this.allPoint[0], ...detailInfo }
          this.myLayer[0].show = true;
          this.map.centerAndZoom(
            new BMap.Point(
              this.myLayer[0].position.lng,
              this.myLayer[0].position.lat
            ),
            this.zoom
          );
          this.center.lng = this.myLayer[0].position.lng
          this.center.lat = this.myLayer[0].position.lat
          this.currentShowIndex = 1;
          this.setInfoInterval();
        }
        this.baiduMapShow = true;
      }, 550);
    },
    setInfoInterval() {
      let myLayer = this.$refs.layer;
      this.myLayer = myLayer;
      let i = this.currentShowIndex;
      if (myLayer.length) {
        this.infoTimer = setInterval(async () => {
          // debugger
          if (myLayer[i] === undefined) return;
          const detailInfo = await this._getBriefInfo(this.allPoint[i])
          console.log('i', detailInfo);
          this.allPoint[i] = { ...this.allPoint[i], ...detailInfo };
          myLayer[i].allInfo = { ...this.allPoint[i], ...detailInfo };
          this.map.centerAndZoom(
            new BMap.Point(myLayer[i].position.lng, myLayer[i].position.lat),
            this.zoom
          );
          if (i <= myLayer.length - 1) {
            if (i == 0) {
              myLayer[myLayer.length - 1].show
                ? (myLayer[myLayer.length - 1].show = false)
                : null;
              myLayer[i].show = true;
              this.currentShowIndex = i;
              i++;
            } else {
              myLayer[i - 1].show = false;
              myLayer[i].show = true;
              this.currentShowIndex = i;
              i == myLayer.length - 1 ? (i = 0) : i++;
            }
            this.center.lng = myLayer[i].position.lng;
            this.center.lat = myLayer[i].position.lat;
          }
        }, 5000);
      }
    },
    // 点击切换信息并重新设置定时器
    getAlarmDetail(params) {
      this.infoTimer && clearInterval(this.infoTimer);
      this.myLayer.map((item) => {
        item.show = false;
      });
      this.setInfoInterval();
    },
    // 根据道路起始点获取道路所有坐标点
    getPoints(start, end) {
      let that = this;
      const myP1 = new this.BMap.Point(start.lng, start.lat); // 起点
      const myP2 = new this.BMap.Point(end.lng, end.lat); // 终点
      let driving = new this.BMap.DrivingRoute(
        this.map,
        {
          onSearchComplete: function (results) {
            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
              let pts = driving.getResults().getPlan(0).getRoute(0).getPath(); // 通过驾车实例，获得一系列点的数组
              that.polylinePath.push(pts);
            }
          },
        },
        { renderOptions: { map: this.map, autoViewport: true } }
      ); // 驾车实例
      driving.search(myP1, myP2);
    },
    drawPath() {
      let that = this;
      if (this.canvasLayer == null) {
        this.canvasLayer = new CanvasLayer({
          map: that.map,
          update: that.mapLine,
        });
      }
      this.canvasLayer.draw();
    },
    mapLine() {
      let that = this;
      const ctx = this.canvasLayer.canvas.getContext("2d"); // getContext() 方法返回一个用于在画布上绘图的环境。(创建画布环境，用于图案绘制)
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clearRect() 方法擦除了指定的矩形，并且用一个透明的颜色填充它。(清除画布)
      var points = [
        { lng: 116.404, lat: 39.915 },
        { lng: 116.405, lat: 39.92 },
        { lng: 116.423493, lat: 39.907445 },
      ];
      // 绘制颜色轨迹
      for (let i = 0, len = that.polylinePath.length; i < len - 1; i += 1) {
        // pointToPixel({lng,lat})将经纬度转化为坐标
        const pixel = that.map.pointToPixel(that.polylinePath[i]);
        const nextPixel = that.map.pointToPixel(that.polylinePath[i + 1]);

        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        ctx.lineTo(nextPixel.x, nextPixel.y);
        ctx.lineCap = "round"; // 绘制圆形的结束线帽 (线类型)例：'square'、'round'
        ctx.lineWidth = 4; // 绘制宽度
        // createLinearGradient() 方法创建线性的渐变对象。需要四个参数 起点坐标和终点坐标进行渐变绘制
        const grd = ctx.createLinearGradient(
          pixel.x,
          pixel.y,
          nextPixel.x,
          nextPixel.y
        );
        grd.addColorStop(0, "rgba(75,234,255,1)");
        grd.addColorStop(1, "rgba(75,234,255,1)");

        ctx.strokeStyle = grd; // strokeStyle 设置渐变颜色。
        ctx.stroke(); // stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。
      }
    },
    // 根据鼠标滚轮缩放确定地图缩放级别
    onZoomend({ target }) {
      this.zoom = target.getZoom();
    },
    getStatus(data) {
      let status = 1;
      if (data.onlineStatus === 1) {
        if (data.alarmStatus === 0) {
          status = 1;
        } else {
          status = 2;
        }
      }
      if (data.onlineStatus === 2) {
        status = 3;
      }
      if (data.onlineStatus === 3) {
        status = 4;
      }
      return status;
    },
    _getInfo() {
      return getAmbientMonitoringMap({}).then(async (res) => {
        if (res.code === "200") {
          this.allPoint = await Promise.all(
            res.data.map(async (data) => {
              // 等待异步操作完成，返回执行结果
              const status = this.getStatus(data);
              // const infoData = await this._getBriefInfo(data);
              return {
                ...data,
                // ...infoData,
                status,
                center: {
                  lng: +data.longitude,
                  lat: +data.latitude,
                },
              };
            })
          );
          return this.allPoint;
        }
      });
    },
    _getBriefInfo(item) {
      if (this.info[item.serialNumber]) return this.info[item.serialNumber];
      return getAmbientMonitoringDtl(item.serialNumber).then((res) => {
        if (res.code === "200") {
          // const status = this.getStatus(res.data);
          this.info[item.serialNumber] = {
            ...item,
            ...res.data,
          };
          return this.info[item.serialNumber];
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.warm-map-box {
  height: 100%;
  width: 100%;
  position: relative;
  .left-info {
    position: absolute;
    left: 20px;
    top: 2%;
    z-index: 11;
  }
  .bottom-table {
    background-image: url(../images/border_2.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: calc(100% - 473px);
    // height: calc(100% - 665px);
    height: 30%;
    padding: 22px 22px 0 22px;
    margin-top: 15px;
    position: absolute;
    bottom: 2%;
  }
}
.map {
  width: 100%;
  height: 100%;
}
.bm-view {
  width: 100%;
  height: 100%;
  // height: 800px;
  position: relative;
  visibility: hidden;
  &.readyMap {
    visibility: visible;
  }
  .tipIcon {
    display: flex;
    position: absolute;
    bottom: 1%;
    right: 499px;
    margin: 0 0 20px 20px;
    .normal {
      margin-right: 20px;
    }
    .normal,
    .alarm {
      img {
        width: 18px;
        height: 29px;
        vertical-align: bottom;
      }
      span {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #fff;
        margin-right: 10px;
      }
    }
  }
}
.position-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
.right-chart {
  height: 96%;
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 11;
}
</style>
