<template>
  <div>
    <div class="promoter-admin">
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
        <el-button type="info" @click="getCheckList">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="头像/昵称" width="250">
        <template slot-scope="scope" >
          <div style="display:flex;align-items: center;">
            <div class="ima-title">
              <img :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div>{{ scope.row.nickname }}</div>
              <div class="lave-div" v-if="scope.row.level == '3'">超级推广员</div>
              <div class="lave-div" v-if="scope.row.level == '2'">高级推广员</div>
              <div class="lave-div" v-if="scope.row.level == '1'">普通推广员</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="姓名" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="addupCustomer" label="累计客户个数" width="120"></el-table-column>
      <el-table-column prop="addupInvite" label="累计邀请订单" width="120"></el-table-column>
      <el-table-column prop="addupCommissionStr" label="累计佣金" width="120"></el-table-column>
      <el-table-column prop="directCommissionStr" label="直接佣金" width="120"></el-table-column>
      <el-table-column prop="indirectCommissionStr" label="间接佣金" width="120"></el-table-column>
      <el-table-column label="来源" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.beFrom == '1'">微信</span>
          <span v-if="scope.row.beFrom == '2'">其他</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">通过</span>
          <span v-if="scope.row.status == '2'">拒绝</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row,1)"
            v-if="scope.row.status == '2'"
            type="primary"
            size="small"
          >通过</el-button>
          <el-button
            @click="handleClick(scope.row,2)"
            v-if="scope.row.status == '1'"
            type="warning"
            size="small"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: "audit",
  data() {
    return {
      tableData: [],
      options: [],
      value: "",
      date: "",
      level: "",
      condition: "",
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  mounted: function() {
    this.getCheckList();
    this.getDisUserLevelList();
  },
  methods: {
    // 获取审核列表
    // 获取分销员列表
    getCheckList() {
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
      that.$axios.get("/api/backstage/expand/getCheckList", { params }).then(
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

    handleCurrentChange() {
      this.currentPage = val;
      this.getCheckList();
    },
    // 表格操作
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 是否通过
    handleClick(row, id) {
      this.$confirm("确定进行此操作, 是否继续?", "提示", {
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
                  this.getCheckList();
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
            message: "已取消"
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
                this.options.push(str);
              }
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
  width: 20px;
  height: 20px;
  margin-right: 5px;
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
.lave-div{
  font-size: 12px;
  color: #888888;
}
</style>
