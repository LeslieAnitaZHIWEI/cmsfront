import Vue from 'vue'
import Router from 'vue-router'
import {LoadingBar} from 'iview'
import Index from '@/components/index/Index'

// 公共区域
// import CommonHeader from '@/components/header/CommonHeader';
import SimpleHeader from '@/components/header/SimpleHeader/SimpleHeader'
import CommonFooter from '@/components/footer/CommonFooter'

// 首页
import HomeContent from '@/components/content/HomeContent'
import ArticleContent from '@/components/content/ArticleContent'
import BookNoteContent from '@/components/content/BookNoteContent'
import BookContent from '@/components/content/BookContent'
import ArticleListContent from '@/components/content/ArticleListContent'
import BookListContent from '@/components/content/BookListContent'
import TimeLineContent from '@/components/content/TimeLineContent'
import SearchResultContent from '@/components/content/SearchResultContent'
import mobileLogin from '@/components/Login/mobile'
import mobileIndex from '@/components/index/mobile'
import userInfo from '@/components/user'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          name: 'index',
          components: {
            header: SimpleHeader,
            content: ArticleListContent,
            footer: CommonFooter
          },
          meta: {
            title: '果子体育'
          }
        },
        {
          path: 'article/:articleId',
          name: 'article',
          components: {
            header: SimpleHeader,
            content: ArticleContent,
            footer: CommonFooter
          }
        },
        {
          path: 'articles',
          name: 'articles',
          components: {
            header: SimpleHeader,
            content: ArticleListContent,
            footer: CommonFooter
          },
          meta: {
            title: '内容列表 | 果子体育'
          }
        },
        {
          path: 'articles/category/:id',
          name: 'articles/category',
          components: {
            header: SimpleHeader,
            content: ArticleListContent,
            footer: CommonFooter
          },
          meta: {
            title: '内容列表 | 果子体育'
          }
        },
        {
          path: 'articles/search',
          name: 'search',
          components: {
            header: SimpleHeader,
            content: SearchResultContent,
            footer: CommonFooter
          },
          meta: {
            title: '内容搜索 | 果子体育'
          }
        },
        {
          path: 'bookNote/:bookNoteId',
          name: 'bookNote',
          components: {
            header: SimpleHeader,
            content: BookNoteContent,
            footer: CommonFooter
          }
        },
        {
          path: 'book/:bookId',
          name: 'book',
          components: {
            header: SimpleHeader,
            content: BookContent,
            footer: CommonFooter
          }
        },
        {
          path: 'books',
          name: 'books',
          components: {
            header: SimpleHeader,
            content: BookListContent,
            footer: CommonFooter
          },
          meta: {
            title: '阅读 | 果子体育'
          }
        },
        {
          path: 'books/category/:id',
          name: 'books/category',
          components: {
            header: SimpleHeader,
            content: BookListContent,
            footer: CommonFooter
          },
          meta: {
            title: '阅读 | 果子体育'
          }
        },
        {
          path: 'timeline',
          name: 'timeline',
          components: {
            header: SimpleHeader,
            content: TimeLineContent,
            footer: CommonFooter
          },
          meta: {
            title: '时间轴 | 果子体育'
          }
        },
        {
          path:'mobileLogin',
          name:'mobileLogin',
          components:{
            header:SimpleHeader,
            content:mobileLogin,
            footer: CommonFooter
            
          },
          meta:{
            title:'登录 | 果子体育'
          }
        },
        {
          path:'mobileIndex',
          name:'mobileIndex',
          components:{
            header:SimpleHeader,
            content:mobileIndex,
            footer: CommonFooter
          }
        },
        {
          path:'userInfo',
          name:'userInfo',
          components:{
            header:SimpleHeader,
            content:userInfo,
            footer: CommonFooter
          }
          
        }
      ]
    }
  ]
})

// 配置加载进度条
LoadingBar.config({
  color: '#5cb85c',
  failedColor: '#f0ad4e',
  height: 2
})

router.beforeEach((to, from, next) => {
  LoadingBar.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

router.afterEach((to, from, next) => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
