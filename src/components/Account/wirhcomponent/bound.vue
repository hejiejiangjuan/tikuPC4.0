<template>
  <div>
    <div class="assets-main">
      <div class="withdrawal-system">
        <div class="payTitle">绑定到账微信账号</div>
      </div>
      <div class="adminbound">
        <div class="bindWx">
          <span class="el-icon-warning btnstop"></span>
          <span class="boundspan">提现前请先绑定实名认证的微信号。绑定实名认证微信号的店铺每日能提现的上限为2万，不支持非实名认证微信号提现。</span>
        </div>
        <div class="weixin_zhanghao" v-if="datas == null || datas ==''">
          <div class="bangdingbtn" @click="delodingtwo">绑定微信</div>
        </div>
        <div class="weixin_zhanghao" v-else>
          <div class="nametop">
            <span class="bound-title">微信昵称</span>
            <span class="bound-name">{{datas.nickname}}</span>
            <span class="colorcnongxin" @click="delodingtwo(2)">重新绑定</span>
          </div>
          <div class="nametop" style="margin-top:20px;">
            <span class="bound-title">微信头像</span>
            <img class="images-bound" :src="datas.avatar" alt />
          </div>
        </div>
      </div>
      <div>
        <div class="bound-yanzhengma">获取验证码</div>
        <div class="code_extra">
          验证码将发送到管理员绑定的手机:
          <span style="color:red;">{{str.phone}}</span>, 请注意查收
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="boundleForm"
      >
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" style="width:20%;" @blur="blurcode"></el-input>
          <el-button type="info" plain v-if="btn == 1 " @click="sendMsgphone">获取验证码</el-button>
          <el-button type="info" plain v-if="btn == 2" @click="sendCodeBtn">重新发送</el-button>
          <el-button type="info" plain v-if="btn == 3" disabled>{{returnTime}}s后重新发送</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="bindingWxManage" :loading="lodingwod">确认绑定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="微信授权"  :visible.sync="boundVis" width="30%">
      <div class="deloding-top" v-loading="loading">
        <img :src="uploadUrl+adder" alt />
        <div>请使用到账微信扫描二维码！</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      lodingwod: false,
      boundVis: false,
      uploadUrl: "",
      adder: "",
      key: "",
      time: "",
      datas: "",
      str: "",
      code: "",
      phone:"",
      btn: 1,
      ispass: false,
      returnTime: "",
      ruleForm: {
        code: ""
      },
      rules: {
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 6, message: "长度在 4 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    this.uploadUrl = this.$uploadUrl;
    this.getTenantById();
  },
  methods: {
    //一分钟后清空验证码
    cleanResCode() {
      var s = 60;
      var time = setInterval(() => {
        s--;
        if ((s = 0)) {
          this.code = "";
          clearInterval(time);
        }
      }, 1000);
    },
    //重新发送验证码按钮
    sendCodeBtn() {
      var that = this;
      var s = 60;
      var time = setInterval(() => {
        if (s > 0) {
          s--;
          that.returnTime = s;
          that.btn = 3;
        } else {
          that.btn = 2;
          clearInterval(time);
        }
      }, 500);
    },
    formatter(value, row, index) {
      var len = value.length;
      var xx = value.substring(3, len - 4);
      var values = value.replace(xx, "****");
      return values;
    },
    getTenantById() {
      // 查询当前渠道用户
      var params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("tfk"));
      this.$axios.get("/api/backstage/tenant/getTenantById", { params }).then(
        res => {
          if (res.data.code == 200) {
            this.phone = res.data.datas.phone;
            var string = res.data.datas;
            string.phone = this.formatter(string.phone)
            this.str = string;
            
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 验证码对比
    blurcode() {
      if (this.code != this.ruleForm.code) {
        this.ispass = false;
        return this.$message.error("验证码错误！");
      } else {
        this.ispass = true;
      }
    },
    // 获取验证码
    sendMsgphone() {
      if (this.datas.nickname == null || this.datas.nickname == "") {
        return this.$message.error("你还未绑定账户！");
      }
      var params = new URLSearchParams();
      params.append("phone", this.phone);
      // params.append("phone", "15881665131");
      this.$axios.post("/wx/disPersonal/sendMsg", params).then(
        res => {
          if (res.data.code == 200) {
            // this.cleanResCode();
            this.code = res.data.datas.code;
            this.btn = 3;
            this.sendCodeBtn();
            this.cleanResCode();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 获取openid
    getAccountKey() {
      var params = new URLSearchParams();
      params.append("key", this.key);
      this.$axios.post("/api/backstage/account/getOpenidByKey", params).then(
        res => {
          if (res.data.code == 200) {
            if (res.data.datas != "" && res.data.datas != undefined) {
              clearInterval(this.time);
              this.datas = res.data.datas;
              this.boundVis = false;
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 绑定
    delodingtwo(index) {
      this.boundVis = true;
      var params = new URLSearchParams();
      if (this.key != "" && index != 2) {
        params.append("key", this.key);
      }
      this.$axios.post("/api/backstage/account/getAccountKey", params).then(
        res => {
          if (res.data.code == 200) {
            this.loading = false;
            this.adder = res.data.datas.addr;
            this.key = res.data.datas.key;
            this.time = setInterval(() => {
              this.getAccountKey();
            }, 3000);
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 提交
    bindingWxManage() {
      if(this.ruleForm.code == ""){
        return this.$message.error("请输入验证码");
      }
      if (this.ispass) {
        this.lodingwod = true;
        var params = new URLSearchParams();
        params.append("tfk", sessionStorage.getItem("tfk"));
        params.append("openid", this.datas.openid);
        this.$axios.post("/api/backstage/account/bindingWxManage", params).then(
          res => {
            if (res.data.code == 200) {
              this.lodingwod = false;
              this.$emit("adchengNone", 5);
              this.$message({
                type: "success",
                message: "绑定成功!"
              });
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            this.$message.error("加载失败");
          }
        );
      } else {
        this.$message.error("验证码错误！");
      }
    }
  },
  destroyed: function() {
    clearInterval(this.time);
  }
};
</script>

<style>
.deloding-top {
  width: 100%;
  height: 100%;
  text-align: center;
}
.assets-main {
  min-height: 690px;
  padding: 24px;
  box-shadow: 0px 1px 20px 0px rgba(228, 232, 235, 0.5);
  border-radius: 4px;
  background-color: #ffffff;
  overflow: auto;
}
.payTitle {
  width: 100%;
  height: 40px;
}
.adminbound {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.bindWx {
  padding-left: 20px;
  background-repeat: no-repeat;
  background-position: 0;
  width: 100%;
  display: flex;
  align-items: center;
}
.boundspan {
  font-size: 10px;
}
.btnstop {
  color: #2a75ed;
  padding-right: 10px;
}
.bangdingbtn {
  width: 100px;
  height: 33px;
  border: none;
  border-radius: 2px;
  background-color: #2a75ed;
  color: #fff;
  text-align: center;
  font: normal normal normal 14px/30px Microsoft YaHei;
  outline: none;
  float: left;
  margin-left: 15px;
  cursor: pointer;
}
.weixin_zhanghao {
  width: 100%;
  margin-top: 30px;
  float: left;
  margin-left: 20px;
}
.nametop {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.bound-title {
  display: block;
  width: 70px;
}
.bound-name {
  font-size: 14px;
  padding: 0 20px;
}
.colorcnongxin {
  text-decoration: none;
  cursor: pointer;
  color: #2a75ed;
}
.images-bound {
  width: 50px;
  height: 50px;
  margin: 0 20px;
}
.bound-yanzhengma {
  line-height: 34px;
  font-size: 15px;
  padding-left: 18px;
}
.code_extra {
  font-size: 12px;
  margin-top: 10px;
  margin-left: 20px;
}
.boundleForm {
  margin-top: 20px;
}
</style>
