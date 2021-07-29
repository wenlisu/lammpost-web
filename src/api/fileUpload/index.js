import api from 'util/axios'

/** 获取文件信息 */
export const getFileInfo = (fileCode) => {
  return api.request({
    method: 'POST',
    url: `/api/fileupload/getFileInfo?fileCode=${fileCode}`
  })
}
