// 厕所
import api from 'util/axios'
/** 获取灯杆地图统计数据 */
export const getToiletList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/toilet/toiletList',
    data
  })
}
// 新公厕
export const getNewToiletList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/toilet/newToiletList',
    data
  })
}

// 新对应公厕详情
export const newDevDataList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/toilet/newDevDataList',
    data
  })
}

// 对应公厕详情
export const getDevDataList = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/toilet/devDataList',
    data
  })
}

// 获取指定日期的公厕客流数据
export const getFindByDate = (data) => {
  return api.request({
    method: 'POST',
    url: '/api/toilet/findByDate',
    data
  })
}

// 获取七天内的公厕客流数据
export const getQueryHistoryOneWeek = (toiletId) => {
  return api.request({
    method: 'POST',
    url: `/api/toilet/queryHistoryOneWeek/${toiletId}`
  })
}


// 新公厕列表总览
export const queryNewAllToiletList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/toilet/queryNewAllToiletList`,
    data
  })
}

// 懒加载
export const queryNewCityToiletList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/toilet/queryNewCityToiletList`,
    data
  })
}

export const toiletList = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/toilet/newToiletList`,
    data
  })
}
