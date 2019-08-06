<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="测评轮播" name="first">
      <div>
        <div>
          <el-select v-model="tenant" filterable clearable placeholder="请选择" v-if="tfk == 1">
            <el-option
              v-for="item in tenants"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="getList" v-if="tfk == 1">搜索</el-button>
          <el-button type="info" @click="openAdd">新增测评轮播</el-button>
        </div>
        <br />
        <br />
        <el-table ref="singleTable" :data="tableData" border style="width: 100%">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="subhead" label="副标题"></el-table-column>
          <el-table-column prop="currentPraceStr" label="当前价格(元)"></el-table-column>
          <el-table-column prop="originalPraceStr" label="原价格(元)"></el-table-column>
          <el-table-column prop="stayTimeStr" label="停留时间（小时）"></el-table-column>
          <el-table-column prop="putawayDate" label="上架时间"></el-table-column>
          <el-table-column prop="useNum" label="购买人数"></el-table-column>
          <el-table-column prop="clickNum" label="点击次数"></el-table-column>
          <el-table-column prop="tfkName" label="所属租户" v-if="tfk == 1"></el-table-column>
          <el-table-column label="操作" width="350" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="moveAppraisalId(scope.row,0)">上移</el-button>
              <el-button type="success" size="small" @click="moveAppraisalId(scope.row,1)">下移</el-button>
              <el-button type="danger" size="small" @click="open(scope.row,1)">下架</el-button>
              <!-- <el-button type="warning" size="small" @click="openPic(scope.row,1)">替换图片</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-dialog class="eldialog" title="替换图片(建议尺寸：375*280)" :visible.sync="picVisible">
          <el-image class="leimg" :src="picImg"></el-image>
          <el-upload
            :action="uploadUrl"
            name="file"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-dialog>
        <el-dialog title="选择测评" :visible.sync="dialogTableVisible">
          <div>
            <el-input v-model="title" placeholder="请输入标题" style="width:30%"></el-input>
            <el-select v-model="field" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="order" placeholder="请选择">
              <el-option
                v-for="item in orderList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="getSearchListWhere">搜索</el-button>
          </div>
          <br />
          <el-table :data="searchList" border>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="subhead" label="副标题"></el-table-column>
            <el-table-column prop="currentPriceStr" label="当前价格" sortable></el-table-column>
            <el-table-column prop="originalPriceStr" label="原价格" sortable></el-table-column>
            <el-table-column prop="useNum" label="使用人数" sortable></el-table-column>
            <el-table-column label="选择" width="80" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="open(scope.row,0)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="totalPage"
            ></el-pagination>
          </div>
        </el-dialog>
      </div>
    </el-tab-pane>
    <el-tab-pane label="自定义轮播" name="second">
      <div>
        <el-select v-model="tfks" filterable clearable placeholder="请选择" v-if="tfk == 1">
          <el-option
            v-for="item in tenants"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getCustomList" v-if="tfk == 1">搜索</el-button>
        <el-button type="info" @click="addPic">新增自定义轮播</el-button>
      </div>
      <br />
      <br />
      <el-table ref="singleTable" :data="customData" border style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="subhead" label="副标题"></el-table-column>
        <el-table-column prop="stayTimeStr" label="停留时间（小时）"></el-table-column>
        <el-table-column prop="putawayDate" label="上架时间"></el-table-column>
        <el-table-column prop="addr" label="跳转地址"></el-table-column>
        <el-table-column prop="clickNum" label="点击次数"></el-table-column>
        <el-table-column prop="tfkName" label="所属租户" v-if="tfk == 1"></el-table-column>
        <el-table-column label="操作" width="350" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="moveAppraisalId(scope.row,0)">上移</el-button>
            <el-button type="success" size="small" @click="moveAppraisalId(scope.row,1)">下移</el-button>
            <el-button type="danger" size="small" @click="open(scope.row,1)">下架</el-button>
            <el-button type="warning" size="small" @click="updateCustomPic(scope.row)">替换图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog class="eldialog" title="自定义轮播" :visible.sync="addPicVisible">
        <div class="zidingyilunbo">
          <el-form :label-position="labelPosition" label-width="80px">
            <el-form-item label="链接地址:">
              <el-input placeholder="请以http或https开头" v-model="addr"></el-input>
            </el-form-item>
            <el-form-item label="封面图片:">
              <div
              class="adaamin"
              >
              <ImgCutter
                  :label="'选择图片'"
                  :boxWidth="760"
                  :boxHeight="560"
                  :rate="valliOne"
                  v-on:cutDown="cutDown"
                >
                  <!-- <button type="button" slot="openImgCutter">选择图片</button> -->
                </ImgCutter>
                <div style="width:100%;">
                  <div class="stylecaijian">
                    <img
                      style="width:100%;height:100%;"
                      :src="uploadimgUrl+addPicImg"
                      v-if="!!addPicImg"
                      alt
                    />
                  </div>
                </div>
                <!-- <el-image
                  style="margin-right:10px;"
                  class="leimg"
                  :src="addPicImg"
                  v-if="addPicImg != ''"
                ></el-image>
                <el-upload
                  :action="uploadUrl"
                  name="file"
                  list-type="picture-card"
                  :show-file-list="false"
                  :on-success="beforeAvatarUpload"
                  :before-upload="beforeUpload"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>-->
              </div>
            </el-form-item>
          </el-form>

          <div style="width:100%;text-align: center;margin-top:20px">
            <el-button @click="addPicVisible = false,(addPicImg='')">取 消</el-button>
            <el-button type="primary" @click="addCarousel">确 定</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog class="eldialog" title="替换图片(建议尺寸：375*280)" :visible.sync="customPicVisible">
        <el-image class="leimg" :src="customPic"></el-image>
        <el-upload
          :action="uploadUrl"
          name="file"
          list-type="picture-card"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :on-success="changeCustomPic"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ImgCutter from "@/components/ImgCutter";
export default {
  data() {
    return {
      valliOne: "1.4:1",
      uploadimgUrl:'',
      labelPosition: "right",
      activeName: "first",
      tfk: sessionStorage.getItem("tfk"),
      tenants: [],
      tenant: "",
      tfks: "",
      id: "",
      tableData: [],
      customData: [],
      dialogTableVisible: false,
      picVisible: false,
      addPicVisible: false,
      picImg: "",
      addPicImg: "",
      title: "",
      searchList: [],
      order: "0",
      orderList: [],
      field: "4",
      options: [
        {
          value: "4",
          label: "请选择状态"
        },
        {
          value: "0",
          label: "下架"
        },
        {
          value: "1",
          label: "上架"
        },
        {
          value: "2",
          label: "删除"
        },
        {
          value: "3",
          label: "待发布"
        }
      ],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      uploadUrl: "",
      headers: {
        authorization: "authorization-text"
      },
      currentId: "",
      addr: "",
      pic: "",
      customPic: "",
      customPicVisible: false
    };
  },
  components: {
    ImgCutter
  },
  mounted: function() {
    this.uploadimgUrl = this.$uploadUrl;
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.getList();
    this.getTypeList();
    this.getCustomList();
    this.getTenant();
  },
  methods: {
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
    // 裁剪后完成后执行
    cutDown: function(res) {
      var files = this.dataURLtoFile(res.dataURL);
      let form = new FormData();
      form.append("file", files);
      let xhr = new XMLHttpRequest();
      xhr.open("post", this.uploadUrl, true);
      xhr.timeout = 30 * 1000;
      xhr.upload.onprogress = this.progress;
      xhr.onload = this.uploadComplete;
      xhr.onerror = this.uploadFailed;
      xhr.upload.onloadstart = () => {
        let date = new Date().getTime();
        let initSize = 0;
      };
      xhr.send(form);
    },
    // 上传成功
    uploadComplete: function(evt) {
      var data = JSON.parse(evt.target.responseText);
      this.addPicImg = data.datas;
    },
    uploadFailed() {
      this.$message.error("图片保存失败！");
    },
    //获取租户数据
    getTenant() {
      var that = this;
      this.$axios.post("api/backstage/tenant/getTenant").then(
        res => {
          if (res.data.code == 200) {
            var ten = res.data.datas;
            for (var i = 0; i < ten.length; i++) {
              that.tenants.push({
                label: ten[i].tenantName,
                value: ten[i].id
              });
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      let _this = this;
      const is1M = file.size / 1024 / 1024 < 2; // 限制小于1M
      return new Promise(function(resolve, reject) {
        let width = 375; // 限制图片尺寸为654X270
        let height = 280;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width === width && img.height === height; //如果上传图片为固定尺寸，则用此项。
          // let valid = img.width / img.height == 1;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸限制为375*280！");
          return Promise.reject();
        }
      );
    },
    //自定义轮播更换图片
    updateCustomPic(row) {
      this.customPic = this.$uploadUrl + row.imgAddr;
      this.customPicVisible = true;
      this.id = row.id;
    },
    //替换图片
    changeCustomPic(response, file, fileList) {
      var addr = response.datas;
      this.picImg = this.$uploadUrl + addr;
      var that = this;
      var params = new URLSearchParams();
      params.append("id", that.id);
      params.append("imgAddr", addr);
      that.$axios.post("api/backstage/carousel/changeCustomPic", params).then(
        res => {
          if (res.data.code == 200) {
            this.customPicVisible = false;
            that.getList();
            that.getCustomList();
            that.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //查询自定义轮播
    getCustomList() {
      var that = this;
      var params = new URLSearchParams();
      if (that.tfks != null && that.tfks != "") {
        params.append("tenant", that.tfks);
      } else {
        params.append("tenant", that.tfk);
      }
      this.$axios.post("api/backstage/carousel/getCustomList", params).then(
        res => {
          if (res.data.code == 200) {
            var data = res.data.datas;
            var stayTime = 0;
            for (var i = 0; i < data.length; i++) {
              data[i].title = "自定义轮播";
              data[i].subhead = "自定义轮播";
              if (data[i].stayTime != null) {
                stayTime = data[i].stayTime;
              }
              data[i].stayTimeStr = that.hour(
                new Date(data[i].putawayDate),
                new Date(),
                stayTime
              );
            }
            that.customData = data;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    //上架时间
    hour(after, before, offset) {
      var nd = 1000 * 24 * 60 * 60;
      var nh = 1000 * 60 * 60;
      var nm = 1000 * 60;
      // 获得两个时间的毫秒时间差异
      var diff = before.getTime() - after.getTime() + offset;
      // 计算差多少天
      var day = parseInt(diff / nd);
      // 计算差多少小时
      var hour = parseInt((diff % nd) / nh);
      // 计算差多少分钟
      var min = parseInt(((diff % nd) % nh) / nm);
      // 计算差多少秒//输出结果
      // long sec = diff % nd % nh % nm / ns;
      return day + "天" + hour + "小时" + min + "分钟";
    },
    //打开添加自定义轮播
    addPic() {
      this.addPicVisible = true;
    },
    //图片回显
    beforeAvatarUpload(res, file) {
      this.addPicImg = this.$uploadUrl + file.response.datas;
      this.pic = file.response.datas;
    },
    //提交自定义轮播
    addCarousel() {
      var that = this;
      var params = new URLSearchParams();
      params.append("imgAddr", that.pic);
      params.append("addr", that.addr);
      params.append("tfk", sessionStorage.getItem("tfk"));
      that.$axios.post("api/backstage/carousel/addCarouse", params).then(
        res => {
          if (res.data.code == 200) {
            that.getList();
            that.getCustomList();
            that.addPicVisible = false;
            that.addPicImg = "";
            that.$message({
              type: "success",
              message: "添加自定义轮播成功!"
            });
          } else {
            that.$message.error("添加自定义轮播失败");
          }
        },
        err => {}
      );
    },
    //移动数据
    moveAppraisalId(row, type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("appraisalId", row.id);
      params.append("type", type);
      that.$axios.post("api/backstage/carousel/move", params).then(
        res => {
          if (res.data.code == 200) {
            that.getList();
            that.getCustomList();
            that.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //替换图片确认框
    openPic(row, type) {
      this.picImg = this.$uploadUrl + row.imgAddr;
      this.currentId = row.appraisalId;
      this.picVisible = true;
    },
    handleChange(response, file, fileList) {
      var addr = response.datas;
      this.picImg = this.$uploadUrl + addr;
      var that = this;
      var params = new URLSearchParams();
      params.append("appraisalId", this.currentId);
      params.append("addr", addr);
      that.$axios.post("api/backstage/carousel/updatePic", params).then(
        res => {
          if (res.data.code == 200) {
            this.picVisible = false;
            that.getList();
            that.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //打开添加确认框
    open(row, type) {
      var that = this;
      var typeName = "";
      var appraisalId = "";
      if (type == "1") {
        typeName = "下架";
        appraisalId = row.id;
      } else {
        typeName = "新增";
        appraisalId = row.id;
      }
      this.$confirm("是否要" + typeName + "" + row.title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = new URLSearchParams();
          params.append("appraisalId", appraisalId);
          params.append("type", type);
          params.append("addrType", "1");
          that.$axios.post("api/backstage/carousel/add", params).then(
            res => {
              if (res.data.code == 200) {
                that.getList();
                that.getCustomList();
                that.dialogTableVisible = false;
                that.$message({
                  type: "success",
                  message: typeName + "成功!"
                });
              } else {
                that.$message.error(typeName + "失败");
              }
            },
            err => {}
          );
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消" + typeName
          });
        });
    },
    //条件查询
    getSearchListWhere() {
      this.getSearchList();
    },
    //获取测评类型
    getTypeList() {
      var that = this;
      this.$axios.post("api/backstage/appraisal/getType").then(
        res => {
          if (res.data.code == 200) {
            var typeList = res.data.datas;
            var list = [
              {
                value: "0",
                label: "请选择类型"
              }
            ];
            for (var i = 0; i < typeList.length; i++) {
              var type = {};
              type.value = typeList[i].id;
              type.label = typeList[i].name;
              list.push(type);
            }
            that.orderList = list;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSearchList();
    },
    //打开添加弹窗
    openAdd() {
      this.dialogTableVisible = true;
      this.getSearchList();
    },
    //请求测评列表数据
    getSearchList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("field", "create_date");
      params.append("order", "asc");
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("type", "0");
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.order != "" && that.order != "0") {
        params.append("typeId", that.order);
      }
      if (that.field != "" && that.field != "4") {
        params.append("status", that.field);
      }
      this.$axios.post("api/backstage/appraisal/searchListAndTfk", params).then(
        res => {
          if (res.data.code == 200) {
            that.searchList = res.data.datas.list;
            that.totalPage = res.data.datas.totalNum;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    //请求列表数据
    getList() {
      var that = this;
      var params = new URLSearchParams();
      if (that.tenant != null && that.tenant != "") {
        params.append("tenant", that.tenant);
      } else {
        params.append("tenant", that.tfk);
      }
      this.$axios.post("api/backstage/carousel/list", params).then(
        res => {
          if (res.data.code == 200) {
            that.tableData = res.data.datas;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    }
  }
};
</script>

<style>
.leimg {
  width: 355px;
  height: 220px;
}
.leimg > .el-image__inner {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
.eldialog > .el-dialog {
  width: 40%;
}
.eldialog > .el-dialog > .el-dialog__body {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.zidingyilunbo {
  width: 100%;
  height: 100%;
}
.stylecaijian {
  width: 375px;
  height: 280px;
  margin: 0 auto;
  margin-top: 20px;
}
.adaamin{
  width: 100%;
  text-align: center;
}
</style>
