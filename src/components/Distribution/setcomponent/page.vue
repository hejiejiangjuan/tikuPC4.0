<template>
  <div>
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">招募页面</div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">链接地址</div>
        <div class="config-div-int">
          <el-input v-model="addr" placeholder="请输入链接地址"></el-input>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">页面标题</div>
        <div class="config-div-int">
          <el-input v-model="title" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">详情描述</div>
        <div class="config-div-int">
          <Tinymce ref="editor" v-model="content" :height="300"/>
        </div>
      </div>
    </div>
    <div class="config">
      <div class="EC8 ET4 config-title"></div>
      <div class="config-div-int">
        <div class="scbtn-ok">
          <el-button type="primary" @click="updateRecruitPageSetInfo">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
export default {
  name: "page",
  data() {
    return {
      addr: "",
      content: "",
      title: "",
      id: ""
    };
  },
  components: { Tinymce },
  mounted: function() {
    this.getRecruitPageSet();
  },
  methods: {
    getRecruitPageSet() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/api/backstage/expand/getRecruitPageSet", params).then(
        res => {
          if (res.data.code == 200) {
            this.addr = res.data.datas.addr;
            this.content = res.data.datas.content;
            this.title = res.data.datas.title;
            this.id = res.data.datas.id;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    updateRecruitPageSetInfo() {
      if (this.addr == "") {
        that.$message.error("链接地址为空");
        return;
      }
      if (this.title == "") {
        that.$message.error("标题为空！");
        return;
      }
      if (this.content == "") {
        that.$message.error("内容为空");
        return;
      }
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      if (this.addr != "") {
        str.addr = this.addr;
      }
      if (this.title != "") {
        str.title = this.title;
      }
      if (this.content != "") {
        str.content = this.content;
      }
      if (this.id != "") {
        str.id = this.id;
      }
      params.append("param", JSON.stringify(str));

      that.$axios
        .post("/api/backstage/expand/updateRecruitPageSetInfo", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.$message.success("保存成功！");
              this.getRecruitPageSet();
            } else {
              that.$message.error("查询失败");
            }
          },
          err => {
            that.$message.error("加载失败");
          }
        );
    }
  }
};
</script>

<style>
.recruit-wrapper {
  margin-top: 40px;
}
.title {
  display: flex;
  border-left: 2px solid #2a75ed;
  padding-left: 8px;
}
.title__text {
  font-weight: 600;
  font-size: 16px;
  color: #353535;
}
.config {
  display: flex;
  margin-top: 25px;
  padding-left: 10px;
}
.config-title {
  margin-right: 20px;
}
.ET4 {
  font-size: 14px;
}
.ET3 {
  font-size: 14px;
}
.EC8 {
  color: #888;
}
.config-div-url {
  display: flex;
}
.config-btn {
  width: 60px;
  height: 20px;
  font-size: 12px;
  border: 1px solid #2a75ed;
  color: #2a75ed;
  margin-left: 20px;
  text-align: center;
  line-height: 20px;
}
.config-div-int {
  width: 630px;
}
.scbtn-ok {
  width: 630px;
  margin-top: 40px;
  text-align: center;
}
</style>
