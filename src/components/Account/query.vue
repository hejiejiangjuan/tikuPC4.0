<template>
  <div>
    <div class="promoter-tenant">
      <div>
        <!-- <el-button type="success" @click="addOrUpdateTenant">新增</el-button> -->
      </div>
      <div class="teem-box">
        <el-select v-model="status" style="width:25%;margin:0 10px;" placeholder="请选择">
          <el-option
            v-for="item in optstatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="type" style="width:25%;margin:0 10px;" placeholder="请选择">
          <el-option
            v-for="item in opttype"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="tenantName"
          v-if="tfk == 1"
          placeholder="渠道名称"
          style="width:20%;margin-right:10px;"
        ></el-input>
        <el-input v-model="orderNo" placeholder="订单号" style="width:30%;margin-right:10px;"></el-input>
        <el-button type="primary" @click="querAccountList">查询</el-button>
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
      <el-table-column label="头像/称妮" width="200">
        <template slot-scope="scope">
          <div style="display:flex; align-items:center;">
            <div class="ima-queberc">
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
          <el-button
            @click="towidthClick(scope.row.orderNo)"
            v-if="tfk == 1 && scope.row.status == 2"
            disabled
            type="primary"
            size="small"
          >重新提现</el-button>
          <el-button
            @click="towidthClick(scope.row.orderNo)"
            v-else-if="scope.row.status == 2"
            type="primary"
            size="small"
          >重新提现</el-button>
          <span v-else-if="scope.row.type == 2">--</span>
          <div v-else>已提现</div>
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
  name: "query",
  data() {
    return {
      tfk: "",
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      status: "",
      type: "",
      orderNo: "",
      tenantName: "",
      optstatus: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "1",
          label: "成功"
        },
        {
          value: "2",
          label: "失败"
        }
      ],
      opttype: [
        {
          value: "",
          label: "全部类型"
        },
        {
          value: "1",
          label: "提现"
        },
        {
          value: "2",
          label: "入账"
        }
      ]
    };
  },
  props: {
    numberquery: {
      type: Number,
      default: 0
    }
  },
  watch: {
    numberquery: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (newValue == 12) {
          this.tfk = sessionStorage.getItem("tfk");
          this.querAccountList();
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.tfk = sessionStorage.getItem("tfk");
    this.querAccountList();
  },
  methods: {
    // 重新提现
    towidthClick(orderNo) {
      var params = new URLSearchParams();
      params.append("withdrawOrderNo", orderNo);
      this.$axios.post("/api/backstage/account/reEntOrder", params).then(
        res => {
          decodeURI;
          if (res.data.code == 0) {
            this.querAccountList();
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
    // 获取初始数据
    querAccountList() {
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("pageNum", this.currentPage);
      if (this.orderNo != "") {
        params.append("orderNo", this.orderNo);
      }
      if (this.status != "") {
        params.append("status", this.status);
      }
      if (this.type != "") {
        params.append("type", this.type);
      }
      if (this.tenantName != "") {
        params.append("tenantName", this.tenantName);
      }
      this.$axios.post("/api/backstage/account/getAccountList", params).then(
        res => {
          if (res.data.code == 200) {
            this.tableData = res.data.datas.list;
            this.totalPage = res.data.datas.count;
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
      this.querAccountList();
    }
  }
};
</script>

<style>
.ima-queberc {
  width: 30px;
  height: 30px;
}
.ima-queberc img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.promoter-tenant {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
}

.teem-box {
  display: flex;
  align-items: center;
}
.pagination {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
</style>
