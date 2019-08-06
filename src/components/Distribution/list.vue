<template>
  <div>
    <div class="promoter-admin">
      <div class="search-box">
        <el-select v-model="typeId" style="width:20%;margin:0 10px;" placeholder="请选择">
          <el-option
            v-for="item in listOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="title" placeholder="请输入标题" style="width:40%;margin-right:10px;"></el-input>
        <el-button type="info" @click="getShareCommodityList">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" border v-loading="loading" style="width: 100%">
      <el-table-column label="商品名" width="300" >
        <template slot-scope="scope">
          <div style="display:flex;">
            <div class="listImg">
              <img :src="$uploadUrl+scope.row.detailAddr" style="font-size:12px;" alt="图片加载失败！">
            </div>
            <div style="width:60%;">
              <div :title="scope.row.title"
                class="admtitle"
              >{{ scope.row.title }}</div>
              <div style="font-size:14px;color:#888888;">
                <span style="color:red;">￥{{scope.row.currentPraceStr}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="商品类型" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="originalPraceStr" label="原价格(元)" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="currentPraceStr" label="现价格(元)" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="joinGeneralize" label="是否参与推广" :formatter="formatterValue" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.joinGeneralize == 0">不参与</div>
          <div v-if="scope.row.joinGeneralize == 1">参与</div>
        </template>
      </el-table-column>
      <el-table-column prop="shareNum" label="分享次数" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="salesVolume" label="销量" :formatter="formatterValue"></el-table-column>
      <el-table-column fixed="right" label="状态" width="180">
        <template slot-scope="scope">
          <el-button @click="proportionClick(scope.row)" type="text" size="small">比例设置</el-button>
          <el-button @click="psterClick(scope.row)" type="text" size="small">海报设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 海报设置 -->
    <el-dialog title="海报设置" :visible.sync="psterVisible" width="30%">
      <div
        style="font-size:12px;color:red;text-align: center;padding:20px 0;"
      >点击图片替换海报,建议尺寸300x500px或 3:5</div>
      <div id="admimg">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="dataLeImageSuccess"
          :before-upload="beforeUploadData"
        >
          <img
            style="border:1px solid #cccccc;"
            v-if="dataImageUrl"
            :src="uploadimgUrl+dataImageUrl"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="psterVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 比列设置弹框 -->
    <el-dialog title="比列设置" :visible.sync="dialogVisible" width="40%">
      <div class="proportion-dialog">
        <div class="proportion-dialog-div">
          <span>参与推广：</span>
          <el-switch v-model="istype" active-color="#13ce66"></el-switch>
        </div>
        <div>
          <span>比列设置：</span>
          <el-radio v-model="rateSet" label="0">默认比列</el-radio>
          <el-radio v-model="rateSet" label="1">自定义比列</el-radio>
        </div>
        <div style="width:100%;margin-top:20px;" v-if="rateSet == '0'">
          <ul>
            <li class="dloingtop">
              <el-row style="margin-bottom: 0px;">
                <el-col :span="6">推广等级</el-col>
                <el-col :span="6">直接推广佣金比例</el-col>
                <el-col :span="6">间接推广佣金比例</el-col>
              </el-row>
            </li>
            <li v-for="item in dataList" :key="item.id">
              <el-row style="margin-bottom: 0px;" class="dloingneirong" v-if="item.status =='1'">
                <el-col :span="6">{{item.name}}</el-col>
                <el-col :span="6">
                  <span>{{item.defaultDirectRatio }}%</span>
                </el-col>
                <el-col :span="6">
                  <span>{{item.defaultIndirectRatio }}%</span>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
        <div style="width:100%;margin-top:20px;" v-if="rateSet == '1'">
          <ul>
            <li class="dloingtop">
              <el-row>
                <el-col :span="6">推广等级</el-col>
                <el-col :span="6">直接推广佣金比例</el-col>
                <el-col :span="6">间接推广佣金比例</el-col>
              </el-row>
            </li>
            <li v-if="admId == false" style="text-align: center;padding: 15px 0;">数据为空！</li>
            <li v-for="item in rowList" :key="item.levelId" v-else>
              <el-row class="dloingneirong" v-if="item.status =='1'">
                <el-col :span="6">
                  <span v-if="item.levelId == '1'">普通推广员</span>
                  <span v-if="item.levelId == '2'">高级推广员</span>
                  <span v-if="item.levelId == '3'">超级推广员</span>
                </el-col>
                <el-col :span="6">
                  <div style="display:flex;align-items:center;">
                    <input
                      type="number"
                      v-model="item.defaultDirectRatio "
                      style="width:80%;height:30px;border:1px solid #e9e9e9; text-align:center;"
                      placeholder="请输入内容"
                    >
                    <span style="padding-left:10px;">%</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="display:flex;align-items:center;">
                    <input
                      type="number"
                      v-model="item.defaultIndirectRatio "
                      style="width:80%;height:30px;border:1px solid #e9e9e9; text-align:center;"
                      placeholder="请输入内容"
                    >
                    <span style="padding-left:10px;">%</span>
                  </div>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickOk">确 定</el-button>
      </span>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :total="totalPage"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "list",
  props: {
    activeName: {
      type: String,
      default: "agent"
    }
  },
  data() {
    return {
      loading: true,
      rowList: [],
      uploadimgUrl: "",
      uploadUrl: "",
      dataImageUrl: "",
      psterVisible: false,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [],
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      listOptions: [
        {
          label: "全部",
          value: ""
        }
      ],
      typeId: "",
      title: "",
      istype: true, //推广开关
      rateSet: "0",
      dataList: [],
      prID: "",
      admId: true,
    };
  },
  watch: {
    activeName: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (newValue == "list") {
          this.getShareCommodityList();
          this.getType();
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.uploadimgUrl = this.$uploadUrl;
  },
  methods: {
    //格式化数据
    formatterValue(row, column, cellValue, index) {
      if (cellValue == undefined || cellValue == "") {
        return "--";
      } else {
        return cellValue;
      }
    },
    // 点击确定
    clickOk() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.prID);
      params.append("rateSet", this.rateSet);

      if (this.istype == true) {
        params.append("type", 1);
      } else if (this.istype == false) {
        params.append("type", 0);
      }
      var rate = [];
      for (var i in this.rowList) {
        var str = {};
        str.levelId = this.rowList[i].levelId;
        str.defaultDirectRatio = this.rowList[i].defaultDirectRatio;
        str.defaultIndirectRatio = this.rowList[i].defaultIndirectRatio;
        rate.push(str);
      }
      params.append("rate", JSON.stringify(rate));

      that.$axios
        .post("/api/backstage/expand/updateCustomRateById", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.dialogVisible = false;
              this.$message.success("修改成功！");
              this.getShareCommodityList();
            } else {
              that.$message.error("查询失败");
            }
          },
          err => {
            that.$message.error("加载失败");
          }
        );
    },
    // 海报上传
    imgOk() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.prID);
      params.append("posterAddr", this.dataImageUrl);

      that.$axios
        .post("/api/backstage/expand/updatePosterAddrById", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.psterVisible = false;
              this.$message.success("修改成功！");
              this.getShareCommodityList();
            } else {
              that.$message.error("查询失败");
            }
          },
          err => {
            that.$message.error("加载失败");
          }
        );
    },
    // 图片上传
    dataLeImageSuccess(res, file) {
      this.dataImageUrl = res.datas;
    },
    // 详情图上传验证检测
    beforeUploadData(file) {
      const isJPG = file.type === "image/jpeg";
      let _this = this;
      return new Promise(function(resolve, reject) {
        // let width = 375; // 限制图片尺寸为654X270
        // let height = 280;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          // let valid = img.width === width && img.height === height; //如果上传图片为固定尺寸，则用此项。
          let valid = (img.width / img.height).toFixed(1) == 0.6;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸比例为：3:5");
          return Promise.reject();
        }
      );
    },

    // 获取列表
    getShareCommodityList() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.typeId != "") {
        str.typeId = this.typeId;
      }
      if (this.title != "") {
        str.title = this.title;
      }
      params.append("param", JSON.stringify(str));
      that.$axios
        .get("/api/backstage/expand/getShareCommodityList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              this.loading = false;
              this.tableData = res.data.datas.list;
              this.totalPage = res.data.datas.totalNum;
            } else {
              that.$message.error("查询失败");
            }
          },
          err => {
            that.$message.error("加载失败");
          }
        );
    },
    // 获取商品类型
    getType() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/api/backstage/type/getType", params).then(
        res => {
          if (res.data.code == 200) {
            var arr = res.data.datas;
            for (var i in arr) {
              var str = {
                value: String(arr[i].id),
                label: arr[i].name
              };
              this.listOptions.push(str);
            }
          } else {
            that.$message.error("加载失败");
          }
        },
        err => {
          that.$message.error("加载失败");
        }
      );
    },
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getShareCommodityList();
    },
    // 点击海报设置
    psterClick(row) {
      this.prID = row.id;
      this.dataImageUrl = row.posterAddr;
      this.psterVisible = true;
    },
    // 点击比例设置
    proportionClick(row) {
      this.getDisUserLevelList(row);

      this.prID = row.id;
      this.dialogVisible = true;
    },

    // 获取默认比列
    getDisUserLevelList(row) {
      var that = this;
      var params = new URLSearchParams();
      that.$axios
        .get("/api/backstage/expand/getDisUserLevelList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              that.dataList = res.data.datas;
              var arr = JSON.parse(row.customRate);
              for (var i in that.dataList) {
                if (arr != "") {
                  if (i < arr.length) {
                    arr[i]["status"] = that.dataList[i].status;
                    if (arr[i].levelId == "" || arr[i].levelId == undefined) {
                      arr[i]["levelId"] = that.dataList[i].id;
                    } else {
                      arr[i].levelId = arr[i].levelId;
                    }
                    if (arr[i].defaultDirectRatio == "") {
                      arr[i].defaultDirectRatio = 0;
                    } else {
                      arr[i].defaultDirectRatio = arr[i].defaultDirectRatio;
                    }
                    if (arr[i].defaultIndirectRatio == "") {
                      arr[i].defaultIndirectRatio = 0;
                    } else {
                      arr[i].defaultIndirectRatio = arr[i].defaultIndirectRatio;
                    }
                  }
                } else {
                  this.admId = false;
                  return;
                }
              }
              this.rowList = arr;
            } else {
              that.$message.error("加载失败");
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
.promoter-admin {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
}
.listImg {
  width: 120px;
  height: 50px;
}
.listImg img {
  max-width: 100%;
  max-height: 100%;
}
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
.proportion-dialog {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
.proportion-dialog-div {
  width: 100%;
  margin-bottom: 20px;
}
.dloingtop {
  height: 50px;
  line-height: 50px;
  background-color: #e9e9e9;
  border: 1px solid #e9e9e9;
}
.dloingneirong {
  height: 50px;
  line-height: 50px;
  border: 1px solid #e9e9e9;
  margin-bottom: 0px;
}

#admimg {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
#admimg > .avatar-uploader {
  width: 150px;
  height: 300px;
  text-align: center;
}
#admimg > .avatar-uploader > .el-upload {
  width: 150px;
  height: 252px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#admimg > .avatar-uploader > .el-upload .el-icon-plus {
  width: 150px;
  height: 252px;
}
#admimg > .avatar-uploader > .el-upload > .avatar {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#textop > .quill-editor > .ql-container > {
  min-height: 100px !important;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.admtitle {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
