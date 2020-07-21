<template>
  <div class="mobileI">
    <Carousel id="Carouseltop" v-if="!IsPC()" autoplay  v-model="value1" loop>
        
        <CarouselItem v-for="item in imgUrl" :key="item.id">
      
       <div><img style="width:100%" :src="item.url" alt="" /></div> 
      </CarouselItem>
       
    </Carousel>
    <div  v-if="!IsPC()">
      <Tabs value=""  @on-click="changeCat">
        <TabPane label="推荐" name="">
          <div class="article-list-content">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        

        <div class="layout-left">
          <article-list-header v-if="categoryList.length>0" @filterByMenu="filterByMenu"
            ref="articleHead"
                               @filterByCategory="filterByCategory"
                               :categorys="categoryList"
                               :defaultCategory="selected_category"
                               :mainTitle="'文章列表'" :sub-title="'Articles'" ></article-list-header>
          <article-list-cell v-for="article in articleList" :article="article" :key="article.id"></article-list-cell>
          <browse-more @browseMore="browseMore" :noMoreData="noMoreData"  ref="browseMore"></browse-more>
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
          <recommend></recommend>
          <tag-wall style="margin-top: 15px;"></tag-wall>
        </div>
      </iv-col>
    </iv-row>
  </div>
        </TabPane>
        <TabPane v-for="(item) in categoryList" :key="item.id" :label="item.name" :name="item.id.toString()">
          <div class="article-list-content">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        

        <div class="layout-left">
          <article-list-header v-if="categoryList.length>0" @filterByMenu="filterByMenu"
            ref="articleHead"
                               @filterByCategory="filterByCategory"
                               :categorys="categoryList"
                               :defaultCategory="selected_category"
                               :mainTitle="'文章列表'" :sub-title="'Articles'" ></article-list-header>
          <article-list-cell v-for="article in articleList" :article="article" :key="article.id"></article-list-cell>
          <browse-more @browseMore="browseMore" :noMoreData="noMoreData"  ref="browseMore"></browse-more>
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
          <recommend></recommend>
          <tag-wall style="margin-top: 15px;"></tag-wall>
        </div>
      </iv-col>
    </iv-row>
  </div>
        </TabPane>
        
    </Tabs>
    </div>
    <div class="article-list-content" v-if="IsPC()">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        

        <div class="layout-left">
          <article-list-header v-if="categoryList.length>0" @filterByMenu="filterByMenu"
            ref="articleHead"
                               @filterByCategory="filterByCategory"
                               :categorys="categoryList"
                               :defaultCategory="selected_category"
                               :mainTitle="'文章列表'" :sub-title="'Articles'" ></article-list-header>
          <article-list-cell v-for="article in articleList" :article="article" :key="article.id"></article-list-cell>
          <browse-more @browseMore="browseMore" :noMoreData="noMoreData"  ref="browseMore"></browse-more>
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
          <recommend></recommend>
          <tag-wall style="margin-top: 15px;"></tag-wall>
        </div>
      </iv-col>
    </iv-row>
  </div>
    <!-- <div  v-if="!IsPC()" class="hot-types"> -->
      <!-- <ul>
       
       <li @click="">
          <section>
            <div class="hot-cz-logo">
              <img :src="le" alt="">
              </div>
               <dl class="info"><dt>推荐</dt>
                </dl>
           </section>
       </li>
       <li>
          <section>
            <div class="hot-cz-logo">
              <img :src="dian" alt="">
              </div>
               <dl class="info"><dt>免费解析</dt>
                </dl>
           </section>
       </li>
        <li>
          <section>
            <div class="hot-cz-logo">
              <img :src="ball" alt="">
              </div>
               <dl class="info"><dt>足球</dt>
                </dl>
           </section>
       </li>
                </ul> -->
                <!-- </div> -->
  
  </div>
</template>

<script type="text/ecmascript-6">
import ArticleListHeader from "@/components/views/Article/ArticleListHeader";
import ArticlePageContent from "@/components/views/Article/ArticlePageContent";
import ArticlePageFooter from "@/components/views/Article/ArticlePageFooter";
import ArticleListCell from "@/components/views/Article/ArticleListCell";
import Recommend from "@/components/views/Recommend";
import TagWall from "@/components/views/TagWall";
import BrowseMore from "@/components/views/BrowseMore";
import merge from "lodash/merge";
import { treeDataTranslate } from "@/utils";
import { DefaultFilterList } from "@/common/js/const";
import { IsPC } from "@/utils/index";
import { Carousel, CarouselItem, Tabs, TabPane } from "iview";
import u24 from "@/assets/u24.png";
import p28 from "@/assets/p28.jpg";
import p32 from "@/assets/p32.jpg";
import ball from "@/assets/ball.png";
import dian from "@/assets/dian.png";
import le from "@/assets/le.png";
export default {
  data() {
    return {
      articleList: [],
      categoryList: [],
      selected_category: this.$route.query.categoryId,
      currentPage: 1,
      pageSize: 15,
      categoryId: this.$route.query.categoryId,
      menuParams: {
        latest: true
      },
      noMoreData: false,
      defaultFilterList: {},
      value1: 1,
      imgUrl: [{ url: u24, id: 7 }, { url: p28, id: 8 }, { url: p32, id: 9 }],
      ball,
      le,
      dian,
      show: true
    };
  },
  created() {
    this.listArticle();
    this.listCategory();
  },
  mounted() {
    console.log(this.$refs);
    if (this.$refs.articleHead) {
      if (this.$route.query.recomand) {
        this.$refs.articleHead.setDefaultCategory(true);
        this.$router.push({
          query: merge(this.$route.query, { recomand: "" })
        });
      } else {
        this.$refs.articleHead.setDefaultCategory(false);

        this.$router.push({
          query: merge(this.$route.query, { recomand: "" })
        });
      }
    }
    var that=this
    
      //需求1：当我们滚动界面的时候，被卷曲的头部超过第二个盒子距离顶部的位置，那么直接给第二个盒子加类名.fixed
      //需求2：当我们滚动界面的时候，被卷曲的头部小于第二个盒子距离顶部的位置，那么直接给第二个盒子取消类名.fixed
      //步骤：
      //1.老三步。
      //2.判断 ，被卷曲的头部的大小
      //3.满足条件添加类，否则删除类

      var top = document.getElementById("Carouseltop");
      var topHeight = top.offsetHeight+175;
      // var nav1 = document.getElementById("Q-nav1");
      var nav1=document.getElementsByClassName('ivu-tabs-nav-scroll')[0]
      console.log(nav1,top,'d')
      var main = document.getElementById("main");

      window.onscroll = ()=> {
        if (that.scroll().top > topHeight) {
          nav1.className += " fixed";
          top.style.marginBottom = nav1.offsetHeight + "px";
        } else {
          nav1.className = "";
          top.style.marginBottom = 0 + "px";
        }
      };

      
    
  },
  watch: {
    "$route.query": function(value) {
      console.log(this.$refs, "query");
      if (this.$refs.articleHead) {
        if (value.recomand) {
          this.$refs.articleHead.setDefaultCategory(true);
          // this.menuParams = { recomand: true,latest: true };
          this.listArticle();
        } else {
          this.menuParams = { latest: true };
          // this.listArticle();

          this.$refs.articleHead.setDefaultCategory(false);
        }
      }
    }
  },
  methods: {
     scroll() {
        // 开始封装自己的scrollTop
        if (window.pageYOffset !== undefined) {
          // ie9+ 高版本浏览器
          // 因为 window.pageYOffset 默认的是  0  所以这里需要判断
          return {
            left: window.pageXOffset,
            top: window.pageYOffset
          };
        } else if (document.compatMode === "CSS1Compat") {
          // 标准浏览器   来判断有没有声明DTD
          return {
            left: document.documentElement.scrollLeft,
            top: document.documentElement.scrollTop
          };
        }
        return {
          // 未声明 DTD
          left: document.body.scrollLeft,
          top: document.body.scrollTop
        };
      },

    IsPC,
    listArticle() {
      let params = {
        categoryId: this.categoryId,
        limit: this.pageSize,
        page: this.currentPage
      };
      var menuParam;
      console.log("走这了吗", this.$route.query);
      if (this.$route.query.recomand) {
        console.log("走这了吗");
        menuParam = { ...this.menuParams, recomand: true };

        params = merge(params, menuParam);
      } else {
        params = merge(params, this.menuParams);
      }
      console.log(params, "?");
      this.$http({
        url: this.$http.adornUrl("/articles"),
        params: this.$http.adornParams(params),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 200) {
          if (data.page.totalPage <= data.page.currPage) {
            this.noMoreData = true;
          } else {
            this.noMoreData = false;
          }
          this.articleList = data.page.list;
        }
      });
    },
    listCategory() {
      let params = {};
      params.type = 0;
      this.$http({
        url: this.$http.adornUrl("/operation/categories"),
        method: "get",
        params: this.$http.adornParams(params)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.categoryList = treeDataTranslate(data.categoryList);
        }
      });
    },
    changeCat(arg) {
      if (arg == 0) {
        this.categoryId = "";
      } else {
        this.categoryId = arg;
      }
      this.currentPage=1
      this.listArticle();
    },
    filterByMenu(params) {
      console.log(this.$route, params, "params1");
      this.resetCurrentPage();
      this.menuParams = params;
      console.log(this.menuParams, "params2");

      this.listArticle();

      console.log(this.menuParam, "params3");
    },
    filterByCategory(params) {
      this.resetCurrentPage();
      this.categoryId = params;
      this.listArticle();
    },
    resetCurrentPage() {
      this.currentPage = 1;
    },
    browseMore() {
      this.currentPage++;
      let params = {
        categoryId: this.categoryId,
        limit: this.pageSize,
        page: this.currentPage
      };
      params = merge(params, this.menuParams);
      this.$http({
        url: this.$http.adornUrl("/articles"),
        params: this.$http.adornParams(params),
        method: "get"
      })
        .then(({ data }) => {
          if (data && data.code === 200) {
            if (data.page.totalPage <= data.page.currPage) {
              this.noMoreData = true;
            } else {
              this.noMoreData = false;
            }
            this.articleList = this.articleList.concat(data.page.list);
          }
        })
        .then(response => {
          this.$refs.browseMore.stopLoading();
        })
        .catch(error => {
          this.$refs.browseMore.stopLoading();
          console.log(error);
        });
    }
  },
  components: {
    "article-list-header": ArticleListHeader,
    "article-page-content": ArticlePageContent,
    "article-page-footer": ArticlePageFooter,
    "article-list-cell": ArticleListCell,
    recommend: Recommend,
    "tag-wall": TagWall,
    "browse-more": BrowseMore,
    CarouselItem,
    Carousel,
    Tabs,
    TabPane
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.fixed{
  position: fixed;
            top: 70px;
            left: 0;
            width:100%;
            z-index :9999;
            background:white
}
.ivu-tabs-nav .ivu-tabs-tab{
  text-align center
}
    body{
      font-family:-apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif!important
    }
   .mobileI .ivu-tabs-nav{
      .ivu-tabs-tab{
     width:100%;
     color:black
     }
      .ivu-tabs-tab-active{
        color:red
      }
     /deep/ .ivu-tabs-tab:hover{
       color:red
     }
     .ivu-tabs-ink-bar{
       background-color:red
     }
     font-family  -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif;
    width:100%;
    display flex
   } 
  .article-list-content
    width auto
    @media only screen and (max-width: 768px)
      margin 5px 5px 10px 5px
    @media screen and (min-width: 768px)
      margin 10px 10px 20px 10px
    @media screen and (min-width: 992px)
      margin 15px 35px 50px 35px
    @media screen and (min-width: 1200px)
      width 1200px
      margin 15px auto 0
      margin-bottom 50px
    .layout-left, .layout-right
      padding 0
      @media only screen and (max-width: 768px)
        padding 0
      @media screen and (min-width: 768px)
        padding 0
      @media screen and (min-width: 992px)
        padding 0 10px
      @media screen and (min-width: 1200px)
        padding 0 10px
  .hot-types
    position: relative;
    width: 100%;
    background: #fff;
    margin: .02rem auto 0;
    ul 
      display flex
      li
        position relative
        width 33%
        section 
          position: relative;
          padding-bottom: 4px;
        .hot-cz-logo
          margin: 10px auto
          position: relative;
          width: 62px;
          height: 62px;
        .info
          text-align: center;
          min-height: 22px;
          dt
            font-size: 14px;
            color: #000;
            line-height: 22px;
            overflow: hidden;
            white-space: nowrap;
            word-break: keep-all;
        img 
          width:100%
          height:100%
          display block
          border-radius 50%

  
</style>
