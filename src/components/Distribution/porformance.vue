<template>
  <div>
    <div class="promoter-admin">
      <div class="search-box">
        <el-date-picker
          style="margin:0 10px;"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input v-model="condition" placeholder="推广员昵称/手机号" style="width:40%;margin-right:10px;"></el-input>
        <el-button type="info" @click="getSharePerformance">查询</el-button>
        <el-button type="success" @click="excelClick">导出Excel</el-button>
      </div>
    </div>
    <!-- 弹出对话框 -->
    <el-dialog title="提示" :visible.sync="dialogExcel" width="30%">
      <div>
        <span>选择时间</span>
        <el-date-picker
          style="margin:20px 10px;"
          v-model="exceldate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExcel = false">取 消</el-button>
        <el-button type="primary" @click="dialogExcelOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" ref="singleTable" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="推广员昵称" width="150" :formatter="formatterValue">
        <template slot-scope="scope">
          <div style="display:flex;">
            <div class="ima-title">
              <img :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div>{{ scope.row.nickname }}</div>
              <div class="level">{{ scope.row.levelName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="姓名" width="160" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="superiorName" label="上级名称" width="160" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="phone" label="推广员手机号" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="directCommissionStr" label="直接佣金" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="indirectCommissionStr" label="间接佣金" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="addupCustomer" label="累计客户个数" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="addupInvite" label="累计邀请订单" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="addupCommissionStr" label="累计佣金" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="indirectNum" label="间接订单" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="indirectNum" label="来源" :formatter="formatterValue">
        <template slot-scope="scope" width="250">
          <span v-if="scope.row.beFrom == 1">微信</span>
          <span v-if="scope.row.beFrom == 2">其他</span>
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
  name: "porformance",
  props: {
    activeName: {
      type: String,
      default: "agent"
    }
  },
  data() {
    return {
      loading: true,
      dialogExcel: false,
      exceldate: "",
      condition: "",
      tableData: [],
      date: "",
      value: "",
      pageSize: 10,
      currentPage: 1,
      totalPage: 0
    };
  },
  // mounted: function() {
    
  // },
  watch: {
    activeName: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (newValue == "porformance") {
          this.getSharePerformance();
        }
      },
      deep: true
    }
  },
  methods: {
    // 导出表格
    // 导出表格
    excelClick() {
      this.dialogExcel = true;
    },
    dialogExcelOk() {
      if (this.exceldate == "") {
        this.$message.error("未选择时间！");
        return;
      }
      var param = {
        condition: this.condition,
        startDate: "",
        endDate: ""
      };
      if (this.exceldate != "") {
        var d = this.exceldate[0];
        var startDate =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var d = this.exceldate[1];
        var endDate =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

        param.startDate = startDate;
        param.endDate = endDate;
      }
      window.location.href =
        this.$baseUrl +
        "api/backstage/expand/exportSharePerformanceExcel?param=" +
        encodeURIComponent(JSON.stringify(param)) +
        "&type=1&pageSize=" +
        this.pageSize +
        "&currentPage=" +
        this.currentPage;
    },
    // 获取分销员列表
    getSharePerformance() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.condition != "") {
        str.condition = this.condition;
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
        .get("/api/backstage/expand/getSharePerformance", { params })
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
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getClientListById();
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
.ima-title {
  width: 30px;
  height: 30px;
}
.ima-title img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.level {
  color: #cccccc;
  font-size: 12px;
}
</style>
