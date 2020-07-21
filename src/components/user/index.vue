<template>
    <div>
        <Form :model="user" style="margin-top:20px" :label-width="80">
        <FormItem label="用户名">
            {{user.username}}
        </FormItem>
        <FormItem label="手机号">
            {{user.phone}}
        </FormItem>
        </Form>
        <div style="text-align:center">
            <iv-button type="text" @click="()=>this.$router.go(-1)">返回</iv-button>
        </div>
    </div>
</template>
<script>
import {Form,FormItem} from 'iview'
import Vue from 'vue'
export default {
    data() {
        return {
            user:{}
        }
    },
    components:{
Form,FormItem
    },
    created() {
        this.getUserInfo()
    },
    methods: {
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
          this.user = data.user
        }
      }).catch(({data})=>{
          this.$store.commit('user/clearToken')

      })
    },
    },
}
</script>