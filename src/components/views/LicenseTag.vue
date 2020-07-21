<template>
  <div class="license-tag">
    <!-- <a :href="link" target="_blank">
      <span class="name">License</span>
      <span class="type">{{type}}</span>
    </a> -->
    <!-- <h3>评论</h3>
     <iv-input style="margin-top:15px" @on-focus="onFocus" v-model="content" type="textarea" :rows="4" :placeholder="token?'请输入评论内容':'登录后即可评论'" />
    <div class="commitContent"><iv-button @click="commitContent">提交评论</iv-button></div>
    <Tabs value="name1" class="newcontent">
        <TabPane :label="'最新评论('+total+')'" name="name1">
          
          <div v-for="(item, index) in contentList" :key="index">
            <div class="content">{{item.content}}</div>
            <div style="display:flex">
              <div class="username">用戶 {{item.username}}</div>
            <div class="contentTime">{{item.createTime}}</div>

            </div>
            
          </div>
          
          </TabPane>
    </Tabs> -->
  </div>
</template>

<script type="text/ecmascript-6">
import bus from '@/utils/bus'
import {IsPC}  from '@/utils/index'
import {Tabs,TabPane} from 'iview'
export default {
  props: {
    link: {
      default: 'https://creativecommons.org/licenses/by-sa/4.0/deed.zh'
    },
    type: {
      default: 'CC BY-SA 4.0'
    }
  },
  components:{
Tabs,TabPane
  },
  data() {
    return {
      content:'',
      total:0,
      contentList:[]
    }
  },
  computed:{
    token(){
      return this.$store.getters.token
    }
  },
  methods: {
    onFocus(){
      // this.$Modal.warning({
      //   title:'提示'
      // })
      if(!this.token){
      
    if(IsPC()){
      bus.$emit('openLogin')
    }else{
      this.$router.push({
       name:'mobileLogin',
     
     })
    }

      }
    },
    commitContent(){
       if(!this.token){
         if(IsPC()){
      bus.$emit('openLogin')
    }else{
      this.$router.push({
       name:'mobileLogin',
     
     })
    }
      
      }else{
        if(this.content.trim()==''){
        this.$Message.warning('未输入评论内容')
     return;
        }
        this.$http({
        url: this.$http.adornUrl("/comment/portal"),
        method: "post",
        headers:{ authorization:"Bearer " + localStorage.getItem('token')
        },
        data: {
          articleId:this.$route.params.articleId,
          content:this.content
        }
      }).then(({data})=>{
        console.log(data)
        this.$Message.success('评论成功')
        this.content=''
      this.getContentList()

      })
      }
    },
    getContentList(){
      this.$http({
        url: this.$http.adornUrl("/comment/portal"),
        method: "get",
        params:{
          articleId:this.$route.params.articleId,
          size:20
        }
      }).then(({data})=>{
        console.log(data,'评论列表')
        this.total=data.page.total
        this.contentList=data.page.records
      })
    }
  },
  created(){
      console.log(this.token,'token')
      this.getContentList()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  

  .license-tag
    margin 10px 0
    font-size 22px
    .ivu-tabs-bar{
      margin-bottom 0
    }
  h3
    padding:10px 0
  .commitContent
    text-align right
    margin-top 10px
  .newcontent .ivu-tabs-tab
    width 150px
  .contentTime
    text-align right
    flex 1
    font-size 12px
    padding-bottom 10px
    color:#999
    border-bottom 1px solid rgba(51,51,51,0.15)
  .username
    flex 1
    font-size 12px
    padding-bottom 10px
    color:#999
    border-bottom 1px solid rgba(51,51,51,0.15)
  .content
    padding:20px 0
  @media screen and (max-width: 520px) {
        .content {
            font-size: 14px;
        }
    }
  
</style>
