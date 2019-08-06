<template>
  <div>
    <div class="promoter-search">
      <div></div>
      <div class="search-box">
        <el-select v-model="status" style="width:20%;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          style="margin:0 10px;"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input v-model="condition" placeholder="用户昵称/手机号" style="width:40%;margin-right:10px;"></el-input>
        <el-button type="info" @click="getFeedbackList">查询</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="pic" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="详情图：">
              <div class="itemdivfore">
                <div v-if="props.row.pic == undefined">暂无详情图</div>
                <div
                  v-for="(item,index) in props.row.pic"
                  :key="index"
                  id="itemimg"
                  @click="clockLock(props.row.pic[index].addr)"
                >
                  <img class="imgage" :src="$uploadUrl+item.addr">
                </div>
              </div>
            </el-form-item>
            <el-form-item label="回复内容：">
              <span v-if="props.row.replyContent == ''">暂无回复内容</span>
              <span>{{ props.row.replyContent }}</span>
            </el-form-item>
            <el-form-item label="反馈内容：">
              <span v-if="props.row.feedbackContent == ''">暂无反馈内容</span>
              <span>{{ props.row.feedbackContent }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="头像/昵称" width="200">
        <template slot-scope="scope">
          <div style="display:flex; align-items:center;">
            <div class="ima-title">
              <img :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div>{{ scope.row.nickname}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="replyContent" label="回复内容" width="120"></el-table-column> -->
      <el-table-column prop="replyUserName" label="用户名"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="phone" label="手机号"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="createDate" label="反馈时间"  :formatter="formatterValue"></el-table-column>
      <!-- <el-table-column prop="feedbackContent" label="反馈内容" width="120"></el-table-column> -->
      <el-table-column prop="createDate" label="加入时间"  :formatter="formatterValue"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.status == '0'">已删除</span>
            <span v-if="scope.row.status == '1'">正常</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="allClick(scope.row)" type="text" size="small">回复反馈</el-button>
          <el-button
            @click="changeFeedbackStatus(scope.row,0)"
            v-if="scope.row.status == '1'"
            type="text"
            size="small"
          >删除反馈</el-button>
          <el-button
            @click="changeFeedbackStatus(scope.row,1)"
            v-if="scope.row.status == '0'"
            type="text"
            size="small"
          >恢复反馈</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="回复反馈设置" :visible.sync="dialogVisible">
      <div>
        <h1 style="margin:20px 0;">请输入回复反馈信息</h1>
        <el-input type="textarea" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 图片 -->
    <el-dialog title="提示" id="delodingimg" :visible.sync="dialogImg">
      <div class="delogin-div">
        <span class="quxiaoguabi" @click="dialogImg = false">x</span>
        <div v-if="imgIndex == ''" style="color:#ffffff;">请求图片失败！</div>
        <img v-else :src="$uploadUrl+imgIndex" alt="图片加载失败！">
      </div>
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
  name: "extension",
  data() {
    return {
      dialogImg: false,
      dialogVisible: false,
      pid: "",
      tableData: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "删除"
        },
        {
          value: "1",
          label: "正常"
        }
      ],
      textarea: "",
      date: "",
      status: "",
      condition: "",
      pageSize: 10,
      currentPage: 1,
      totalPage: 0,
      multipleSelection: [],
      row: "",
      imgIndex: ""
    };
  },
  mounted: function() {
    this.getFeedbackList();
  },
  methods: {
    clockLock(index) {
      this.imgIndex = index;
      this.dialogImg = true;
    },
    //格式化数据
    formatterValue(row, column, cellValue, index) {
      if (cellValue == undefined || cellValue == "") {
        return "--";
      } else {
        return cellValue;
      }
    },
    // 获取列表
    getFeedbackList() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.condition != "") {
        str.condition = this.condition;
      }
      if (this.status != "") {
        str.status = this.status;
      }
      if (this.date != "") {
        var d = this.date[0];
        var startDate =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var d = this.date[1];
        var endDate =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

        str.startDate = startDate;
        str.endDate = endDate;
      }
      params.append("param", JSON.stringify(str));
      that.$axios
        .get("/api/backstage/feedback/getFeedbackList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
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
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getFeedbackList();
    },
    // 表格操作

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑
    changeFeedbackStatus(row, status) {
      this.$confirm("是否继续此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var that = this;
          var params = new URLSearchParams();
          params.append("id", row.id);
          params.append("status", status);
          that.$axios
            .post("/api/backstage/feedback/changeFeedbackStatus", params)
            .then(
              res => {
                if (res.data.code == 200) {
                  this.$message.success("修改成功！");
                  this.getFeedbackList();
                } else {
                  that.$message.error("加载失败");
                }
              },
              err => {
                that.$message.error("加载失败");
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
    // 批量编辑
    allClick(row) {
      this.pid = row.id;
      this.dialogVisible = true;
    },
    // 修改确定
    dialogOk() {
      var that = this;
      if (this.textarea == "") {
        that.$message.error("内容不能为空！");
        return;
      }
      var params = new URLSearchParams();
      params.append("id", this.pid);
      params.append("content", this.textarea);
      that.$axios
        .post("/api/backstage/feedback/replyFeedBackById", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.$message.success("保存成功！");
              this.getFeedbackList();
              this.dialogVisible = false;
              this.textarea = "";
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
.promoter-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
}
.modify-permissions {
  padding: 8px 18px;
  line-height: 20px;
  border-radius: 2px;
  cursor: pointer;
  background-color: #fafbfc;
  border: 1px solid #e5e7eb;
}
.search-box {
  display: flex;
  align-items: center;
}
.search-btn {
  height: 36px;
  border: 1px solid #e5e7eb;
  background-color: #fafbfc;
  text-align: center;
  line-height: 36px;
  border-radius: 2px;
  cursor: pointer;
}
.ima-title {
  width: 30px;
  height: 30px;
}
.ima-title img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
.dialogvisibnle-div {
  width: 100%;
  text-align: center;
}
.dialogvisibnle-select {
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
.level {
  color: #cccccc;
  font-size: 12px;
}
#itemimg {
  width: 200px;
  height: 120px;
  margin: 5px 20px;
  float: left;
}
.imgage {
  max-width: 100%;
  max-height: 100%;
}
.itemdivfore {
  width: 100%;
  height: 100%;
  /* display: flex; */
}
#delodingimg .el-dialog {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  margin: 0 auto !important;

  /* display: none; */
}

#delodingimg .el-dialog .el-dialog__header {
  display: none;
}
#delodingimg .el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

#delodingimg .el-dialog .el-dialog__body .delogin-div {
  width: 800px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
#delodingimg .el-dialog .el-dialog__body .delogin-div img {
  max-width: 100%;
  max-height: 100%;
}
#delodingimg .el-dialog .el-dialog__body .delogin-div .quxiaoguabi {
  display: block;
  width: 20px;
  height: 20px;
  font-size: 16px;
  text-align: center;
  line-height: 20px;
  background: #cccccc;
  position: absolute;
  top: 0px;
  right: 20px;
}
/* .cell{
  overflow: hidden;
text-overflow: ellipsis;
display:-webkit-box;
-webkit-box-orient:vertical; 
-webkit-line-clamp:2;
} */
</style>
