<template>
  <div class="login-container">
    <el-form :model="loginForm" status-icon label-width="100px" class="demo-ruleForm">
      <div class="title-container">
        <h3 class="title">性格测试管理系统</h3>
      </div>
      <el-input
        prefix-icon="el-icon-user"
        class="int username-int"
        type="text"
        placeholder="请输入用户名"
        @focus="focususername"
        v-model="loginForm.username"
      ></el-input>
      <span class="login-span user" v-show="usernamspan">{{uesrnamtitle}}</span>
      <el-input
        prefix-icon="el-icon-lock"
        class="int password-int"
        type="password"
        placeholder="请输入密码"
        @focus="focuspass"
        @keyup.enter.native="loginBtn"
        v-model="loginForm.password"
      ></el-input>
      <span class="login-span pass" v-show="passpan">{{passwordtitle}}</span>
      <br />
      <br />
      <a @click="passWord" style="margin-left:40%;    color: cornflowerblue">忘记密码?</a>
      <div class="lobtn" style="width:100%;margin:20px auto;">
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;height100%;"
          @click="loginBtn"
        >登录</el-button>
      </div>
    </el-form>

    <div class="asd">
      <div class="footerlogin">
        <div>蜀ICP备15003730号-1</div>
        <div class="footer">@Copyright2019黑豆旅行.AllRightsReserved.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      checked: false,
      loginForm: {
        username: "",
        password: ""
      },
      loading: false,
      usernamspan: false,
      passpan: false,
      uesrnamtitle: "",
      passwordtitle: ""
    };
  },
  created() {
    var status = this.$route.params.code;
    if (status == 205) {
      Message.error({
        message: "登录失效！"
      });
    }
  },
  methods: {
    //找回密码
    passWord() {
      this.$router.push({ path: "/passWord" });
    },
    //获取焦点
    focususername() {
      if ((this.usernamspan = true)) {
        this.usernamspan = false;
      }
    },
    focuspass() {
      if ((this.passpan = true)) {
        this.passpan = false;
      }
    },
    //点击登录
    loginBtn(e) {
      var that = this;
      if (that.loginForm.username == "" && that.loginForm.password == "") {
        that.usernamspan = true;
        that.passpan = true;
        that.passwordtitle = "密码为空！";
        that.uesrnamtitle = "用户名为空！";
      } else if (that.loginForm.username == "") {
        that.usernamspan = true;
        that.uesrnamtitle = "用户名为空！";
      } else if (that.loginForm.password == "") {
        that.passpan = true;
        that.passwordtitle = "用户名为空！";
      } else {
        // that.$router.push({ path: "/home" });

        var params = new URLSearchParams();
        params.append("username", that.loginForm.username);
        params.append("password", that.loginForm.password);
        that.$axios.post("/api/backstage/login/doLogin", params).then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
              sessionStorage.setItem("userId", res.data.datas.id);
              sessionStorage.setItem("roleId", res.data.datas.roleId);
              sessionStorage.setItem("tfk", res.data.datas.tfk);
              sessionStorage.setItem("alias", res.data.datas.alias);
              sessionStorage.setItem("username", res.data.datas.userName);
              sessionStorage.setItem("type", res.data.datas.roleType);
              that.$router.push({ path: "/home" });
            } else if (res.data.code == 203) {
              that.$message.warning(res.data.message);
            } else if (res.data.code == 205) {
              that.$router.push({ path: "/login" });
              this.$message.error(response.data.message);
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            // that.message = res.data.message;
            // that.type = "error";
            // that.msgShow = true;
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #000000;

.asd {
  width: 400px;
  height: 40px;
  position: fixed;
  bottom: 0;
}
.footerlogin {
  width: 100%;
  height: 100%;
  font-size: 12px;
  text-align: center;
}
.login-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg;
  overflow: hidden;
  .demo-ruleForm {
    width: 420px;
    height: 300px;
    padding: 10px 20px;
    box-shadow: 5px 8px 30px #cccccc;
    // border: 1px solid #000000;
  }
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}
.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 20px auto;
    text-align: center;
    font-weight: bold;
  }
}
.int {
  margin-top: 20px;
}
.login-span {
  padding-left: 10px;
  font-size: 12px;
  color: red;
}
</style>
