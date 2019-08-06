<template>
  <div class="box" style="width:100%;">
    <div class="tab-hd">
      <div class="tab-one-two" href="javascript:;" :class="{'now':index==1}" @click="oneClick">已绑定</div>
      <div class="tab-one-two" href="javascript:;" :class="{'now':index==2}" @click="twoClick">已解绑</div>
    </div>
    <div class="tab-bd">
      <div class="tab-item" v-show="index==1">
        <el-table :data="tableData" style="width: 100%;margin:30px 0;" >
          <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
          <el-table-column prop="totalOrder" label="订单数量" width="180"></el-table-column>
          <el-table-column prop="amountTotalStr" label="累计消费金额"></el-table-column>
          <el-table-column prop="status" label="客户状态"></el-table-column>
          <el-table-column prop="bindingDate" label="绑定时间"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="leCurrentChange"
            :page-size="pageSize"
            :total="totalPage"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </div>
      <div class="tab-item" v-show="index==2">
        <el-table :data="tableData" style="width: 100%;margin:30px 0;">
          <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
          <el-table-column prop="totalOrder" label="订单数量" width="180"></el-table-column>
          <el-table-column prop="amountTotalStr" label="累计消费金额"></el-table-column>
          <el-table-column prop="status" label="客户状态"></el-table-column>
          <el-table-column prop="bindingDate" label="绑定时间"></el-table-column>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "clients",
  data() {
    return {
      index: 1,
      tableData: [],
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      type:"0",
    };
  },
  mounted: function() {
    this.getClientListById();
  },
  methods: {
    oneClick(){
      this.index = 1;
      this.getClientListById();
    },
    twoClick(){
      this.index = 2
      this.getClientListById();
    },
    // 获取分销员客户
    getClientListById() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
       params.append("id", sessionStorage.getItem("ID"));
      if(this.index == 1){
         params.append("type", 1);
      }
      if(this.index == 2){
         params.append("type", 0);
      }
      
      that.$axios
        .get("/api/backstage/expand/getClientListById", { params })
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
      this.getClientListById();
    },
    //分页查询
    leCurrentChange(val) {
      this.currentPage = val;
      this.getClientListById();
    }
  }
};
</script>

<style>
.tab-hd {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  line-height: 20px;
  font-size: 14px;
  font-weight: 600;
}
.tab-one-two {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: -1px;
  margin-right: 5px;
  padding: 8px;
  width: 120px;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid #eeeeee;
  border-bottom: 0;
  text-align: center;
  background-color: rgba(238, 238, 238, 0.3);
  cursor: pointer;
}
.now {
  color: #2a75ed;
  background-color: #fff;
}
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
</style>
