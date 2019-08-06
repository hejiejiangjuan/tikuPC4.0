<template>
  <div>
    <div class="public-acounts-overview">
      <div class="all-income">
        <div class="overview">
          <div class="overview-title">
            <span>累计佣金(元)</span>
          </div>
          <div class="income-num" >{{addupCommissionStr ? addupCommissionStr : "0.00"}}</div>
        </div>
      </div>
      <div class="pending-income">
        <div class="overview">
          <div class="overview-title">
            <span>今日最大提现金额(元)</span>
          </div>
          <div class="income-num">{{dayMaxWishdrawalStr}}</div>
        </div>
      </div>
      <div class="pending-income">
        <div class="overview">
          <div class="overview-title">
            <span>账户余额(元)</span>
          </div>
          <div class="income-num">
            <span v-if="balanceStr == null">0.00</span>
            <span v-else>{{balanceStr}}</span>
          </div>
        </div>
      </div>

      <div class="available-income">
        <div class="handle-box">
          <div class="handle-button" @click="btnToWithdraw">提现</div>
        </div>
      </div>
    </div>
    <div class="table-title">
      <div>
        <span>今日明细</span>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
       <el-table-column prop="tenantName" label="渠道名称"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="150"></el-table-column>
      <el-table-column prop="orderNo" label="订单号"></el-table-column>
      <el-table-column label="类型" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1">提现</div>
          <div v-if="scope.row.type == 2">入账</div>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="openid" label="微信openid"></el-table-column> -->
      <el-table-column prop="amountStr" label="金额"></el-table-column>
      <el-table-column prop="balanceStr" label="账户余额"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">成功</div>
          <div v-if="scope.row.status == 2">失败</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="头像/称妮"  width="200">
        <template slot-scope="scope">
          <div style="display:flex; align-items:center;">
            <div class="ima-quebare" >
              <img v-if="scope.row.avatar != null" :src="scope.row.avatar" />
            </div>
            <div style="margin-left:5px;">
               <span v-if="scope.row.nickname == null">--</span>
              <div v-else>{{ scope.row.nickname}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="towidthClick(scope.row.orderNo)" v-if="tfk == 1 && scope.row.status == 2" disabled type="primary" size="small">重新提现</el-button>
          <el-button @click="towidthClick(scope.row.orderNo)" v-else-if="scope.row.status == 2" type="primary" size="small">重新提现</el-button>
          <span v-else>已提现</span>
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
  name: "close",
  data() {
    return {
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      addupCommissionStr: "",
      dayMaxWishdrawalStr: "",
      balanceStr: "",
      tableData: [],
      tfk:'',
    };
  },
  props: {
    numberClose: {
      type: Number,
      default: 0
    }
  },
  watch: {
    numberClose: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (this.numberClose == 12) {
          this.getTenantById();
          this.getAccountList();
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.tfk = sessionStorage.getItem("tfk");
    this.getTenantById();
    this.getAccountList();
  },
  methods: {
    // 点击提现跳转
    btnToWithdraw(){
      this.$emit("toNmber", 3);
    },
    // 重新提现
    towidthClick(orderNo) {
      var params = new URLSearchParams();
      params.append("withdrawOrderNo", orderNo);
      
      this.$axios.post("/api/backstage/account/reEntOrder", params).then(
        res => {decodeURI
          if (res.data.code == 0){
            this.getAccountList()
            this.$message.success("修改成功！");
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 查询当前渠道用户
    getTenantById() {
      var params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("tfk"));
      this.$axios.get("/api/backstage/tenant/getTenantById", { params }).then(
        res => {
          if (res.data.code == 200) {
            this.addupCommissionStr = res.data.datas.addupCommissionStr;
            this.dayMaxWishdrawalStr = res.data.datas.dayMaxWishdrawalStr;
            this.balanceStr = res.data.datas.balanceStr;
            var str = res.data.datas;
            sessionStorage.setItem("str",JSON.stringify(str))
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    // 查询当天账单
    getAccountList() {
      var date = new Date();
      var startDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("pageNum", this.currentPage);
      params.append("createDate", startDate);
      this.$axios.post("/api/backstage/account/getAccountList", params).then(
        res => {
          if (res.data.code == 200) {
            this.tableData = res.data.datas.list;
            this.totalPage= res.data.datas.count;
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountList();
    },
  }
};
</script>

<style>

.ima-quebare {
  width: 30px;
  height: 30px;
}
.ima-quebare img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.public-acounts-overview {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 150px;
  background: #fafbfc;
}
.all-income {
  padding: 24px 0 24px 24px;
  width: 25%;
  flex-shrink: 0;
}
.pending-income {
  padding: 24px 0 24px 24px;
  width: 25%;
  flex-shrink: 0;
}
.available-income {
  padding: 24px 24px 14px;
}
.overview {
  border-right: 1px solid #eee;
  height: 100px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.overview-title {
  margin-bottom: 9px;
}
.income-num {
  line-height: 36px;
  font-size: 24px;
  font-weight: 500;
}
.available-income_show {
  padding-bottom: 7px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 76px;
  border-bottom: 1px solid #eee;
}
.handle-box {
  width: 100px;
  height: 100px;
  text-align: center;
  display: flex;
  align-items: center;
}
.handle-button {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
  background: #2a75ed;
  text-align: center;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}
.freeze {
  padding-top: 13px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 22px;
  font-size: 16px;
}
.freeze-record {
  color: #2a75ed;
  cursor: pointer;
}
.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  line-height: 24px;
  font-size: 14px;
  color: #353535;
  -webkit-font-smoothing: antialiased;
  font-weight: 500;
  font-family: PingFangSC, "Microsoft Yahei", Helvetica, Tahoma, Arial,
    "Hiragino Sans GB", "Hiragino Sans GB W3", STXihei, STHeiti, Heiti, SimSun,
    sans-serif !important;
}
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
</style>
