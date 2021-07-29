import Config from '@/config'
import routes from './routers.js'
import { adminRoute } from './adminRoutes'
import { getLocal, delLocal, saveLocal, hasOneOf } from 'util/tool'
import { creatMenuByRouters } from 'util/util'
import store from '@/store'
// 重写路由的push方法
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject);
  return routerPush.call(this, location);
};

// Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  routes: routes
})

const router = createRouter()

let meanOperation, whiteRouterList, defaultPage, defaultPageName; // 用户权限 && 白名单
let unload = false;

router.beforeEach(async (to, from, next) => {
  // alert(to.name + ' ' + to.path)
  const userInfo = store.state.user.username;
  store.commit('set_loadingCont', true);
  if (!userInfo) {
    // if (to.name == 'newToiltDetail' || to.name == 'newToiltMap') {
    //   // 未登录时也可以进入公厕对应的两个页面
    //   next()
    // }
    delLocal('menuTags') // page
    delLocal('whiteRouterList') // 可访问页面白名单
    delLocal('meanOperation') // 当前页面权限
  } else {
    if (!store.state.addRoutes.length) {
      const asyncRouter = await import('./adminRoutes')
      router.addRoutes(asyncRouter.default)
      router.options.routes = [...router.options.routes, ...asyncRouter.default]
      store.commit('set_addRoutes', router.options.routes);
    }
    meanOperation = getLocal('meanOperation') // 用户权限
    whiteRouterList = getLocal('whiteRouterList') // 白名单

    let menuList = creatMenuByRouters(router.options.routes, store.state.whiteRouterList, store.state.meanOperation)
    let frontPage = menuList.filter(
      (ls) => ls.name.indexOf("admin") === -1
    );
    if(frontPage.length) {
      defaultPage = frontPage.find(item => { 
        return item.name !== "bigScreenNew" && item.name !=="bigScreen" && item.name !=="wisdomApplication" && item.name !== "toiltDetail"
      })
    }
    defaultPageName = defaultPage && defaultPage.children && defaultPage.children[0].name
    Config.homeName = defaultPageName
    saveLocal('defaultPageName', defaultPageName)
  }

  if (userInfo && store.state.meanOperation.size === 0) {
    if (meanOperation) {
      meanOperation.forEach(item => {
        store.commit('set_meanOperation', { key: item[0], value: item[1] })
      })
    }
  }
  const currentRoute = getLocal('currentRoute') || 'normal';
  if ((!userInfo && to.name !== 'login')) {
    // 未登录且要跳转的页面不是登录页
    saveLocal('pushName', to.name);
    if (to.name == 'newToiltDetail' || to.name == 'newToiltMap' || to.name == 'toiltMap' || to.name == 'toiltDetail') {
      // 未登录时也可以进入公厕对应的两个页面
      next()
    } else {
      next({
        name: 'login' // 跳转到登录页
      })
    }
    // } else if ((!userInfo && to.name === 'login') || to.name === 'newToiltDetail') {
  } else if ((!userInfo && to.name === 'login')) {
    // 未登陆且要跳 转的页面是登录页
    // if (to.name === 'login' && from.name === 'bigScreen') {
    //   next({
    //     name: 'login' // 跳转到登录页
    //   })
    // } else {
    next() // 跳转
    // }
  } else if(userInfo && to.path == "/") {
    // 重定向首页
    next({
      name: Config.homeName
    })
  }else if (userInfo && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    if (meanOperation && whiteRouterList) {
      // 已有权限表跟可访问的白名单
      next({
        name: Config.homeName
      })
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then(res => {
        next({
          name: Config.homeName // 跳转到homeName页
        })
      })
    }

    store.commit('set_openPage', Config.homeName)
  } else if(to.name == null && to.path) {
    // 在地址栏直接输入url时，to.name会等于null
    if (meanOperation && whiteRouterList) {
      const toName = to.path.split('/')[to.path.split('/').length - 1];
      // console.log(toName, to);
      if (whiteRouterList.some(name => name === toName)) {
        const openPage = getLocal('openPage');
        toName == Config.homeName ? next({ name: Config.homeName }) : next(to.path)
        store.commit('set_openPage', toName)
        const html = document.getElementsByTagName('html');
        if (toName === 'monitorMap' || toName === 'monitorList') {
          html[0].style.minWidth = 'auto';
        } else {
          html[0].style.minWidth = '1200px';
        }
      } else {
        next({ name: Config.homeName })
      }
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then(res => {
        next({ path: to.path })
      })
    }
  }else {
    if (meanOperation && whiteRouterList) {
      const toName = to.name;
      if (whiteRouterList.some(name => name === toName)) {
        const openPage = getLocal('openPage');
        next()
        store.commit('set_openPage', toName)
        const html = document.getElementsByTagName('html');
        if (toName === 'monitorMap' || toName === 'monitorList') {
          html[0].style.minWidth = 'auto';
        } else {
          html[0].style.minWidth = '1200px';
        }
      } else {
        next({ name: Config.homeName })
      }
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then(res => {
        next({ path: to.path })
      })
    }
  }
  const isAdmin = window.location.href.indexOf('admin') > -1;
  if (isAdmin) {
    saveLocal('currentRoute', 'admin');
    saveLocal('dynamicMenuList', JSON.stringify(adminRoute))
    store.commit('set_dynamicMenuList', adminRoute)
  } else if ((!isAdmin)) {
    // unload = true;
    saveLocal('currentRoute', 'normal');
    saveLocal('dynamicMenuList', JSON.stringify(routes))
    store.commit('set_dynamicMenuList', routes)
  }
  if ((isAdmin && currentRoute === 'normal') || (!isAdmin && currentRoute !== 'normal')) {
    store.commit('set_menuTagsList', []);
  }
})

router.afterEach((to, from) => {
  store.commit('set_loadingCont', false)
})


export default router
