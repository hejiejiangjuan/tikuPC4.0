<template>
  <div>
    <div  class="admincs">
      <span class="ha2">链接地址：</span>
      <input type="text" class="renint" :value="http" readonly id="textAreas" />
      <a href="javascript:;" class="adbb" @click="clickCopytentan">点击复制</a>
    </div>
    <div class="admincs">
      <span class="ha2">说明：</span> <span>用于设置报告分享图片的背景图，建议截取尺寸477*795。</span>
    </div>
    <div class="admincs">
      <span class="ha2">图片上传：</span>
     <div>
        <div class="h2">
        请选图片(
        <span style="color:red;">固定尺寸比列：0.6:1。</span> ):
      </div>
      <div class="imgporrer">
        <ImgCutter
          :label="'选择图片'"
          :boxWidth="500"
          :boxHeight="840"
          :rate="villTwo"
          v-on:cutDown="cutDownTwo"
        >
          <!-- <button type="button" slot="openImgCutter">选择图片</button> -->
        </ImgCutter>
        <div style="width:100%;">
          <div class="stylecaijianTwo">
            <img
              style="width:100%;height:100%;"
              :src="uploadimgUrl+dataImageUrl"
              v-if="!!dataImageUrl"
              alt
            />
          </div>
        </div>
      </div>
     </div>
    </div>
  </div>
</template>

<script>
import ImgCutter from "@/components/ImgCutter";
export default {
  components: {
    ImgCutter
  },
  data() {
    return {
      http: "",
      villTwo: "0.6:1",
      dataImageUrl: "",
      uploadimgUrl: "",
      uploadUrl: "",
      tfk: ""
    };
  },
  mounted() {
    this.tfk = sessionStorage.getItem("tfk");
    this.http = sessionStorage.getItem("http");
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.uploadimgUrl = this.$uploadUrl;
    this.imgremove();
  },
  methods: {
    clickCopytentan() {
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
    // 查询
    imgremove() {
      var params = new URLSearchParams();
      params.append("id", this.tfk);
      this.$axios.get("/api/backstage/tenant/getTenantById", { params }).then(
        res => {
          if (res.data.code == "200") {
            this.dataImageUrl = res.data.datas.posterAddr;
          }
        },
        err => {}
      );
    },
    // base64转成原文件
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
    cutDownTwo: function(res) {
      var files = this.dataURLtoFile(res.dataURL);
      let form = new FormData();
      form.append("file", files);
      let xhr = new XMLHttpRequest();
      xhr.open("post", this.uploadUrl, true);
      xhr.timeout = 30 * 1000;
      xhr.upload.onprogress = this.progress;
      xhr.onload = this.uploadCd;
      xhr.onerror = this.uploadCf;
      xhr.upload.onloadstart = () => {
        let date = new Date().getTime();
        let initSize = 0;
      };
      xhr.send(form);
    },
    // 上传成功
    uploadCd: function(evt) {
      var data = JSON.parse(evt.target.responseText);
      this.dataImageUrl = data.datas;
      var params = new URLSearchParams();
      var list = {
        id: this.tfk,
        posterAddr: this.dataImageUrl
      };
      params.append("param", JSON.stringify(list));
      this.$axios.post("/api/backstage/tenant/addOrUpdateTenant", params).then(
        res => {
          if (res.data.code == "200") {
            this.$message.success("添加成功！");
            this.imgremove();
          } else {
            this.$message.error("添加失败！");
          }
        },
        err => {}
      );
    },
    uploadCf() {
      this.$message.error("图片保存失败！");
    }
  }
};
</script>

<style>
.ha2 {
  display: inline-block;
  width: 100px;
  font-size: 16px;
  color: black;
}
.admincs {
  width: 100%;
  /* height: 60px; */
  padding: 20px 10px;
  display: flex;
  
  /* margin-bottom: 50px; */
}
.h2 {
  font-size: 14px;
  color: #606266;
  padding: 10px 0;
}
.imgporrer {
  width: 100%;
  /* // display: flex;
  // align-items: center; */
}
.stylecaijian {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 20px;
}
.stylecaijianTwo {
  width: 165px;
  height: 275px;
  margin-top: 20px;
}
.stylecaijianTwo img {
  max-width: 100%;
  max-height: 100%;
}
.hteand-toplist {
  width: 35%;
  display: flex;
  align-items: center;
  /* // margin-left: 45%; */
  font-size: 12px;
  color: #d1d1d1;
}
.adbb {
  padding-left: 10px;
}
.renint {
  color: black;
  border: none;
  background: #e5e5e5;
  width: 245px;
  outline: none;
}
</style>
