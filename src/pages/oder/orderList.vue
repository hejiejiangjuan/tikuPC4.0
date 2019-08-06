<template>
  <div>
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
      <el-select v-model="tenant" filterable clearable placeholder="请选择租户" v-if="tfk == 1">
            <el-option
              v-for="item in tenants"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      <el-button type="primary" @click="getSearchListWhere">搜索</el-button>
    </div>
    <br>
    <el-table
      ref="singleTable"
      :data="tableData"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column prop="commodityNum" label="商品数量"></el-table-column>
      <el-table-column prop="paymentStr" label="商品总价(元)"></el-table-column>
      <el-table-column prop="payChannel" label="支付方式"></el-table-column>
      <el-table-column prop="title" label="测试标题"></el-table-column>
      <el-table-column prop="typeName" label="测试类型"></el-table-column>
      <!-- <el-table-column prop="paymentStr" label="实付金额"></el-table-column> -->
      <el-table-column prop="username" label="购买人"></el-table-column>
      <el-table-column prop="createDate" label="购买时间"></el-table-column>
      <el-table-column prop="tenantName" label="渠道" v-show="tfk == 1"></el-table-column>
      <el-table-column prop="divideRate" label="分成比例(%)"></el-table-column>
      <el-table-column prop="dividePaymentStr" label="分成金额(元)"></el-table-column>
      
    </el-table>
    <div class="block">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalNum"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      totalNum: 0,
      tableData: [],
      title: "",
      order: "0",
      orderList: [],
      orderNo: "",
      tfk : '',
      tenants: [],
      tenant: "",
    };
  },
  mounted: function() {
    this.tfk = sessionStorage.getItem('tfk');
    this.getOrderList();
    this.getTypeList();
    this.getTenant();
  },
  methods: {
    //条件查询
    getSearchListWhere() {
      this.getOrderList();
    },
    //获取租户数据
    getTenant() {
      var that = this;
      this.$axios.post("api/backstage/tenant/getTenant").then(
        res => {
          if (res.data.code == 200) {
            var ten = res.data.datas;
            for (var i = 0; i < ten.length; i++) {
              that.tenants.push({
                label: ten[i].tenantName,
                value: ten[i].id
              });
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //设置行格式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "success-row";
      }
      return "";
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },
    //获取列表数据
    getOrderList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("currentPage", that.currentPage);
      params.append("pageSize", that.pageSize);
      var param = {};
      if (that.title != "") {
        param.title = that.title;
      }
      if (that.order != "" && that.order != "0") {
        param.typeId = that.order;
      }
      if (that.orderNo != "") {
        param.orderNo = that.orderNo;
      }
      if (that.tenant != null && that.tenant != "") {
        param.tfk = that.tenant;
      }else{
          if (that.tfk == 1) {
            param.tfk = -1;
          } else{
            param.tfk = that.tfk;
          }
      }
      if (param != null) {
        params.append("param", JSON.stringify(param));
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
