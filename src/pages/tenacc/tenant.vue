<template>
  <div>
    <div class="promoter-tenant">
      <div>
        <el-button type="success" @click="addOrUpdateTenant">新增</el-button>
      </div>
      <div class="teem-box">
        <el-select v-model="enable" style="width:25%;margin:0 10px;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="tenantName" placeholder="渠道名" style="width:50%;margin-right:10px;"></el-input>
        <el-button type="primary" @click="getTenantList">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="LOGO/标题" width="200">
        <template slot-scope="scope">
          <div style="display:flex; align-items:center;">
            <div class="ima-acstor">
              <img :src="$uploadUrl+scope.row.logo" />
            </div>
            <div style="margin-left:5px;">
              <div>{{ scope.row.title}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tenantName" label="渠道名" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="tenantId" label="渠道代码" width="120" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="divideRate" label="分成比例" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="addupCommission" label="累计佣金(元)" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="addupInvite" label="累计订单" :formatter="formatterValue"></el-table-column>

      <el-table-column prop="createDate" label="时间" width="150" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="phone" label="手机" width="110" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="minWithdrawalStr" label="最低提现金额(元)" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="dayMaxWishdrawalStr" label="每日最大提现金额(元)" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="timeMaxWishdrawalStr" label="每笔最大提现金额(元)" :formatter="formatterValue"></el-table-column>
      <!-- <el-table-column label="是否自动结算" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.clearType == 0">否</span>
          <span v-if="scope.row.clearType == 1">是</span>
        </template>
      </el-table-column>-->
      <el-table-column label="是否启用" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.enable == 0">禁用</span>
          <span v-if="scope.row.enable == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="tenantClick(scope.row)" type="primary" size="small">修改</el-button>
          <el-button
            @click="allqiClick(scope.row.id,1)"
            v-if="scope.row.enable == 0"
            type="success"
            size="small"
          >启用</el-button>
          <el-button
            @click="allqiClick(scope.row.id,0)"
            v-if="scope.row.enable == 1"
            type="danger"
            size="small"
          >禁用</el-button>
          <el-button type="info" @click="modalelianjie(scope.row.id)" size="small">生成链接</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 生成链接弹框 -->
    <el-dialog title="提示" :visible.sync="modale" width="30%">
      <div class="modalto">
        <img src="@/assets/ok.png" />
        <div class="lianjie">https://wxpay.heidouinfo.com/#/?tfk={{tfkID}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modale = false">取 消</el-button>
        <el-button type="primary" @click="modale = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹窗 removeaddClick-->
    <el-dialog title="新增" :visible.sync="dialogaddClick" @close="removeaddClick" width="70%">
      <div>
        <el-form :label-position="labelPosition" label-width="160px" :model="allDaingrow">
          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="渠道名称">
                <el-input v-model="allDaingrow.tenantName" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道代码">
                <el-input v-model="allDaingrow.tenantId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机">
                <el-input v-model="allDaingrow.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="最低提现金额(元)">
                <el-input v-model="allDaingrow.minWithdrawal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每日最大提现金额(元)">
                <el-input v-model="allDaingrow.dayMaxWishdrawal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每笔最大提现金额(元)">
                <el-input v-model="allDaingrow.timeMaxWishdrawal"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div>
            <el-row type="flex" justify="center">
              <el-col :span="8">
                <el-form-item label="分成比例(%)">
                  <el-input v-model="allDaingrow.divideRate"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否启用">
                  <el-select
                    v-model="allDaingrow.enable"
                    style="width:80%;margin:0 10px;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标题">
                  <el-input v-model="allDaingrow.title" maxlength="5"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div style="width:100%;margin:0 auto;">
            <el-form-item label="Logo图">
              <div>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="allLeImageSuccess"
                >
                  <img
                    style="border:1px solid #cccccc;"
                    v-if="allImageUrl"
                    :src="uploadimgUrl+allImageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeaddClick">取 消</el-button>
        <el-button type="primary" @click="okAddClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="dialogtenantClick" width="70%">
      <div>
        <el-form :label-position="labelPosition" label-width="160px" :model="daingrow">
          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="渠道名称">
                <el-input v-model="daingrow.tenantName" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道代码">
                <el-input v-model="daingrow.tenantId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分成比例(%)">
                <el-input v-model="daingrow.divideRate"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="累计佣金(元)">
                <el-input v-model="daingrow.addupCommission" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="累计订单">
                <el-input v-model="daingrow.addupInvite" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机">
                <el-input v-model="daingrow.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center">
            <el-col :span="8">
              <el-form-item label="最低提现金额(元)">
                <el-input v-model="daingrow.minWithdrawalStr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每日最大提现金额(元)">
                <el-input v-model="daingrow.dayMaxWishdrawalStr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每笔最大提现金额(元)">
                <el-input v-model="daingrow.timeMaxWishdrawal"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div>
            <el-row type="flex" justify="center">
              <el-col :span="8">
                <el-form-item label="是否启用">
                  <el-select
                    v-model="daingrow.enable"
                    style="width:100%;margin:0 10px;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标题">
                  <el-input v-model="daingrow.title" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- <el-form-item label="标题">
                  <el-input v-model="daingrow.title"></el-input>
                </el-form-item>-->
              </el-col>
            </el-row>
          </div>

          <div style="width:100%;margin:0 auto;">
            <el-form-item label="Logo图">
              <div>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="dataLeImageSuccess"
                >
                  <img
                    style="border:1px solid #cccccc;"
                    v-if="dataImageUrl"
                    :src="uploadimgUrl+dataImageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeClick">取 消</el-button>
        <el-button type="primary" @click="okClick">确 定</el-button>
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
  data() {
    return {
      uploadimgUrl: "",
      uploadUrl: "",
      dataImageUrl: "",
      allImageUrl: "",
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      tenantName: "",
      enable: "",
      tfkID: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "禁用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      options1: [
        {
          value: "0",
          label: "禁用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      modale: false,
      dialogaddClick: false,
      dialogtenantClick: false,
      daingrow: "", //修改保存row，
      labelPosition: "center",
      allDaingrow: {
        tenantName: "",
        tenantId: "",
        divideRate: "",
        logo: "",
        title: "",
        phone: "",
        minWithdrawal: "",
        dayMaxWishdrawal: "",
        timeMaxWishdrawal: "",
        enable: ""
      }
    };
  },

  mounted: function() {
    this.getTenantList();
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.uploadimgUrl = this.$uploadUrl;
  },
  methods: {
    // 生成链接
    modalelianjie(id) {
      this.tfkID = id;
      this.modale = true;
    },
    // 新增
    addOrUpdateTenant() {
      this.dialogaddClick = true;
    },
    // 取消
    removeaddClick() {
      this.dialogaddClick = false;
      this.allDaingrow.tenantName = "";
      this.allDaingrow.tenantId = "";
      this.allDaingrow.divideRate = "";
      this.allImageUrl = "";
      this.allDaingrow.title = "";
      this.allDaingrow.phone = "";
      this.allDaingrow.minWithdrawal = "";
      this.allDaingrow.dayMaxWishdrawal = "";
      this.allDaingrow.timeMaxWishdrawal = "";
      this.allDaingrow.enable = "";
    },
    // 新增确认
    okAddClick() {
      this.allDaingrow.logo = this.allImageUrl;
      if (this.allDaingrow.tenantName == "") {
        return this.$message.error("渠道名为空！");
      }
      if (this.allDaingrow.tenantId == "") {
        return this.$message.error("渠道码为空！");
      }
      var res = /^[a-zA-Z]*$/g;
      if (!res.test(this.allDaingrow.tenantId)) {
        return this.$message.error("渠道码只能为字母！");
      }
      if (!/^\d*\.{0,1}\d{0,1}$/.test(this.allDaingrow.divideRate)) {
        return this.$message.error("分成比列应该为数字！");
      }
      if (this.allDaingrow.logo == "") {
        return this.$message.error("Logo为空！");
      }
      if (this.allDaingrow.title == "") {
        return this.$message.error("标题为空！");
      }
      if (this.allDaingrow.phone == "") {
        return this.$message.error("手机号为空！");
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.allDaingrow.phone)) {
        return this.$message.error("手机号格式不正确！");
      }
      if (this.allDaingrow.minWithdrawal == "") {
        return this.$message.error("最低金额为空！");
      }
      if (!/^\d*\.{0,1}\d{0,1}$/.test(this.allDaingrow.minWithdrawal)) {
        return this.$message.error("最低金额应该为数字！");
      }
      if (this.allDaingrow.dayMaxWishdrawal == "") {
        return this.$message.error("每日最大提现金额为空！");
      }
      if (!/^\d*\.{0,1}\d{0,1}$/.test(this.allDaingrow.dayMaxWishdrawal)) {
        return this.$message.error("每日最大提现金额应该为数字！");
      }
      if (this.allDaingrow.timeMaxWishdrawal == "") {
        return this.$message.error("每笔最大提现金额为空！");
      }
      if (!/^\d*\.{0,1}\d{0,1}$/.test(this.allDaingrow.timeMaxWishdrawal)) {
        return this.$message.error("笔最大提现金额应该为数字！");
      }
      if (this.allDaingrow.enable == "") {
        return this.$message.error("启用状态为空！");
      }
      this.allDaingrow.minWithdrawal = this.fenToYuan(
        this.allDaingrow.minWithdrawal
      );
      var params = new URLSearchParams();
      this.allDaingrow.dayMaxWishdrawal = this.fenToYuan(
        this.allDaingrow.dayMaxWishdrawal
      );
      this.allDaingrow.timeMaxWishdrawal = this.fenToYuan(
        this.allDaingrow.timeMaxWishdrawal
      );
      var str = this.allDaingrow;
      params.append("param", JSON.stringify(str));
      this.$axios.post("/api/backstage/tenant/addOrUpdateTenant", params).then(
        res => {
          if (res.data.code == 200) {
            this.getTenantList();
            this.$message.success("新增成功！");
            this.removeaddClick();
          } else {
            this.$message.error("新增失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 打开修改弹框
    tenantClick(row) {
      this.dialogtenantClick = true;
      this.daingrow = row;
      this.dataImageUrl = row.logo;
    },
    // 点击取消
    removeClick() {
      this.getTenantList();
      this.dialogtenantClick = false;
    },
    allqiClick(id, index) {
      this.$confirm("此操作将改变该项状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = new URLSearchParams();
          var str = {
            id: id,
            enable: index
          };
          params.append("param", JSON.stringify(str));
          this.$axios
            .post("/api/backstage/tenant/addOrUpdateTenant", params)
            .then(
              res => {
                if (res.data.code == 200) {
                  this.getTenantList();
                  this.$message.success("修改成功！");
                } else {
                  this.$message.error("修改失败");
                }
              },
              err => {
                this.$message.error("加载失败");
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 确定修改
    okClick() {
      this.daingrow.logo = this.dataImageUrl;
      if (this.daingrow.tenantName == "") {
        return this.$message.error("渠道名称为空");
      }
      if (!/^\d*\.{0,1}\d{0,1}$/.test(this.daingrow.divideRate)) {
        return this.$message.error("分成比列应该为数字！");
      }
      if (this.daingrow.phone == "") {
        return this.$message.error("手机号为空");
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.daingrow.phone)) {
        return this.$message.error("手机号格式不正确！");
      }
      if (this.daingrow.logo == "") {
        return this.$message.error("头像为空");
      }
      if (this.daingrow.title == "") {
        return this.$message.error("标题为空");
      }
      //  if(this.daingrow.enable == ""){
      //   return  this.$message.error("是否禁用为空");
      // }
      if (this.daingrow.minWithdrawalStr == "") {
        return this.$message.error("最小提现金额为空");
      }
      if (this.daingrow.dayMaxWishdrawalStr == "") {
        return this.$message.error("每日最大提现金额为空");
      }
      if (this.daingrow.timeMaxWishdrawalStr == "") {
        return this.$message.error("每笔最大提现金额为空");
      }
      var that = this;
      var str = {
        id: this.daingrow.id,
        tenantName: this.daingrow.tenantName,
        tenantId: this.daingrow.tenantId,
        divideRate: this.daingrow.divideRate,
        addupCommission: this.daingrow.addupCommission,
        addupInvite: this.daingrow.addupInvite,
        logo: this.daingrow.logo,
        title: this.daingrow.title,
        phone: this.daingrow.phone,
        openid: this.daingrow.openid,
        minWithdrawal: this.fenToYuan(this.daingrow.minWithdrawalStr),
        dayMaxWishdrawal: this.fenToYuan(this.daingrow.dayMaxWishdrawalStr),
        timeMaxWishdrawal: this.fenToYuan(this.daingrow.timeMaxWishdrawalStr),
        enable: this.daingrow.enable
      };
      var params = new URLSearchParams();
      params.append("param", JSON.stringify(str));
      that.$axios.post("/api/backstage/tenant/addOrUpdateTenant", params).then(
        res => {
          if (res.data.code == 200) {
            this.dialogtenantClick = false;
            this.getTenantList();
            this.$message.success("修改成功！");
          } else {
            that.$message.error("修改失败");
          }
        },
        err => {
          that.$message.error("加载失败");
        }
      );
    },
    //元转分
    fenToYuan(val) {
      return parseInt(val * 100);
    },
    // 图片上传
    dataLeImageSuccess(res, file) {
      this.dataImageUrl = res.datas;
    },
    // 图片上传
    allLeImageSuccess(res, file) {
      this.allImageUrl = res.datas;
    },
    // 获取初始化数据，查询
    getTenantList() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.tenantName != "") {
        str.tenantName = this.tenantName;
      }
      if (this.enable != "") {
        str.enable = this.enable;
      }
      params.append("param", JSON.stringify(str));
      that.$axios.get("/api/backstage/tenant/getTenantList", { params }).then(
        res => {
          if (res.data.code == 200) {
            var arr = res.data.datas.list;
            for (var i in arr) {
              var d = new Date(arr[i].createDate);
              var times =
                d.getFullYear() +
                "-" +
                (d.getMonth() + 1) +
                "-" +
                d.getDate() +
                " " +
                d.getHours() +
                ":" +
                d.getMinutes() +
                ":" +
                d.getSeconds();
              arr[i].createDate = times;
            }
            this.tableData = arr;
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
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTenantList();
    },
    //格式化数据
    formatterValue(row, column, cellValue, index) {
      if (cellValue == undefined || cellValue == "") {
        return "--";
      } else {
        return cellValue;
      }
    }
  }
};
</script>

<style>
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
.promoter-tenant {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
}

.teem-box {
  display: flex;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.ima-acstor {
  width: 50px;
  height: 50px;
}
.ima-acstor img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.modalto {
  display: flex;
  align-items: center;
}
.modalto img {
  width: 30px;
  height: 30px;
}
.lianjie {
  margin-left: 20px;
}
</style>
