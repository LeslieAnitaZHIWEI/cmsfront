<template>
  <div class="simple-header">
    <transition name="slide-fade">
      <div id="mobile-bar" :class="IsPC()?'':'redtitle'" v-show="show" >
        <!-- <a class="menu-button" ref="menubutton"></a> -->
        <a class="menu-button" @click="myInfo"><Icon size="20" color="white" type="md-contact" /></a>
        <!-- <router-link class="logo" to="/"></router-link> -->
        果子体育
      </div>
    </transition>
    <transition name="slide-fade">
      <div id="header"  v-show="show">
    <router-link id="logo" to="/">
      <img src="../../../assets/logo.png">
      <span class="title">果子体育</span>
      <!-- <span class="motto">make progress every day~</span> -->
      
    </router-link>
    <div id="guoziTitle">
         <a :class='{active:activeName=="index"}' data-level="1" @click="choseLevel('', $event)">首页</a>
         <a :class='{active:activeName=="recomand"}' data-level="0" @click="goRecommand('', $event)">推荐</a>
        <a :class='{active:activeName==category_level1.name}' :id="'id' + category_level1.id" :data-level="category_level1.rank"
           @click="choseLevel(category_level1, $event)"
           v-for="category_level1 in this.categoryList" :key="category_level1.id">{{ category_level1.name }}</a>
      </div>
    <ul id="nav">
      <li>
        <form id="search-form" action="/articles/search">
      <span class="algolia-autocomplete" style="position: relative; display: inline-block; direction: ltr;">
        <input
        type="text" id="search-query-nav" class="search-query st-default-search-input aa-input" name="keywords" v-model="keywords" @keyup.enter="submit"
        autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false"
        aria-owns="algolia-autocomplete-listbox-0" dir="auto" style="position: relative; vertical-align: top;">
        <pre
        aria-hidden="true"
        style="position: absolute; visibility: hidden; white-space: pre; font-family: system-ui; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; word-spacing: 0px; letter-spacing: normal; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre>
        <span
        class="aa-dropdown-menu" role="listbox" id="algolia-autocomplete-listbox-0"
        style="position: absolute; top: 100%; z-index: 100; display: none; left: 0px; right: auto;"><div
        class="aa-dataset-1"></div></span></span>
        </form>
      </li>
      <li v-if="userName==''"><a @click="openLogin(1)">登录</a> </li>
      <li v-if="userName==''"><a @click="openLogin(2)">注册</a> </li>
      <li v-else>
        <Dropdown >
        <a href="javascript:void(0)">
            {{userName}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem><div @click="logout">退出</div> </DropdownItem>
        </DropdownMenu>
    </Dropdown>
      </li>
      <!-- <li><a href="/articles" class="nav-link contribute">文章</a></li>
      <li><a href="/books" class="nav-link contribute">阅读</a></li>
      <li><a href="/timeline" class="nav-link contribute">时光轴</a></li>
      <li><a href="/article/1" class="nav-link contribute">关于</a></li> -->
    </ul>
    </div>
    </transition>
    <Modal
        v-model="loginModalVis"
        title=""
        :footer-hide="true"
        :width="720"
        :mask-closable="false"
        >
        <p><Login ref="login" @closeModal="getUserInfo"/></p>
        
    </Modal>
    <sidebar ref="sidebar" :articleCategoryList="articleCategoryList" :bookCategoryList="bookCategoryList"></sidebar>
  </div>

</template>

<script type="text/ecmascript-6">
import SideBar from "@/components/header/SimpleHeader/SideBar";
import { treeDataTranslate } from "@/utils";
import bus from "@/utils/bus";
import merge from "webpack-merge";
import {Modal,Dropdown,DropdownItem,DropdownMenu,Icon} from 'iview'
import Vue from 'vue'
import Login from "@/components/Login";
import { IsPC } from "@/utils/index";

export default {
  components: {
    sidebar: SideBar,
    Login,
    Modal,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Icon
  },
  data() {
    return {
      show: true,
      articleCategoryList: [],
      bookCategoryList: [],
      keywords: "",
      categoryList: [],
      activeName: "index",
      loginModalVis:false,
      userName:''
    };
  },
  created() {
    this.listCategory();
    this.keywords = this.$route.query.keywords;
    this.getUserInfo() 
          this.$store.commit('user/returnToken')

    bus.$on('openLogin',() => {
    this.loginModalVis=true
})
  },
  computed:{
    token(){
      return this.$store.getters.token
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.initMobileMenu();
    });
    // 给页面绑定滑轮滚动事件
    if (document.addEventListener) {
      // firefox
      document.addEventListener("DOMMouseScroll", this.watchScroll, false);
    }
    // 滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = this.watchScroll;
  },
  methods: {
    IsPC,
    initMobileMenu() {
      // 显示手机端的菜单
      var sidebar = this.$refs.sidebar;
      // this.$refs.menubutton.addEventListener("click", ()=> {
        // sidebar.toggleSideBar();
        // this.$router.go(-1)
      // });
    },
    watchScroll(e) {
      e = e || window.event;
      if (e.wheelDelta) {
        if (e.wheelDelta > 0 && this.show === false) {
          // 当滑轮向上滚动
          this.show = true;
        }
        if (e.wheelDelta < 0 && this.show === true) {
          // 当滑轮向下滚动
          this.show = false;
        }
      } else if (e.detail) {
        if (e.detail < 0 && this.show === false) {
          // 当滑轮向上滚动
          this.show = true;
        }
        if (e.detail > 0 && this.show === true) {
          // 当滑轮向下滚动
          this.show = false;
        }
      }
    },
    listCategory() {
      this.$http({
        url: this.$http.adornUrl("/operation/categories"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.categoryList = treeDataTranslate(data.categoryList);

          data.categoryList.forEach(category => {
            if (category.type === 0) {
              this.articleCategoryList.push(category);
            } else if (category.type === 1) {
              this.bookCategoryList.push(category);
            }
          });
          this.articleCategoryList = treeDataTranslate(
            this.articleCategoryList
          );
          this.bookCategoryList = treeDataTranslate(this.bookCategoryList);
        }
      });
    },
    choseLevel(category, event) {
      // 更新子菜单
      this.$router.push({
        name: "articles",
        query: merge(this.$route.query, {
          categoryId: category.id,
          recomand: ""
        })
      });
      bus.$emit("choselevel", { category, event });
    },
    goRecommand(category, event) {
      bus.$emit("choselevel", { category, event });

      this.$router.push({
        name: "articles",
        query: merge(this.$route.query, { recomand: true })
      });
    },
    openLogin(num){
      if(num==1){
      this.loginModalVis=true

      }else{
      this.loginModalVis=true
      this.$refs.login.tabsClick('name2')
      }
    },
     getUserInfo () {
       this.loginModalVis=false
      this.$http({
        url: this.$http.adornUrl('/admin/sys/user/info'),
        method: 'get',
        params: this.$http.adornParams(),
        headers:{
          authorization:"Bearer " + Vue.cookie.get('token')
        }
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.userId = data.user.userId
          this.userName = data.user.username
        }
      }).catch(({data})=>{
         this.userName =''
          this.$store.commit('user/clearToken')

      })
    },
    logout(){
      this.$Modal.confirm({
        title:'提示',
        content:'确认要退出吗',
        onOk: () => {
          this.$store.commit('user/clearToken')
                        this.getUserInfo()
                    },
      })
    },
    myInfo(){
      if(this.token){
this.$router.push({
       name:'userInfo',
     
     })
      }else{
        this.$router.push({
       name:'mobileLogin',
     
     })
      }
    }
  },
  
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/header.styl";
   // 添加导航栏显示动画
  .slide-fade-enter-active ,.slide-fade-leave-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-to ,.slide-fade-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(-70px);
    opacity: 0;
  }
  #guoziTitle{
display:inline-block;
margin-left :30px;
.active{
  color:#57a3f3
}
a{
  
  padding:20px
}

  }
  .ivu-dropdown-menu{
    line-height :10px
  }
  #mobile-bar
    line-height 70px
    font-size 22px
    
    background  #ee1a1a
    text-align center
    color white
    font-weight bold
  
</style>
