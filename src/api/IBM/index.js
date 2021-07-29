import api from 'util/axios'

/** 获取事件列表 */
export const getEvents = (data) => {
  return api.request({
    method: 'POST',
    url: `/api/event/getEvents`,
    data
  })
}
