<template>
  <div class="recommend"   v-if="!IsPC()">
   
           
        <ul class="phonefooter">
            <h3><Icon type="star" class="iconstar"></Icon> 推荐阅读</h3>
          <li v-for="recommend in recommendList" :key="recommend.id">
            <a :href="'/' + recommend.urlType + '/' +recommend.linkId">
              <p class="title">{{recommend.title}}</p>
              <!-- <p class="info">
                <span class="time">{{recommend.createTime | socialDate }}</span>
                <span class="likes"><a ><iv-icon type="heart"></iv-icon> {{recommend.likeNum}} </a></span>
                <span class="comments"><a ><iv-icon type="compose"></iv-icon> {{recommend.commentNum}} </a></span>
                <span class="readings"><a ><iv-icon type="eye"></iv-icon> {{recommend.readNum}} </a></span>
              </p> -->
            </a>
          </li>
        </ul>
      </div>
</template>

<script type="text/ecmascript-6">
import {mixin} from '@/utils/index'
import {Icon} from 'iview'
import { IsPC } from "@/utils/index";
export default {
  data () {
    return {
      recommendList: [],
      topRecommend: {}
    }
  },
  mixins: [mixin],
  created () {
    this.listRecommend()
  },
  methods: {
      IsPC,
    listRecommend () {
      this.$http({
        url: this.$http.adornUrl('/operation/recommends'), 
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.recommendList = data.recommendList.slice(0,3)
        }
      })
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .phonefooter
    margin-top 30px
    h3 
        padding 7px 0
        font-family "Microsoft YaHei"
    .title
        padding:2px 10px
        font-size 14px
        color rgb(255, 0, 0)
  .iconstar
    color: red
</style>
