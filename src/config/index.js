import { getLocal, delLocal, saveLocal, hasOneOf } from 'util/tool'
const config = {
  cookieExpires: 1, // token在Cookie中存储的天数，默认1天,
  homeName: getLocal('defaultPage'), // 默认打开的首页的路由name值，默认为index
  // api请求默认前缀
  baseURL: {
    pro: 'https://www.uismp.cn',
    hainanTest: 'http://119.29.183.252:3006',
    hainan: 'http://121.36.36.42:3006',
    // pro: 'http://127.0.0.1:80' // 王鹏本地
    dev: 'http://119.29.183.252:3006', // 测试地址
    toilt: 'http://134.175.65.137:8048', // 测试地址
    pro: 'http://121.36.36.42:3006'
  }
};

export const urlApi = {
  'development': config.baseURL.dev,
  'production': config.baseURL.pro,
  'toilt': config.baseURL.toilt,
  'hainan': config.baseURL.hainan,
  'hainan_test': config.baseURL.hainanTest,
}

export const baseURL = urlApi[process.env.NODE_ENV]

export default config;
