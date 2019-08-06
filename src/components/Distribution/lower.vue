<template>
  <div>
    <el-table :data="tableData" style="width: 100%;margin:30px 0;">
      <el-table-column prop="nickname" label="头像昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column prop="totalOrder" label="订单数量" width="180"></el-table-column>
      <el-table-column prop="amountTotalStr" label="累计消费金额"></el-table-column>
      <el-table-column prop="bindingDate" label="绑定时间"></el-table-column>
      <el-table-column prop="status" label="客户状态"></el-table-column>
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
  name: "lower",
  props: {
    row: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: [],
      totalPage:0,
      pageSize:10,
      currentPage: 1,
    };
  },
  mounted: function() {
    this.getLowerShareListById();
  },
  methods: {
    // 获取分销员列表
    getLowerShareListById() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      params.append("id", sessionStorage.getItem("ID"));
      that.$axios
        .get("/api/backstage/expand/getLowerShareListById", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              var arr = res.data.datas.list;
              for (var i in arr) {
                if (arr[i].status == "0") {
                  arr[i].status = "失效";
                } else if (arr[i].status == "1") {
                  arr[i].status = "正常";
                }
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
      this.getLowerShareListById();
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
</style>
