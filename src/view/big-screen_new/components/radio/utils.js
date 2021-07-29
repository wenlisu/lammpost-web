
/**
 * 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
 * @param {当前扇形起始比例，取值区间 [0, endRatio)} startRatio 
 * @param {当前扇形结束比例，取值区间 (startRatio, 1]} endRatio 
 * @param {是否选中，效果参照二维饼图选中效果（单选）} isSelected 
 * @param {是否放大，效果接近二维饼图高亮（放大）效果} isHovered 
 * @returns 
 */
export const getParametricEquation = (startRatio, endRatio, isSelected, isHovered) => {
  // 计算
  let midRatio = (startRatio + endRatio) / 2;

  let startRadian = startRatio * Math.PI * 2;
  let endRadian = endRatio * Math.PI * 2;
  let midRadian = midRatio * Math.PI * 2;

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  let offsetY = isSelected ? Math.cos(midRadian) * 0.1 : 0;

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1;

  // 返回曲面参数方程
  return {

    u: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 100
    },

    v: {
      min: 0,
      max: Math.PI,
      step: Math.PI / 50
    },

    x: function (u, v) {
      if (midRatio - 0.5 < 0) {
        if (u < startRadian || u > midRadian + Math.PI) {
          tmp = u - Math.PI - midRadian < 0 ? u + Math.PI - midRadian : u - Math.PI - midRadian;
          return offsetX + Math.sin(startRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
        if (u > endRadian && u < midRadian + Math.PI) {
          tmp = midRadian + Math.PI - u;
          return offsetX + Math.sin(endRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
      } else {
        if (u < startRadian && u > midRadian - Math.PI) {
          tmp = u + Math.PI - midRadian;
          return offsetX + Math.sin(startRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
        if (u > endRadian || u < midRadian - Math.PI) {
          tmp = midRadian - Math.PI - u < 0 ? midRadian + Math.PI - u : midRadian - Math.PI - u;
          return offsetX + Math.sin(endRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
      }
      return offsetX + Math.sin(v) * Math.sin(u) * hoverRate;
    },

    y: function (u, v) {
      if (midRatio - 0.5 < 0) {
        if (u < startRadian || u > midRadian + Math.PI) {
          tmp = u - Math.PI - midRadian < 0 ? u + Math.PI - midRadian : u - Math.PI - midRadian;
          return offsetY + Math.cos(startRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
        if (u > endRadian && u < midRadian + Math.PI) {
          tmp = midRadian + Math.PI - u;
          return offsetY + Math.cos(endRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
      } else {
        if (u < startRadian && u > midRadian - Math.PI) {
          tmp = u + Math.PI - midRadian;
          return offsetY + Math.cos(startRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
        if (u > endRadian || u < midRadian - Math.PI) {
          tmp = midRadian - Math.PI - u < 0 ? midRadian + Math.PI - u : midRadian - Math.PI - u;
          return offsetY + Math.cos(endRadian) * tmp / (Math.PI - midRadian + startRadian) * hoverRate;
        }
      }
      return offsetY + Math.sin(v) * Math.cos(u) * hoverRate;
    },

    z: function (u, v) {
      return Math.cos(v) > 0 ? 0.1 : -0.1;
    }
  };
}
/**
 * 
 * @param {饼图数据} pieData 
 * @returns 3D饼图配置项option
 */
export const getPie3D = (pieData) => {

  let series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let legendData = [];

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {

    sumValue += pieData[i].value;

    let seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false
      }
    };

    if (typeof pieData[i].itemStyle != 'undefined') {

      let itemStyle = {};

      typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
      typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;

      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;

    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false);

    startValue = endValue;

    legendData.push(series[i].name);
  }

  // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
  series.push({
    name: 'mouseoutSeries',
    type: 'surface',
    parametric: true,
    wireframe: {
      show: false
    },
    itemStyle: {
      opacity: 0
    },
    parametricEquation: {
      u: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20
      },
      v: {
        min: 0,
        max: Math.PI,
        step: Math.PI / 20
      },
      x: function (u, v) {
        return Math.sin(v) * Math.sin(u) + Math.sin(u);
      },
      y: function (u, v) {
        return Math.sin(v) * Math.cos(u) + Math.cos(u);
      },
      z: function (u, v) {
        return Math.cos(v) > 0 ? 0.1 : -0.1;
      }
    }
  });

  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  let option = {
    //animation: false,
    legend: {
      data: legendData
    },
    tooltip: {
      formatter: params => {
        if (params.seriesName !== 'mouseoutSeries') {
          return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`;
        }
      }
    },
    xAxis3D: {
      min: -1,
      max: 1
    },
    yAxis3D: {
      min: -1,
      max: 1
    },
    zAxis3D: {
      min: -1,
      max: 1
    },
    grid3D: {
      show: false,
      boxHeight: 30,
      //top: '30%',
      bottom: '50%'
    },
    series: series
  };
  return option;
}