<template>
  <div>
    <div class="promoter-admin">
      <div class="search-box">
        <el-input v-model="condition" placeholder="输入查询信息" style="width:80%;margin-right:10px;"></el-input>
        <el-button type="info" @click="getClientBindingList">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="nickname" label="用户称妮" width="160"  :formatter="formatterValue">
         <template slot-scope="scope">
          <div style="display:flex;align-items:center;">
            <div class="ima-title">
              <span  v-if="scope.row.avatar == '' || scope.row.avatar == null">--</span>
              <img v-else :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div v-if="scope.row.nickname == '' || scope.row.nickname == null">--</div>
              <div v-else>{{ scope.row.nickname }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="snickname" label="分销员昵称"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="sphone" label="分销员手机号"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="salias" label="分销员别名"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="bindingDate" label="绑定时间"  :formatter="formatterValue"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
           <span v-if="scope.row.status == '0'">失效</span>
          <span v-if="scope.row.status == '1'">正常</span>
          <span v-if="scope.row.status == '2'">待审核</span>
          <span v-if="scope.row.status == '3'">拒绝</span>
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
  name: "bound",
  data() {
    return {
      condition: "",
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalPage: 0
    };
  },
  mounted: function() {
    // this.getClientBindingList();
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
    // 获取分销员列表
    getClientBindingList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.condition != "") {
        params.append("condition", this.condition);
      }
      that.$axios
        .get("/api/backstage/expand/getClientBindingList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              if (res.data.datas.list == "") {
                this.$message.success("查询成功,暂无相关信息！");
              }
              this.tableData = res.data.datas.list;
              this.totalPage = res.data.datas.totalNum;
            } else if (res.data.code == 205) {
              this.$message.error("登录失效，请重新登录！");
              this.$router.push({ path: "/login" });
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
      this.getClientBindingList();
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
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
.images-title {
  width: 50px;
  height: 50px;
}
.images-title img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
