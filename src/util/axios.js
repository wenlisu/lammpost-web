import axios from 'axios'
import { baseURL, urlApi } from '@/config'
import { Notification, MessageBox } from 'element-ui';
import promise from 'es6-promise';
import store from '@/store'
import router from '@/router';
import { getLocal } from 'util/tool';
const qs = require('qs');
promise.polyfill();

// const urlApi = {
//   'development': Config.baseURL.dev,
//   'production': Config.baseURL.pro
// }
// const baseURL = baseURL

class apiRequest {
  // 基础
  constructor () {
    this.baseURL = baseURL // 默认baseURL
  }

  // 默认配置
  getConfigInfo () {
    const config = {
      baseURL: baseURL,
      timeout: 60000,
      // responseType: 'json', // default IE不支持该配置项，启用后返回的数据将没有data字段
      headers: { 'content-type': 'application/json;charset=UTF-8' } // 默认头
    }
    return config
  }

  // 定义拦截器
  interceptor (instance, options) {
    // 请求前
    instance.interceptors.request.use(config => {
      /* if (config.url.indexOf('toilet') > -1) {
        config.baseURL = urlApi.toilt
      } */
      // 判断当前日志是否开启了每隔10分钟刷新(开启关闭全局加载样式)
      if (getLocal('refreshLog') && config.url === '/api/gtwAuditLog/list' && store.state.openPage !== 'systemLog') {
        store.commit('set_loadingCont', false)
      } else {
        // 全局loading....
        store.commit('set_loadingCont', true)
      }

      return config
    }, err => {
      // 关闭全局loading...
      store.commit('set_loadingCont', false)
      return new Promise.reject(err)
    })

    // 响应后
    instance.interceptors.response.use(res => {
      // 关闭全局loading...
      var time = null
      // clearTimeout(time)
      // time = setTimeout(() => {
      //     store.commit('set_loadingCont', false)
      // }, 350);
      store.commit('set_loadingCont', false)
      if (res.data.code == '200') {
        return res.data
      } else if (router.currentRoute.name == 'newToiltDetail' || router.currentRoute.name == 'newToiltMap' || router.currentRoute.name == 'toiltMap' || router.currentRoute.name == 'toiltDetail') {
        // 当进入页面为公厕时，暂不有任何操作
      } else if (res.data.code === '1000') { // 登陆超时,需要重新登陆
        MessageBox.alert('用户登陆超时', '警告', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            // 清空登陆数据
            store.commit('user/outUserLogin')
            router.push({
              name: 'login'
            })
          }
        });
      } else if (options.type === 1) {
        return res;
      } else {
        Notification.error({
          title: '失败',
          message: res.data.message,
          position: 'bottom-right'
        });
        return res.data
      }
    }, err => {
      Notification.error({
        title: '失败',
        message: err.error,
        position: 'bottom-right'
      });
      // 关闭全局loading...
      store.commit('set_loadingCont', false)
      return new Promise.reject(err)
    })
  }

  // 请求创建
  request (options) {
    const instance = axios.create();
    const appCode = store.state.appCodes.appCode;
    if (options.method.toUpperCase() === 'POST') {
      if (typeof (options.data) === 'object') {
        if ('pageNo' in options.data) {
          options.data = {
            ...options.data,
            data: {
              ...options.data.data,
              appCode: appCode
            }
          }
        } else {
          options.data = {
            ...options.data,
            appCode: appCode
          }
        }
      } else {
        options.data = qs.stringify({
          ...qs.parse(options.data),
          appCode: appCode
        });
      }
    } else {
      if (options.url.indexOf('?') > -1) {
        options.url = options.url + `&appCode=${appCode}`
      } else {
        options.url = options.url + `?appCode=${appCode}`
      }
    }
    options = Object.assign(
      this.getConfigInfo(),
      options
    )
    this.interceptor(instance, options)
    return instance(options)
  }
}




const apiCreat = new apiRequest()

export default apiCreat



