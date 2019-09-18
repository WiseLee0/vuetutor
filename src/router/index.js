import Vue from 'vue'
import Router from 'vue-router'

const Hot = (resolve) => {
  import('components/hot/index').then((module) => {
    resolve(module)
  })
}

const New = (resolve) => {
  import('components/new/index').then((module) => {
    resolve(module)
  })
}

const Wait = (resolve) => {
  import('components/wait/index').then((module) => {
    resolve(module)
  })
}

const Detail = (resolve) => {
  import('components/detail/index').then((module) => {
    resolve(module)
  })
}


const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/hot'
    }, {
      path: '/hot',
      component: Hot
    },
    {
      path: '/new',
      component: New
    },
    {
      path: '/wait',
      component: Wait
    },
    {
      path: '/detail/:id',
      component: Detail
    }
  ]
})