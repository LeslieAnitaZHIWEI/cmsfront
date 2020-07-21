<template>
  <div>
     <Tabs style="margin-top:10px" :value="tabName" @on-click="tabsClick" :animated="false">
        <TabPane label="登录" name="name1">

 <Form :rules="loginRules"  ref="formLogin" style="margin-top:25px" :model="formLogin" :label-width="40">
        <FormItem label="" prop="username">
            <Input v-model="formLogin.username" placeholder="用户名 / 邮箱 / 手机号" style="width: 300px" />
        </FormItem>
       
        <FormItem label="" prop="password">
            <Input type="password" v-model="formLogin.password"  placeholder="请输入密码"  style="width: 300px"/>
        </FormItem>
       
        <FormItem label=""  prop="code">
            <Input v-model="formLogin.code" placeholder="验证码" style="width: 205px" />                   <img style="vertical-align:middle" :src="captchaPath" @click="getCaptcha()" alt="" />

        </FormItem>
         <FormItem>
            <Button size="large" style="width:300px" type="primary" @click="loginSubmit()">登录</Button>
        </FormItem>
    </Form>

        </TabPane>
        <TabPane label="注册" name="name2">
            <RadioGroup v-model="type" style="margin-left: 136px;" type="button" size="large">
        <Radio label="手机注册"></Radio>
        <Radio label="邮箱注册"></Radio>
    </RadioGroup>
             <Form :rules="ruleCustom"  ref="formItem" :model="formItem" class="loginForm" :label-width="80">
        <FormItem label="用户名" prop="username">
            <Input v-model="formItem.username" placeholder="请输入用户名" style="width: 300px" />
        </FormItem>
        <FormItem label="邮箱"  prop="email">
            <Input v-model="formItem.email" placeholder="请输入邮箱" style="width: 300px" />
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="formItem.password"  placeholder="请输入密码"  style="width: 300px"/>
        </FormItem>
        <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" v-model="formItem.passwdCheck"  placeholder="请确认密码"  style="width: 300px"/>
        </FormItem>
        <FormItem label="验证码"  prop="code">
            <Input v-model="formItem.code" placeholder="请输入验证码" style="width: 205px" /> <Button @click="getCode">发送验证码</Button>
        </FormItem>
         <FormItem>
            <Button size="large" style="width:300px" type="primary" @click="handleSubmit('formItem')">注册</Button>
        </FormItem>
    </Form>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import qs from "qs";
import { encryption } from "@/utils/index";
import {
  TabPane,
  Tabs,
  Input,
  FormItem,
  Form,
  RadioGroup,
  Radio,
  Button
} from "iview";
export default {
  components: {
    TabPane,
    Tabs,
    Input,
    FormItem,
    Form,
    RadioGroup,
    Radio,
    Button
  },
  created() {
    this.getCaptcha();
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formItem.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formItem.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.formItem.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      formItem: {
        username: "",
        email: "",
        password: "",
        code: ""
      },
      formLogin: {},
      captchaPath: "",
      randomStr: "",

      type: "邮箱注册",
      ruleCustom: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        passwdCheck: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePassCheck, trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
      },
      loginRules: {},
      tabName: "name1"
    };
  },
  methods: {
    tabsClick(value) {
      this.tabName = value;
    },
    loginSubmit() {
      const user = encryption({
        data: {
          username: this.formLogin.userName,
          password: this.formLogin.password,
          code: this.formLogin.code,
          randomStr: this.randomStr
        },
        key: "pamirpamirpamirp",
        param: ["password"]
      });
      var data;
      var url;
      if (this.formLogin.username.indexOf("@") == -1) {
        data = qs.stringify({
          username: this.formLogin.username,
          password: user.password
        });
        url = "/auth/oauth/token";
      } else {
        data = qs.stringify({
          email: this.formLogin.username,
          password: user.password
        });
        url = "/auth/email/token/email";
      }

      this.$http({
        url,
        method: "post",
        headers: {
          isToken: "false",
          TENANT_ID: "1",
          Authorization: "Basic cGFtaXI6cGFtaXI=",
          "content-type": "application/x-www-form-urlencoded"
        },
        params: {
          randomStr: this.randomStr,
          code: this.formLogin.code,
          grant_type: "password"
        },
        data
      })
        .then(({ data }) => {
          console.log("?");
          this.$store.commit('user/setToken', data.access_token)
          this.$emit('closeModal')
          this.getCaptcha();

        })
        .catch(res => {
          this.getCaptcha();
            console.log(res.response)
            this.$Message.warning(res.response.data.msg)
        });
    },
    
    getCaptcha() {
      var randomStr = this.randomLenNum(4, true);
      this.randomStr = randomStr;
      if (process.env.NODE_ENV !== "production") {
        // src:`${window.location.origin}/code?randomStr=${randomStr}`
        this.captchaPath = `/api/code?randomStr=${randomStr}`;
      } else {
        this.captchaPath = `/code?randomStr=${randomStr}`;
      }
      // this.captchaPath =
      //   window.SITE_CONFIG.host + `/code?randomStr=${randomStr}`;
    },
    randomLenNum(len, date) {
      let random = "";
      random = Math.ceil(Math.random() * 100000000000000)
        .toString()
        .substr(0, len || 4);
      if (date) random = random + Date.now();
      return random;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/admin/sys/user/register/email"),
            method: "post",
            params: { code: this.formItem.code },
            data: {
              ...this.formItem
            }
          }).then(({ data }) => {
            if (data && data.code === 200) {
              console.log(data);
              this.$Message.success("注册成功!");
              this.$refs["formItem"].resetFields();
              this.tabName = "name1";
            } else {
              this.$Message.error(data.msg);
            }
          });
        } else {
          this.$Message.error("表单未填写完成!");
        }
      });
    },
    getCode() {
      this.$refs["formItem"].validateField("email", valid => {
        console.log(valid);
        if (valid) {
          this.$Message.error("未填写邮箱!");
        } else {
          this.$http({
            url: "/admin/email/" + encodeURIComponent(this.formItem.email),
            method: "post"
            // params: {code:this.formItem.code},
            // data:{
            //     ...this.formItem
            // }
          }).then(({ data }) => {
            if (data.data && data.code === 0) {
              console.log(data);
            } else {
              this.$Message.warning(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.ivu-tabs-nav /deep/ .ivu-tabs-tab{
     width:320px;
     text-align :center;
     padding:15px 16px;
     font-size :16px;
 }
 .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper{
     width :200px;
     text-align :center;
 }
 .loginForm
   padding:20px 0;
</style>
