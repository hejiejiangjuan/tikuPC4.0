<template>
  <el-container>
    <el-header
      style="background:	#001529; display:flex;justify-content:space-between;align-items:center;padding:0 40px;"
    >
      <div class="home-header-tfk">
        <div class="home-img-tfk" @click="xiugaiImg" v-if="tfk != 1">
          <img class="heiderlogo-tfk" :src="uploadimgUrl+logo" alt />
        </div>
        <div class="home-img-tfk" @click="xiugaiImg" v-else>
          <img class="heiderlogo-tfk" :src="uploadimgUrl+logo" alt />
        </div>
        <div class="titleheader-tfk" @click="xiugaiImg">{{title}}</div>
      </div>
      <!-- <div class="home-header" v-else>
        <div class="titleheader">{{title}}</div>

        <div style="width: 100px;height:30px;">
          <img class="heiderlogo" src="@/assets/Login.png" alt />
        </div>
      </div>-->
      <div class="header-toplist" v-if="tfk != 1">
        <span>链接地址：</span>
        <input type="text" class="inputade" :value="http" readonly id="textAreas" />
        <a href="javascript:;" class="aaaa" @click="clickCopy">点击复制</a>
      </div>
      <div class="home-right" @mouseenter="enter">
        <div class="el-icon-s-custom"></div>
        <div class="header-title" @mouseleave="leave">
          <span class="name" @mouseenter="enter" v-if=" alias != 'null'">{{alias}}</span>
          <div class="home-position" v-show="hiden">
            <img class="position-img" src="../../assets/sanjiao.png" alt />
            <div @click="updatePass">修改密码</div>
            <div @click="outLogin">退出登录</div>
          </div>
        </div>
      </div>
      <el-dialog title="修改标题及login" :visible.sync="dialogHome" width="30%">
        <div style="width:100%;height:100%;">
          <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
            <el-form-item label="修改标题:">
              <el-input v-model="formLabelAlign.title" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item label="修改LOGO:">
              <span class="spanlogo">点击图片修改logo</span>
              <div class="img-logo-home">
                <el-upload
                  id="Logohome"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="homeImageSuccess"
                >
                  <img
                    style="border:1px solid #cccccc;"
                    v-if="LogoImageUrl"
                    :src="uploadimgUrl+LogoImageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogHome = false">取 消</el-button>
          <el-button type="primary" @click="LogoHomeOk">确 定</el-button>
        </span>
      </el-dialog>
    </el-header>
    <el-container background-color="#001529">
      <el-aside width="230px" style="background:#001529;">
        <el-menu
          background-color="#001529"
          text-color="#ffffff"
          :active-text-color="textcolor"
          :default-active="indexId"
        >
          <el-submenu v-for="item in all" :key="item.id" :index="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              {{item.menu}}
            </template>
            <el-menu-item-group v-for="item in item.children" :key="item.id">
              <el-menu-item :index="item.id" @click="goArtLists(item.addr)">{{item.menu}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container style="display:block; position: relative;">
        <div class="card-home">
          <v-tags class="v-tags-home"></v-tags>
        </div>
        <el-main style="margin:40px 20px 20px 20px;background:#ffffff;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="修改密码" :visible.sync="centerDialogVisible" width="30%" center>
      请输入新密码：
      <br />
      <br />
      <el-input v-model="passWord" placeholder="请输入内容" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false,passWord=''">取 消</el-button>
        <el-button type="primary" @click="updatePass">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import vTags from "../common/Tags";
import bus from "../common/bus";
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        title: "",
        logo: ""
      },
      textcolor: "#409EFF",
      indexId: "",
      LogoImageUrl: "",
      uploadUrl: "",
      uploadimgUrl: "",
      dialogHome: false,

      centerDialogVisible: false,
      passWord: "",
      hiden: false,
      all: "",
      alias: "",
      tfk: "",
      http: "",
      title: "",
      logo: "",
      id: "",
      tagsList: []
    };
  },
  components: {
    vTags
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        for (var i in this.all) {
          var children = this.all[i].children;
          for (var k in children) {
            if (children[k].addr == val.path) {
              this.indexId = children[k].id;
            }
          }
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.getPowerList();
    this.uploadimgUrl = this.$uploadUrl;
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  mounted: function() {
    this.alias = sessionStorage.getItem("alias");
    this.tfk = sessionStorage.getItem("tfk");
    this.http =
      "https://wxpay.heidouinfo.com/#/?tfk=" + sessionStorage.getItem("tfk");
    sessionStorage.setItem("http", this.http);
    this.getTenantById();
  },
  methods: {
    // 图片上传
    homeImageSuccess(res, file) {
      this.LogoImageUrl = res.datas;
    },
    // 修改头像及标题
    xiugaiImg() {
      this.dialogHome = true;
      this.formLabelAlign.title = this.title;
      this.LogoImageUrl = this.logo;
    },
    LogoHomeOk() {
      if (this.formLabelAlign.title == "") {
        return this.$message.error("标题不能为空。");
      }
      if (this.LogoImageUrl == "") {
        return this.$message.error("logo不能为空。");
      }
      // 获取当前用户名称和logo
      var params = new URLSearchParams();
      var str = {
        id: this.id,
        title: this.formLabelAlign.title,
        logo: this.LogoImageUrl
      };
      params.append("param", JSON.stringify(str));
      this.$axios.post("/api/backstage/tenant/addOrUpdateTenant", params).then(
        res => {
          if (res.data.code == 200) {
            this.getTenantById();
            this.$message.success("修改成功！");
            this.dialogHome = false;
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    getTenantById() {
      // 获取当前用户名称和logo
      var params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("tfk"));
      this.$axios.get("/api/backstage/tenant/getTenantById", { params }).then(
        res => {
          if (res.data.code == 200) {
            this.title = res.data.datas.title;
            this.logo = res.data.datas.logo;
            this.id = res.data.datas.id;
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    clickCopy() {
      // 点击复制
      var obj = document.getElementById("textAreas");
      obj.select();
      if (document.execCommand("Copy", "false", null)) {
        //如果复制成功
        this.$message.success("复制成功！");
      } else {
        //如果复制失败
        this.$message.error("复制失败！");
      }
    },
    enter() {
      this.hiden = true;
    },
    leave() {
      this.hiden = false;
    },
    // 切换路由
    goArtLists(url) {
      this.$router.push({ path: url });
    },

    // 获取菜单
    getPowerList() {
      var that = this;
      var params = new URLSearchParams();
      var roleId = sessionStorage.getItem("roleId");
      params.append("roleId", roleId);
      params.append("type", sessionStorage.getItem("tfk"));
      that.$axios.post("/api/backstage/auth/getMenu", params).then(
        res => {
          if (res.data.code == 200) {
            // that.all = res.data.datas;
            var str = res.data.datas;
            var arr = [];
            for (var i in str) {
              var seras = {};
              seras.id = JSON.stringify(str[i].id);
              seras.icon = str[i].icon;
              seras.menu = str[i].menu;
              var chi = [];
              for (var k in str[i].children) {
                var sras = {};
                sras.addr = str[i].children[k].addr;
                sras.id = JSON.stringify(str[i].children[k].id);
                sras.menu = str[i].children[k].menu;
                sras.pid = JSON.stringify(str[i].children[k].pid);
                chi.push(sras);
              }
              seras.children = chi;
              arr.push(seras);
            }
            that.all = arr;
            that.alias = sessionStorage.getItem("alias");
          } else {
            that.$router.push({ path: "/login" });
            this.$message.error("登录失效，请重新登录。");
          }
        },
        err => {
          this.$router.push({ path: "/login" });
        }
      );
    },
    // 退出登录
    outLogin() {
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", sessionStorage.getItem("userId"));
      this.$axios.post("/api/backstage/login/loginOut", params).then(
        res => {
          if (res.data.code == "200") {
            sessionStorage.clear();
            that.$router.push({ path: "/login" });
          } else {
            this.$message.error("登录失效，请重新登录。");
            sessionStorage.clear();
            that.$router.push({ path: "/login" });
          }
        },
        err => {
          sessionStorage.clear();
          this.$router.push({ path: "/login" });
        }
      );
    },
    //修改密码
    updatePass() {
      this.$router.push({
        path: "/passWord",
        query: { userName: sessionStorage.getItem("username") }
      });
    }
  }
};
</script>

<style  lang="scss">
html,
body {
  background: #f0f2f5;
}
.v-tags-home {
  background: #ffffff;
  width: 100%;
  padding: 0 20px;
  border-bottom: 1px solid #cccccc;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  // text-align: center;
  // line-height: 200px;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-container {
  height: 100%;
  overflow-x: hidden;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.home-header {
  width: 85px;
  height: 80%;
  margin-top: 5px;
  position: relative;
}
.titleheader {
  width: 200px;
  position: absolute;
  right: -200px;
  top: -10px;
  color: #ffffff;
  font-size: 20px;
}
.heiderlogo {
  width: 100%;
  height: 100%;
}
.home-right {
  min-width: 80px;
  height: 100%;
  display: flex;
  justify-items: self-start;
  align-items: center;
  color: #ffffff;
  font-size: 16px;
}
.heidar-name {
  width: 40px;
  height: 40px;
}
.heidar-nameimg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.header-title {
  position: relative;
  margin: 0 15px;
}
.home-position {
  width: 80px;
  height: 60px;
  line-height: 30px;
  border-radius: 5px;
  font-size: 14px;
  background: #ffffff;
  color: #000000;
  position: absolute;
  bottom: -60px;
  left: -20px;
  box-shadow: 2px 1px 12px #444242;
  z-index: 99999;
}
.position-img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -11px;
  left: 5px;
}
.name {
  display: block;
  width: 100%;
  height: 100%;
}
.card-home {
  background: #ffffff;
  position: fixed;
  z-index: 2000;
  width: 76%;
}
.header-toplist {
  display: flex;
  align-items: center;
  // margin-left: 45%;
  font-size: 12px;
  color: #d1d1d1;
}
.aaaa {
  padding-left: 10px;
}
.inputade {
  color: #d1d1d1;
  border: none;
  background: rgb(0, 21, 41);
  width: 245px;
  outline: none;
}
.home-header-tfk {
  width: 50%;
  display: flex;
  align-items: center;
}
.home-img-tfk {
  width: 40px;
  height: 40px;
}
.home-img-tfk img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.titleheader-tfk {
  font-size: 16px;
  color: #ffffff;
  padding-left: 17px;
}
.spanlogo {
  display: block;
  text-align: left;
  font-size: 12px;
  color: red;
  padding-left: 10px;
}
#Logohome {
  width: 100px;
  height: 100px;
  margin-left: 20%;
}
#Logohome .el-upload {
  width: 100%;
  height: 100%;
}
#Logohome .el-upload .avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
