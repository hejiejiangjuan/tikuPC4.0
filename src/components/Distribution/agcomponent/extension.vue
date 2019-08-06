<template>
  <div>
    <div class="promoter-search">
      <div class="modify-permissions" @click="allClick">批量修改等级</div>
      <div class="search-box">
        <el-select v-model="level" style="width:20%;" placeholder="请选择">
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
        <el-input
          v-model="condition"
          placeholder="推广员昵称/上级推广员/手机号"
          style="width:40%;margin-right:10px;"
        ></el-input>
        <el-button type="info" @click="getExtensionAgentList">查询</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="头像/昵称" width="200">
        <template slot-scope="scope">
          <div style="display:flex; align-items:center;">
            <div class="ima-title">
              <img :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div>{{ scope.row.nickname}}</div>
              <div v-if="scope.row.level == 1" class="level">普通推广员</div>
              <div v-if="scope.row.level == 2" class="level">高级推广员</div>
              <div v-if="scope.row.level == 3" class="level">超级推广员</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="alias" :formatter="formatterValue" label="姓名"></el-table-column>
      <el-table-column prop="phone" :formatter="formatterValue" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="superiorName" :formatter="formatterValue" label="上级推广员" width="120"></el-table-column>
      <el-table-column prop="addupCustomer" label="累计客户（人）"></el-table-column>
      <el-table-column prop="addupInvite" label="累计邀请（人）"></el-table-column>
      <el-table-column prop="addupCommissionStr" label="累计收益（元）"></el-table-column>
      <el-table-column prop="createDate" label="加入时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="details(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="comClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="updateCheckShare(scope.row,3)" type="text" size="small">清退</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改推广员等级" :visible.sync="dialogVisible">
      <div>
        <div class="dialogvisibnle-div">
          <div>
            本次选择推广员{{len}}个，其中：
            <span v-for="item in newArr" :key="item">{{item}},</span>
          </div>
        </div>
        <div class="dialogvisibnle-select">
          <span>修改推广员等级为：</span>
          <el-select v-model="comLevel" style="width:20%;" placeholder="请选择">
            <el-option
              v-for="item in Logintions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
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
      dialogVisible: false,
      pid: "",
      tableData: [],
      options: [],
      Logintions: [],
      comLevel: "",
      level: "",
      date: "",
      condition: "",
      pageSize: 10,
      currentPage: 1,
      totalPage: 0,
      multipleSelection: [],
      row: "",
      len: "",
      newArr: []
    };
  },
  mounted: function() {
    this.getExtensionAgentList();
    this.getDisUserLevelList();
  },
  methods: {
    // 获取分销员列表
    getExtensionAgentList() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.condition != "") {
        str.condition = this.condition;
      }
      if (this.level != "") {
        str.level = this.level;
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
        .get("/api/backstage/expand/getExtensionAgentList", { params })
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
    // 清退
    updateCheckShare(row, id) {
      this.$confirm("此操作将清退该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var that = this;
          var params = new URLSearchParams();
          params.append("id", row.id);
          params.append("type", id);
          that.$axios
            .post("/api/backstage/expand/updateCheckShare", params)
            .then(
              res => {
                if (res.data.code == 200) {
                  this.$message.success("修改成功！");
                  this.getExtensionAgentList();
                } else {
                  that.$message.error("清退失败");
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
    // 获取分销员等级
    getDisUserLevelList() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios
        .get("/api/backstage/expand/getDisUserLevelList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              if (this.options == "") {
                var str = {
                  value: "",
                  label: "全部推广员"
                };
                this.options.push(str);
              }
              for (var i in res.data.datas) {
                var str = {
                  value: res.data.datas[i].id,
                  label: res.data.datas[i].name
                };
                var str2 = {
                  value: res.data.datas[i].id,
                  label: res.data.datas[i].name
                };
                this.options.push(str);
                this.Logintions.push(str2);
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
      this.getDisUserLevelList();
    },
    //格式化数据
    formatterValue(row, column, cellValue, index) {
      if (cellValue == undefined || cellValue == "") {
        return "--";
      } else {
        return cellValue;
      }
    },
    // 表格操作

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 详情
    details(row) {
      sessionStorage.setItem("ID", row.id);
      this.$router.push({
        path: "/home/client",
        query: {
          row: row
        }
      });
    },
    // 编辑
    comClick(row) {
      // this.pidname
      this.getExtensionAgentList();
      this.len = 1;
      var arr = [];
      if (row.level == 1) {
        arr.push("普通推广员1个");
        arr.push("高级推广员0个");
        arr.push("超级推广员0个");
      }
      if (row.level == 2) {
        arr.push("普通推广员0个");
        arr.push("高级推广员1个");
        arr.push("超级推广员0个");
      }
      if (row.level == 3) {
        arr.push("普通推广员0个");
        arr.push("高级推广员0个");
        arr.push("超级推广员1个");
      }
      this.newArr = arr;
      this.row = row;
      this.multipleSelection = [];
      this.dialogVisible = true;
      this.pid = row.id;
      this.comLevel = row.level;
    },
    // 批量编辑
    allClick() {
      if (this.multipleSelection != "") {
        this.dialogVisible = true;
        var level = [];
        this.len = this.multipleSelection.length;
        for (var i in this.multipleSelection) {
          level.push(this.multipleSelection[i].level);
        }
        var _res = [];
        level.sort();
        for (var i = 0; i < level.length; ) {
          var count = 0;
          for (var j = i; j < level.length; j++) {
            if (level[i] == level[j]) {
              count++;
            }
          }
          _res.push([level[i], count]);
          i += count;
        }
        //_res 二维数维中保存了 值和值的重复数
        var _newArr = [];
        for (var i = 0; i < _res.length; i++) {
          if (_res[i][0] == 1) {
            _res[i][0] = "普通推广员";
          }
          if (_res[i][0] == 2) {
            _res[i][0] = "高级推广员";
          }
          if (_res[i][0] == 3) {
            _res[i][0] = "超级推广员";
          }
          _newArr.push(_res[i][0] + _res[i][1] + "个");
        }
        this.newArr = _newArr;
      } else {
        this.$message.error("你还未选中修改数据！");
      }
    },
    // 修改确定
    dialogOk() {
      var that = this;
      var ids = [];
      if (this.multipleSelection == "") {
        ids.push(this.pid);
      }
      if (this.multipleSelection != "") {
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].id);
        }
      }
      if (this.comLevel == "") {
        that.$message.error("等级不能为空！");
        return;
      }
      var params = new URLSearchParams();
      params.append("ids", JSON.stringify(ids));
      params.append("level", this.comLevel);
      that.$axios
        .post("/api/backstage/expand/updateShareUserLevel", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.$message.success("修改成功！");
              this.getExtensionAgentList();
              this.dialogVisible = false;
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
</style>
