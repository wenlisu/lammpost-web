<template>
  <div class="wifi-map-box">
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
          :allInfo="item"
          ref="layer"
          @getDetail="getAlarmDetail"
        >
        </my-overlay>
      </baidu-map>
    </div>
    <div class="bottom-box">
      <div class="tipIcon">
        <div class="open">
          <img src="./images/icon1.png" alt="" srcset="" />
          <span>开启</span>
        </div>
        <div class="close">
          <img src="./images/icon2.png" alt="" srcset="" />
          <span>关闭</span>
        </div>
      </div>
      <div class="bottom-table">
        <div class="left">
          <info />
        </div>
        <div class="center">
          <chart />
        </div>
        <div class="right">
          <rank />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonTitle from "../components/commonTitle";
import info from "./components/newInfo";
import chart from "./components/chart.vue";
import rank from "./components/ranking";
import MyOverlay from "./components/MyOverlay";
// import { CanvasLayer } from "@/common/js/CanvasLayer";
import { queryWifiMapInfo } from "api/wifi";

// 局部引入百度地图
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import bmPolyline from "vue-baidu-map/components/overlays/Polyline";
export default {
  components: {
    MyOverlay,
    commonTitle,
    info,
    chart,
    rank,
    BaiduMap,
    bmPolyline
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
      zoom: 13,
      baiduMapShow: false,
      map: null,
      BMap: null,
      canvasLayer: null,
      canvasLayerPointer: null,
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {});
  },
  destroyed() {
    this.infoTimer && clearTimeout(this.infoTimer)
  },
  methods: {
    async handler({ BMap, map }) {
      this.map = map; //百度地图实例化对象
      this.BMap = BMap;
      const points = await this.getDataAllList();
      setTimeout(() => {
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
        console.log(this.myLayer);
        if (this.myLayer && this.myLayer[0]) {
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
      
      if (points.length > 0) {
        let startP = points[0].center;
        let endP = points[points.length - 1].center;
        this.getPoints(startP, endP);
      }
    },
    // 定时切换信息
    setInfoInterval() {
      let myLayer = this.$refs.layer;
      this.myLayer = myLayer;
      let i = this.currentShowIndex;
      if (myLayer.length) {
        this.infoTimer = setInterval(() => {
          // debugger
          if (myLayer[i]) {
            this.map.centerAndZoom(
              new BMap.Point(myLayer[i].position.lng, myLayer[i].position.lat),
              this.zoom
            );
          }
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
    // 获取地图wifi设备信息
    getDataAllList() {
      let data = {
        data: {},
        pageNo: 0, // 查询的分页页码
        pageSize: 0, // 查询的分页页大小, 默认10
        sorting: "",
      };
      return queryWifiMapInfo(data).then(async(res) => {
        if (res.code === "200") {
          const { data } = res;
          this.allPoint = await Promise.all(data.map((item) => {
            return {
              center: {
                lng: item.longitude,
                lat: item.latitude,
              },
              ...item,
            };
          }));
          return this.allPoint
        }
      });
    },
    // 根据道路起始点获取道路所有坐标点
    getPoints(start, end) {
      let that = this;
      const myP1 = new this.BMap.Point(start.lng, start.lat); //起点
      const myP2 = new this.BMap.Point(end.lng, end.lat); //终点
      let driving = new this.BMap.DrivingRoute(
        this.map,
        {
          onSearchComplete: function (results) {
            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
              let pts = driving.getResults().getPlan(0).getRoute(0).getPath(); //通过驾车实例，获得一系列点的数组
              that.polylinePath.push(pts);
            }
          },
        },
        { renderOptions: { map: this.map, autoViewport: true } }
      ); //驾车实例
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
      console.log(ctx);
      var points = [
        { lng: 116.404, lat: 39.915 },
        { lng: 116.405, lat: 39.92 },
        { lng: 116.423493, lat: 39.907445 },
      ];
      // this.drawPath_2(points, ctx);
      // 绘制颜色轨迹
      for (let i = 0, len = that.polylinePath.length; i < len - 1; i += 1) {
        //pointToPixel({lng,lat})将经纬度转化为坐标
        const pixel = that.map.pointToPixel(that.polylinePath[i]);
        const nextPixel = that.map.pointToPixel(that.polylinePath[i + 1]);

        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        ctx.lineTo(nextPixel.x, nextPixel.y);
        ctx.lineCap = "round"; // 绘制圆形的结束线帽 (线类型)例：'square'、'round'
        ctx.lineWidth = 8; //绘制宽度
        //createLinearGradient() 方法创建线性的渐变对象。需要四个参数 起点坐标和终点坐标进行渐变绘制
        const grd = ctx.createLinearGradient(
          pixel.x,
          pixel.y,
          nextPixel.x,
          nextPixel.y
        );
        grd.addColorStop(0, "rgba(75,234,255,1)");
        grd.addColorStop(1, "rgba(75,234,255,1)");

        ctx.strokeStyle = grd; //strokeStyle 设置渐变颜色。
        ctx.stroke(); // stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。
      }
    },

    // 贝塞尔曲线方法
    drawPath_2(path, ctx) {
      var gnt1 = ctx.createLinearGradient(
        path[0].lng,
        path[0].lat,
        path[path.length - 1].lng,
        path[path.length - 1].lat
      ); //线性渐变的起止坐标
      gnt1.addColorStop(0, "#744dfe");
      gnt1.addColorStop(1, "#f65ca4");
      ctx.strokeStyle = gnt1;
      var Vector2 = function (lng, lat) {
        this.lng = lng;
        this.lat = lat;
      };
      //Vector2，一般用来表示向量，但有的时候也用来当作点来进行一计算。
      Vector2.prototype = {
        length: function () {
          return Math.sqrt(this.lng * this.lng + this.lat * this.lat);
        },
        normalize: function () {
          var inv = 1 / this.length();
          return new Vector2(this.lng * inv, this.lat * inv);
        },
        add: function (v) {
          return new Vector2(this.lng + v.lat, this.lat + v.lat);
        },
        multiply: function (f) {
          return new Vector2(this.lng * f, this.lat * f);
        },
        dot: function (v) {
          return this.lng * v.lng + this.lat * v.lat;
        },
        angle: function (v) {
          return (
            (Math.acos(this.dot(v) / (this.length() * v.length())) * 180) /
            Math.PI
          );
        },
      };
      /**
       * length求向量长度
       * normalize转单位向量
       * add向量叠加
       * multiply向量翻倍
       * dot内积
       * angle方法用来求两个向量的夹角
       **/
      function getControlPoint(path) {
        var rt = 0.3;
        var i = 0,
          count = path.length - 2;
        var arr = [];
        for (; i < count; i++) {
          var a = path[i],
            b = path[i + 1],
            c = path[i + 2];
          var v1 = new Vector2(a.lng - b.lng, a.lat - b.lat);
          var v2 = new Vector2(c.lng - b.lng, c.lat - b.lat);
          var v1Len = v1.length(),
            v2Len = v2.length();
          var centerV = v1.normalize().add(v2.normalize()).normalize();
          var ncp1 = new Vector2(centerV.lat, centerV.lng * -1);
          var ncp2 = new Vector2(centerV.lat * -1, centerV.lng);
          if (ncp1.angle(v1) < 90) {
            var p1 = ncp1.multiply(v1Len * rt).add(b);
            var p2 = ncp2.multiply(v2Len * rt).add(b);
            if (!isNaN(p1.lng) || isNaN(p2.lng)) {
              arr.push(p1, p2);
            }
          } else {
            var p1 = ncp1.multiply(v2Len * rt).add(b);
            var p2 = ncp2.multiply(v1Len * rt).add(b);
            if (!isNaN(p1.lng) || isNaN(p2.lng)) {
              arr.push(p2, p1);
            }
          }
        }
        return arr;
      }

      var point = getControlPoint(path);
      console.log(point);
      var points = path;
      ctx.beginPath();
      var int = 0;
      for (var i = 0; i < points.length; i++) {
        if (i == 0) {
          ctx.moveTo(points[0].lng, points[0].lat);
          ctx.quadraticCurveTo(
            point[0].lng,
            point[0].lat,
            points[1].lng,
            points[1].lat
          );
          int = int + 1;
        } else if (i < points.length - 2) {
          ctx.moveTo(points[i].lng, points[i].lat);
          ctx.bezierCurveTo(
            point[int].lng,
            point[int].lat,
            point[int + 1].lng,
            point[int + 1].lat,
            points[i + 1].lng,
            points[i + 1].lat
          );
          int += 2;
        } else if (i == points.length - 2) {
          ctx.moveTo(
            points[points.length - 2].lng,
            points[points.length - 2].lat
          );
          ctx.quadraticCurveTo(
            point[point.length - 1].lng,
            point[point.length - 1].lat,
            points[points.length - 1].lng,
            points[points.length - 1].lat
          );
        }
      }
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();

      for (i = 0; i < points.length; i++) {
        if (i == 0) {
          ctx.beginPath();
          ctx.arc(points[i].lng, points[i].lat, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#a252de";
          ctx.fill();
          ctx.closePath();
        }
        if (i == points.length - 1) {
          ctx.beginPath();
          ctx.arc(points[i].lng, points[i].lat, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#f65ca4";
          ctx.fill();
          ctx.closePath();
        }
      }
    },
    // 根据鼠标滚轮缩放确定地图缩放级别
    onZoomend({ target }) {
      this.zoom = target.getZoom();
    },
    updatePolylinePath(e) {
      this.polylinePath = e.target.getPath();
    },
    addPolylinePoint() {
      this.polylinePath.push({ lng: 116.404, lat: 39.915 });
    },
    // 计算缩放级别
    getZoom(maxLng, minLng, maxLat, minLat) {
      let zoom = [
        "50",
        "100",
        "200",
        "500",
        "1000",
        "2000",
        "5000",
        "10000",
        "20000",
        "25000",
        "50000",
        "100000",
        "200000",
        "500000",
        "1000000",
        "2000000",
      ]; //级别18到3。
      let pointA = new BMap.Point(maxLng, maxLat); // 创建点坐标A
      let pointB = new BMap.Point(minLng, minLat); // 创建点坐标B
      let distance = map.getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
        }
      }
    },
    // 计算最大经纬度，最小经纬度，中心点，并调用getZoom获取缩放级别
    setZoom() {},
  },
};
</script>

<style scoped lang="less">
.wifi-map-box {
  height: 100%;
  width: 100%;
  position: relative;
  .left-info {
    position: absolute;
    left: 0;
    top: 2%;
    height: 63%;
  }
  .bottom-box {
    width: calc(100% - 20px);
    position: absolute;
    top: auto;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .tipIcon {
    display: flex;
    // position: absolute;
    // bottom: 34%;
    // left: 262px;
    margin: 0 0 20px 0px;
    .open {
      margin-right: 28px;
    }
    .open,
    .close {
      img {
        width: 36px;
        height: 32px;
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
  .bottom-table {
    background-image: url(./images/border_2.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 360px;
    display: flex;
    .left,
    .center,
    .right {
      flex: 1;
      overflow: hidden;
    }
    .left,
    .center {
      margin-right: 60px;
    }
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
    bottom: 34%;
    left: 262px;
    margin: 0 0 20px 20px;
    .normal {
      margin-right: 20px;
    }
    .normal,
    .alarm {
      img {
        width: 20px;
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
}
</style>