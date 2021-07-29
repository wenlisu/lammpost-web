import api from 'util/axios'

/** 增加led策略 */
export const ledAdd = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/led/add`,
    data
  })
}
/** 删除组策略 */
export const ledDelete = (id) => {
  return api.request({
    method: 'POST',
    url: `/api/led/delete?id=${id}`
  })
}
/** 查看策略详情 */
export const ledDetail = (groupNo) => {
  return api.request({
    method: 'GET',
    url: `/api/led/detail?groupNo=${groupNo}`
  })
}
/** 智慧发布详情界面 */
export const publishDetail = (groupNo) => {
  return api.request({
    method: 'GET',
    url: `/api/led/publish/detail`
  })
}

/** 分页查询组策略 */
export const ledGet = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/led/get`,
    data
  })
}
/** 增加led策略 */
export const ledUpdate = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/led/update`,
    data
  })
}