<template>
  <div class="article-page-footer">
     <iv-col :xs="24" :sm="14" :md="14" :lg="14" style="padding-left: 0;padding-right: 0;">
        <p class="operate_info">
          <span class="readings"><a ><iv-icon type="eye"></iv-icon> {{article.readNum}} 阅读</a></span> |
          <span class="likes"><a @click="likePost(article)"><iv-icon type="heart"></iv-icon> {{article.likeNum}} 喜欢</a></span>
        </p>
      </iv-col>
    <license-tag></license-tag>
    <social-section :type="'Article'" :postId="postId"></social-section>
  </div>
</template>

<script type="text/ecmascript-6">
import LicenseTag from '@/components/views/LicenseTag'
import SocialSection from '@/components/views/Comment/SocialSection'

export default {
  components: {
    'license-tag': LicenseTag,
    'social-section': SocialSection,
    
  },
  props: {
    postId: Number,
    article:Object
  },
  methods: {
    likePost (post) {
      this.$http({
        url: this.$http.adornUrl('/article/like/' + post.id),
        method: 'get',
        data: this.$http.adornData()
      }).then(({data}) => {
        if (data && data.code === 200) {
          post.likeNum += 1
          // this.$Message.success('点赞成功')
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
}
</script>
