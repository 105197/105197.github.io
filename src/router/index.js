import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('@/components/search/search').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('@/components/singer/singer').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('@/components/rank/rank').then((module) => {
    resolve(module)
  })
}
const Tab = (resolve) => {
  import('@/components/tab/tab').then((module) => {
    resolve(module)
  })
}
const Disc = (resolve) => {
  import('@/components/disc/disc').then((module) => {
    resolve(module)
  })
}
const Toplist = (resolve) => {
  import('@/components/toplist/toplist').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('@/components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('@/components/user-center/user-center').then((module) => {
    resolve(module)
  })
}
export default new Router({
  routes: [
    {
      path: '/',
      component: Recommend
    }, {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: Disc
      }]
    }, {
      path: '/search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    }, {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: Toplist
      }]
    }, {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    }, {
      path: '/tab',
      component: Tab
    }, {
      path: '/user',
      component: UserCenter
    }
  ]
})
