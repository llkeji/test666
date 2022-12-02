import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Welcome from './components/welcome.vue'
import Home from './views/home.vue'
import Users from './components/users.vue'
import Rights from './components/rights.vue'
import Roles from './components/roles.vue'
import Categories from './components/categories.vue'
import goods from './components/goods.vue'
import reports from './components/reports.vue'
import params from './components/params.vue'
import orders from './components/orders.vue'

// 角色列表练习
// import roles1 from './components/roles1.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      meta:{title:'登录页'},
    },
    {
      path: '/',
      component: Home,
      meta:{title:'首页'},
      children: [
        // 欢迎页
        {
          path: '/',
          component: Welcome,
          meta:{title:'欢迎登录'},
        },
        // 用户管理模块
        {
          path: '/users',
          component: Users,
          meta:{title:'用户列表'},
        },
        // 权限管理模块
        {
          path: '/rights',
          component: Rights,
          meta:{title:'权限列表'},
        },
        {
          path: '/roles',
          component: Roles,
          meta:{title:'角色列表'},
          // component: roles1
        },
        // 商品管理模块
        {
          path: '/categories',
          component: Categories,
          meta:{title:'商品分类'},
        },
        {
          path: '/goods',
          component: goods,
          meta:{title:'商品列表'},
        },
        {
          path: '/params',
          component: params,
          meta:{title:'分类参数'},
        },
        
        // 订单管理模块
        {
          path: '/orders',
          component: orders,
          meta:{title:'订单管理'},
        },
        // 数据统计模块
        {
          path: '/reports',
          component: reports,
          meta:{title:'数据报表'},
        },
      ]
    }
  ]
})


// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.path == '/login') return next()
  var token = window.sessionStorage.getItem('token')
  if (!token) next('/login')
  next()
})

export default router








