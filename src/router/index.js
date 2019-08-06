import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login'
import PassWord from '@/pages/login/passWord'
import Home from '@/pages/home/home'
import Statis from '@/pages/statis/statis'
import StatisList from '@/pages/statis/statisList'
import StatisAppraisal from '@/pages/statis/statisAppraisal'
import Statistenant from '@/pages/statis/statistenant'

import appraisalAdd from '@/pages/appraisal/appraisalAdd'
import AppraisalList from '@/pages/appraisal/appraisalList'
import Evaluate from '@/pages/appraisal/evaluate'

import OrderList from '@/pages/oder/orderList'

import Menu from '@/pages/jurisdiction/menu'
import Role from '@/pages/jurisdiction/role'
import User from '@/pages/jurisdiction/user'

import Carousel from '@/pages/list/carousel'
import Choiceness from '@/pages/list/choiceness'
import Hot from '@/pages/list/hot'
import New from '@/pages/list/new'
import Recommend from '@/pages/list/recommend'

import Type from '@/pages/type/type'
import userList from '@/pages/userList/userList'

import Distribution from '@/pages/distribution/distribution'
import Client from '@/pages/distribution/client'

import feedback from '@/pages/feedback/feedback'

import account from '@/pages/tenacc/account'
import tenant from '@/pages/tenacc/tenant'
import tentantSet from '@/pages/tenacc/tentantSet'

import everydayTest from '@/pages/list/everydayTest'





Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: "login",
    meta: {
      title: '登录'
    },
    component: Login,
  },
  {
    path: '/passWord',
    name: "passWord",
    meta: {
      title: '找回密码'
    },
    component: PassWord,
  }, {
    path: '/home',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    component: Home,
    children: [{
      path: '',
      component: Statis
    }, {
      path: 'statis',
      name: "statis",
      meta: {
        title: '统计',
        requireAuth: true,
      },
      component: Statis
    }, {
      path: 'statisList',
      name: "statisList",
      meta: {
        title: '流量统计',
        requireAuth: true,
      },
      component: StatisList
    }, {
      path: 'statisAppraisal',
      name: "statisAppraisal",
      meta: {
        title: '使用统计',
        requireAuth: true,
      },
      component: StatisAppraisal
    },
    {
      path: 'statistenant',
      name: "statistenant",
      meta: {
        title: '租户统计',
        requireAuth: true,
      },
      component: Statistenant
    },
    {
      path: 'appraisalAdd',
      name: "appraisalAdd",
      meta: {
        title: '新建测评',
        requireAuth: true,
      },
      component: appraisalAdd
    }, {
      path: 'appraisalList',
      name: "appraisalList",
      meta: {
        title: '测评列表',
        requireAuth: true,
      },
      component: AppraisalList
    }, {
      path: 'orderList',
      name: "orderList",
      meta: {
        title: '订单管理',
        requireAuth: true,
      },
      component: OrderList
    }, {
      path: 'menu',
      name: "menu",
      meta: {
        title: '菜单配置',
        requireAuth: true,
      },
      component: Menu
    }, {
      path: 'role',
      name: "role",
      meta: {
        title: '角色管理',
        requireAuth: true,
      },
      component: Role
    }, {
      path: 'user',
      name: "user",
      meta: {
        title: '角色列表',
        requireAuth: true,
      },
      component: User
    }, {
      path: 'carousel',
      name: "carousel",
      meta: {
        title: '轮播列表',
        requireAuth: true,
      },
      component: Carousel
    }, {
      path: 'choiceness',
      name: "choiceness",
      meta: {
        title: '精选列表',
        requireAuth: true,
      },
      component: Choiceness
    }, {
      path: 'hot',
      name: "hot",
      meta: {
        title: '热卖列表',
        requireAuth: true,
      },
      component: Hot
    }, {
      path: 'new',
      name: "new",
      meta: {
        title: '首发列表',
        requireAuth: true,
      },
      component: New
    },{
      path: 'recommend',
      name: "recommend",
      meta: {
        title: '推荐列表',
        requireAuth: true,
      },
      component: Recommend
    },
    
    {
      path: 'type',
      name: "type",
      meta: {
        title: '类型管理',
        requireAuth: true,
      },
      component: Type
    }, {
      path: 'userList',
      name: "userList",
      meta: {
        title: '用户管理',
        requireAuth: true,
      },
      component: userList
    }, {
      path: 'evaluate',
      name: "evaluate",
      meta: {
        title: '评价管理',
        requireAuth: true,
      },
      component: Evaluate
    }, {
      path: 'distribution',
      name: "distribution",
      meta: {
        title: '分销员',
        requireAuth: true,
      },
      component: Distribution
    }, {
      path: 'client',
      name: "client",
      meta: {
        title: '分销员详情',
        requireAuth: true,
      },
      component: Client
    }, {
      path: 'feedback',
      name: "feedback",
      meta: {
        title: '反馈及建议',
        requireAuth: true,
      },
      component: feedback
    },
     {
      path: 'account',
      name: "account",
      meta: {
        title: '账户管理',
        requireAuth: true,
      },
      component: account
    },
     {
      path: 'tenant',
      name: "tenant",
      meta: {
        title: '渠道管理',
        requireAuth: true,
      },
      component: tenant
    },
    {
      path: 'tentantSet',
      name: "tentantSet",
      meta: {
        title: '渠道设置',
        requireAuth: true,
      },
      component: tentantSet
    },
    {
     path: 'everydayTest',
     name: "everydayTest",
     meta: {
       title: '每日一测',
       requireAuth: true,
     },
     component: everydayTest
   }
    ]
  }
  ],
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置 tenant
    return { x: 0, y: 0 }
  },
})
