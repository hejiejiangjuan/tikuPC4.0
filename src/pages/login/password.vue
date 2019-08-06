<template>
  <div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="填写账号"></el-step>
      <el-step title="身份验证"></el-step>
      <el-step title="设置密码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 填写账号 -->
    <div class="userName" v-show="active==1">
      账号：
      <el-input v-model="userName" placeholder="请输入账号" style="width:40%" v-if="userName == null "></el-input>
      <el-input v-model="userName" placeholder="请输入账号" style="width:40%" disabled v-else></el-input>
    </div>
    <!-- 身份验证 -->
    <div class="userName" v-show="active==2">
      短信验证码已发送至您所绑定的手机号{{phone}}，请注意查收
      <br />
      <br />验证码：
      <el-input v-model="code" placeholder="请输入验证码" style="width:40%"></el-input>
      <el-button v-if="btn" @click="sendCode">发送验证码</el-button>
      <el-button v-else disabled>{{btnTest}}</el-button>
    </div>
    <!-- 设置新密码 -->
    <div class="userName" v-show="active==3">
      设置密码：
      <el-input v-model="passWord" placeholder="请输入内容" style="width:40%" type="password"></el-input>
      <br />
      <br />确认密码：
      <el-input v-model="newPassWord"  placeholder="请输入内容" style="width:40%" type="password"></el-input>
    </div>
    <!-- 设置完成 -->
    <div class="userName" v-show="active==4">
      <div class="passets-img"><img src="@/assets/ok.png" alt=""></div>
      <div>密码设置完成，{{returnTime}}秒后自动返回至登录页面</div>
      <br />
      <br />点击
      <a @click="login" style="color: cornflowerblue">立即返回</a>
    </div>

    <div class="next">
      <el-button @click="next" style="width: 40%;" v-show="active<4">下一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 1,
      checked: true,
      userName: "",
      code: "",
      passWord: "",
      newPassWord: "",
      resCode: "",
      resPhone: "",
      phone: "",
      timer: "",
      btnTest: "重新发送",
      btn: false,
      userId: "",
      returnTime: "5",
      isDisabled:true,
    };
  },
  created:function(){
    this.userName=this.$route.query.userName;
  },
  methods: {
    //重新发送
    sendCode() {
      var that = this;
      var params = new URLSearchParams();
      params.append("phone", that.resPhone);
      that.$axios.post("/api/backstage/user/sendMsg", params).then(
        res => {
          if (res.data.code == 200) {
            that.resCode = res.data.datas.code;
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //五分钟后清空验证码
    cleanResCode() {
      var s = 60 * 5;
      var time = setInterval(() => {
        s--;
        if ((s = 0)) {
          this.resCode = "";
          clearInterval(time);
        }
      }, 1000);
    },
    //重新发送验证码按钮
    sendCodeBtn() {
      var that = this;
      var s = 90;
      var time = setInterval(() => {
        if (s > 0) {
          s--;
          that.btnTest = s + "S后重新发送";
          that.btn = false;
        } else {
          that.btn = true;
          clearInterval(time);
        }
      }, 1000);
    },

    //自动返回登录页面
    toLogin() {
      var that = this;
      var s = 5;
      var time = setInterval(() => {
        if (s > 0) {
          s--;
          that.returnTime = s;
        } else {
          that.login();
          clearInterval(time);
        }
      }, 1000);
    },

    //返回登录
    login() {
      this.$router.push({ path: "/login" });
    },
    //下一步
    next() {
      var that = this;
      if (that.active == 1) {
        that.getUserName();
      } else if (that.active == 2) {
        that.verificationPhone();
      } else if (that.active == 3) {
        that.verificationPass();
      }
    },
    //验证账号
    getUserName() {
      var that = this;
      var params = new URLSearchParams();
      params.append("userName", that.userName);
      that.$axios.post("/api/backstage/user/getUserByUserName", params).then(
        res => {
          if (res.data.code == 200) {
            that.resPhone = res.data.datas.phone;
            that.sendCodeBtn();
            that.sendCode();
            that.phone =
              that.resPhone.substr(0, 3) + "****" + that.resPhone.substr(7);
            that.userId = res.data.datas.userId;
            that.active++;
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //手机验证码验证
    verificationPhone() {
      var that = this;
      if (that.code == that.resCode) {
        that.active++;
      } else {
        that.$message.error("验证码不正确");
      }
    },
    //设置新密码
    verificationPass() {
      var that = this;
      var params = new URLSearchParams();
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
      if (that.passWord == null || that.passWord == "") {
        that.$message.error("请输入新密码");
        return;
      }
      if (
        !reg.test(that.passWord) ||
        that.passWord.length < 6 ||
        that.passWord.length > 16
      ) {
        that.$message.error("密码是6~16位字母或数字");
        return;
      }
      if (that.passWord != that.newPassWord) {
        that.$message.error("两次输入不一致");
        return;
      } else {
        params.append("userId", that.userId);
        params.append("pass", that.passWord);
        that.$axios.post("/api/backstage/user/updatePass", params).then(
          res => {
            if (res.data.code == 200) {
              that.active++;
              that.toLogin();
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {}
        );
      }
    }
    //修改完成
  }
};
</script>
<style>
.userName {
  width: 50%;
  /* margin-left: 25%; */
  text-align: center;
  margin: 0 auto;
  margin-top: 10%;
}
.next {
    width: 35%;
    /* margin-left: 40%; */
    
    margin: 0 auto;
    margin-top: 2%;
    text-align: center;
}
.passets-img{
  width: 50px;
  height: 50px;
  margin: 25px auto;
}
.passets-img img{
  width: 100%;
  height: 100%;
}
</style>
