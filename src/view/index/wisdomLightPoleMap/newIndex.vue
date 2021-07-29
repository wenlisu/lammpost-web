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
          :allInfo="item"
          ref="layer"
          @getDetail="getAlarmDetail"
        >
        </my-overlay>
        <leftComponent />
        <rightComponent />
        <centerComponent />
      </baidu-map>
    </div>
  </div>
</template>

<script>
import leftComponent from './components/leftComponent';
import rightComponent from './components/rightComponent';
import centerComponent from './components/centerComponent';
import MyOverlay from './components/MyOverlay';
// import { CanvasLayer } from "@/common/js/CanvasLayer";
// import { svgPathCurv } from "@/util/util";
import { getLampBriefInfoList } from '@/api/wisdomLightPole';

// 局部引入百度地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import bmPolyline from "vue-baidu-map/components/overlays/Polyline";
export default {
  components: {
    MyOverlay,
    rightComponent,
    leftComponent,
    centerComponent,
    BaiduMap,
    bmPolyline,
  },
  data () {
    return {
      currentShowIndex: 0,
      myLayer: null,
      infoTimer: null,
      // 每条路上的报警器经纬度及状态
      linePoint: [],
      allPoint: [], // 所有报警器的经纬度
      active: true,
      road: [], // 道路的起始点
      polylinePath: [], // 根据起始点获取到道路的所有坐标
      svgPath: [],
      center: {
        lng: 113.270218,
        lat: 23.134245
      },
      zoom: 15,
      baiduMapShow: false,
      map: null,
      BMap: null,
      canvasLayer: null,
      canvasLayerPointer: null
    };
  },
  created () {
    this.getDataAllList();
  },
  methods: {
    async handler ({ BMap, map }) {
      this.map = map; // 百度地图实例化对象
      this.BMap = BMap;
      // this.linePoint.map((item) => {
      //   this.allPoint.push(...item);
      //   this.road.push([item[0], item[item.length - 1]]);
      // });
      const infos = await this.getDataAllList();
      if (infos.length > 0) {
        let startP = infos[0].center;
        let endP = infos[infos.length - 1].center;
        this.getPoints(startP, endP);
      }
      setTimeout(() => {
        map.setMapStyleV2({
          styleId: '02b81ab7cd95f6aece86c3500bf9b3cf'
        });
        // 插入渐变
        let mapE = document.getElementsByClassName('bm-view')[0];
        let svgE = mapE.getElementsByTagName('svg');
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
            item.insertAdjacentHTML('afterBegin', def);
          });
        }
        // 初始化第一个信息弹框
        this.myLayer = this.$refs.layer;
        if (this.myLayer && this.myLayer[0]) {
          this.myLayer[0].show = true;
          this.map.centerAndZoom(
            new BMap.Point(
              this.myLayer[0].position.lng,
              this.myLayer[0].position.lat
            ),
            this.zoom
          );
          this.center.lng = this.myLayer[0].position.lng;
          this.center.lat = this.myLayer[0].position.lat;
          this.currentShowIndex = 1;
          this.setInfoInterval();
        }
        this.baiduMapShow = true;
      }, 550);
    },
    setInfoInterval () {
      let myLayer = this.$refs.layer;
      this.myLayer = myLayer;
      let i = this.currentShowIndex;
      if (myLayer.length > 0) {
        this.infoTimer = setInterval(() => {
          // debugger
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
              i == myLayer.length - 1 ? (i = 0) : i++;
            }
          }
        }, 5000);
      }
    },
    // 点击切换信息并重新设置定时器
    getAlarmDetail (params) {
      this.infoTimer && clearInterval(this.infoTimer);
      this.myLayer.map((item) => {
        item.show = false;
      });
      this.setInfoInterval();
    },
    // 获取地图wifi设备信息
    getDataAllList () {
      return getLampBriefInfoList().then(async (res) => {
        if (res.code === '200') {
          const { data } = res;
          this.allPoint = await Promise.all(
            data.map((item) => {
              return {
                center: {
                  lng: item.longitude,
                  lat: item.latitude
                },
                ...item
              };
            })
          );
          return this.allPoint;
        }
      });
    },
    // 根据道路起始点获取道路所有坐标点
    getPoints (start, end) {
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
          }
        },
        { renderOptions: { map: this.map, autoViewport: true } }
      ); // 驾车实例
      driving.search(myP1, myP2);
    },
    drawPath () {
      let that = this;
      if (this.canvasLayer == null) {
        this.canvasLayer = new CanvasLayer({
          map: that.map,
          update: that.mapLine
        });
      }
      this.canvasLayer.draw();
    },
    mapLine () {
      let that = this;
      const ctx = this.canvasLayer.canvas.getContext('2d'); // getContext() 方法返回一个用于在画布上绘图的环境。(创建画布环境，用于图案绘制)
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clearRect() 方法擦除了指定的矩形，并且用一个透明的颜色填充它。(清除画布)
      console.log(ctx);
      var points = [
        { lng: 116.404, lat: 39.915 },
        { lng: 116.405, lat: 39.92 },
        { lng: 116.423493, lat: 39.907445 }
      ];
      // this.drawPath_2(points, ctx);
      // 绘制颜色轨迹
      for (let i = 0, len = that.polylinePath.length; i < len - 1; i += 1) {
        // pointToPixel({lng,lat})将经纬度转化为坐标
        const pixel = that.map.pointToPixel(that.polylinePath[i]);
        const nextPixel = that.map.pointToPixel(that.polylinePath[i + 1]);

        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        ctx.lineTo(nextPixel.x, nextPixel.y);
        ctx.lineCap = 'round'; // 绘制圆形的结束线帽 (线类型)例：'square'、'round'
        ctx.lineWidth = 8; // 绘制宽度
        // createLinearGradient() 方法创建线性的渐变对象。需要四个参数 起点坐标和终点坐标进行渐变绘制
        const grd = ctx.createLinearGradient(
          pixel.x,
          pixel.y,
          nextPixel.x,
          nextPixel.y
        );
        grd.addColorStop(0, 'rgba(75,234,255,1)');
        grd.addColorStop(1, 'rgba(75,234,255,1)');

        ctx.strokeStyle = grd; // strokeStyle 设置渐变颜色。
        ctx.stroke(); // stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。
      }
    },

    // 贝塞尔曲线方法
    drawPath_2 (path, ctx) {
      var gnt1 = ctx.createLinearGradient(
        path[0].lng,
        path[0].lat,
        path[path.length - 1].lng,
        path[path.length - 1].lat
      ); // 线性渐变的起止坐标
      gnt1.addColorStop(0, '#744dfe');
      gnt1.addColorStop(1, '#f65ca4');
      ctx.strokeStyle = gnt1;
      var Vector2 = function (lng, lat) {
        this.lng = lng;
        this.lat = lat;
      };
      // Vector2，一般用来表示向量，但有的时候也用来当作点来进行一计算。
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
        }
      };
      /**
       * length求向量长度
       * normalize转单位向量
       * add向量叠加
       * multiply向量翻倍
       * dot内积
       * angle方法用来求两个向量的夹角
       **/
      function getControlPoint (path) {
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
          ctx.fillStyle = '#a252de';
          ctx.fill();
          ctx.closePath();
        }
        if (i == points.length - 1) {
          ctx.beginPath();
          ctx.arc(points[i].lng, points[i].lat, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#f65ca4';
          ctx.fill();
          ctx.closePath();
        }
      }
    },
    // 根据鼠标滚轮缩放确定地图缩放级别
    onZoomend ({ target }) {
      this.zoom = target.getZoom();
    },
    updatePolylinePath (e) {
      this.polylinePath = e.target.getPath();
    },
    addPolylinePoint () {
      this.polylinePath.push({ lng: 116.404, lat: 39.915 });
    }
  },
  destroyed () {
    this.infoTimer && clearInterval(this.infoTimer);
  }
};
</script>

<style scoped lang="less">
.warm-map-box {
  height: 100%;
  width: 100%;
  position: relative;
  .left-info {
    position: absolute;
    left: 0;
    top: 2%;
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
}
</style>
