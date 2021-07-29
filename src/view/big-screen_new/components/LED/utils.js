export const getColor = (color) => {
  return {
    type: 'linear',
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [{
        offset: 0, color: color[0]// 0% 处的颜色
    }, {
        offset: 1, color: color[1] // 100% 处的颜色
    }]
  }
}