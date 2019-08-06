<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="username" placeholder="昵称" style="width:15%"></el-input>
      <el-select v-model="sex">
        <el-option
          v-for="item in sexList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="readmeList">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="orderNum" label="购买数量"></el-table-column>
      <el-table-column prop="totalPaymentStr" label="总购买金额(元)"></el-table-column>
      <el-table-column prop="city" label="城市"></el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender=='0'" type="danger">未知</el-tag>
          <el-tag v-if="scope.row.gender=='1'" type="success">男</el-tag>
          <el-tag v-if="scope.row.gender=='2'">女</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="gender" label="性别"></el-table-column> -->
      <el-table-column prop="createDate" label="注册时间"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间"></el-table-column>
      <el-table-column prop="lastBuyDate" label="最后购买时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="getUserStatisClick(scope.row)" type="primary" size="small">查询</el-button>
          <!-- <el-button type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <el-pagination
        background
        :page-size="pageSize"
        @current-change="autherCurrentChange"
        :total="totalNum"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
    <el-dialog title="选择测评" :visible.sync="dialogFormVisible">
      <div>
        <el-input v-model="title" placeholder="请输入标题" style="width:15%"></el-input>
        <el-input v-model="orderNo" placeholder="请输入订单号" style="width:15%"></el-input>
        <el-select v-model="order">
          <el-option
            v-for="item in orderList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getSearchList">搜索</el-button>
      </div>
      <br>
      <el-table
        ref="singleTable"
        :data="list"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="commodityNum" label="商品数量"></el-table-column>
        <el-table-column prop="productAmountTotal" label="商品总价"></el-table-column>
        <el-table-column prop="payChannel" label="支付方式"></el-table-column>
        <el-table-column prop="title" label="测试标题"></el-table-column>
        <el-table-column prop="typeName" label="测试类型"></el-table-column>
        <el-table-column prop="paymentStr" label="实付金额"></el-table-column>
        <el-table-column prop="username" label="购买人"></el-table-column>
        <el-table-column prop="createDate" label="购买时间"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination background layout="prev, pager, next"  @current-change="handleCurrentChange" :page-size="pageSizeOrder" :total="totalNumOrder"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      adminNo: "",
      pageSize: 10,
      currentPage: 1,
      pageSizeOrder: 10,
      currentPageOrder: 1,
      totalNum: 0,
      sexList: [
        {
          value: "0",
          label: "未知"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      sex: "",
      tableData: [],
      list: [],
      orderNo: "",
      title: "",
      order: "0",
      totalNumOrder: 0,
      dialogFormVisible: false,
      orderList: [],
      userId:"",
    };
  },

  mounted() {
    this.readmeList();
    this.getTypeList();
  },
  methods: {
    //获取测评类型
    readmeList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("currentPage", that.currentPage);
      params.append("pageSize", that.pageSize);
      params.append("username", this.username);
      params.append("sex", this.sex);
      that.$axios.post("/api/backstage/statis/getUserStatis", params).then(
        res => {
          if (res.data.code == 200) {
            this.tableData = res.data.datas.list;
            this.totalNum = res.data.datas.totalNum;
          }
        },
        err => {
        }
      );
    },
    //翻页
    autherCurrentChange(val) {
      this.currentPage = val;
      this.readmeList();
    },
    // 编辑 userId, currentPage, pageSize, title, orderNo, typeId
    getUserStatisClick(row) {
      this.dialogFormVisible = true;
      this.orderNo = '';
      this.title = '';
      this.order = '0';
      this.userId = row.id; 
      this.getSearchList();
      
    },
    getSearchList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("currentPage", this.currentPageOrder);
      params.append("pageSize", this.pageSizeOrder);
      params.append("userId", this.userId);
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.order != "" && that.order != "0") {
        params.append("typeId", that.order);
      }
      if (that.orderNo != "") {
        params.append("orderNo", that.orderNo);
      }
      
      this.$axios.post("api/backstage/order/listByUser", params).then(
        res => {
          if (res.data.code == 200) {
            var listpay = res.data.datas.list;
            for (var i = 0; i < listpay.length; i++) {
              if (listpay[i].payChannel == "1") {
                listpay[i].payChannel = "公众号";
              } else if (listpay[i].payChannel == "2") {
                listpay[i].payChannel = "代金券";
              } else {
                listpay[i].payChannel = "其他";
              }
            }
            
            that.list = listpay;
            that.totalPageOrder = res.data.datas.totalNum;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {
        }
      );
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPageOrder = val;
      this.getSearchList();
    },
    // 确定编辑
    getUserClick() {
      this.dialogFormVisible = false;
    },
    //收索查询
    getadminListWhere() {
      this.readmeList();
    },
    // 隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "success-row";
      }
      return "";
    },
    getOrderList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("currentPage", that.currentPage);
      params.append("pageSize", that.pageSize);
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.order != "" && that.order != "0") {
        params.append("typeId", that.order);
      }
      if (that.orderNo != "") {
        params.append("orderNo", that.orderNo);
      }
      this.$axios.post("api/backstage/order/list", params).then(
        res => {
          if (res.data.code == 200) {
            var list = res.data.datas.list;
            for (var i = 0; i < list.length; i++) {
              if (list[i].payChannel == "1") {
                list[i].payChannel = "公众号";
              } else if (list[i].payChannel == "2") {
                list[i].payChannel = "代金券";
              } else {
                list[i].payChannel = "其他";
              }
            }
            that.tableData = list;
            that.totalNum = res.data.datas.totalNum;
            that.orderList = list;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {
        }
      );
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
        err => {
        }
      );
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #efefef;
}
</style>
