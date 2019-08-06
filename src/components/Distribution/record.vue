<template>
  <div>
    <div class="promoter-admin">
      <div class="search-box">
        <el-select v-model="status" style="width:20%;" placeholder="请选择">
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
        <el-button type="info" @click="getGeneralizeRecord">查询</el-button>
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
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="createDate" label="创建时间" width="180" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180" :formatter="formatterValue"></el-table-column>
      <el-table-column prop="bnickname" label="购买人" :formatter="formatterValue"></el-table-column>
      <el-table-column label="购买人昵称/头像" width="200">
        <template slot-scope="scope">
          <div style="display:flex;align-items:center;">
            <div class="ima-title">
              <span  v-if="scope.row.bavatar == '' || scope.row.bavatar == null">--</span>
              <img v-else :src="scope.row.bavatar">
            </div>
            <div style="margin-left:5px;">
              <div v-if="scope.row.bnickname == '' || scope.row.bnickname == null">--</div>
              <div v-else>{{ scope.row.bnickname }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bphone" label="购买人手机" width="200" :formatter="formatterValue"></el-table-column>
      <el-table-column label="直接推广员昵称/头像" width="200" :formatter="formatterValue">
        <template slot-scope="scope">
          <div style="display:flex;align-items:center;">
            <div class="ima-title">
              <span  v-if="scope.row.avatar == '' || scope.row.avatar == null">--</span>
              <img v-else :src="scope.row.avatar">
            </div>
            <div style="margin-left:5px;">
              <div v-if="scope.row.nickname == '' || scope.row.nickname == null">--</div>
              <div v-else>{{ scope.row.nickname }}</div>
              
              <div  v-if="scope.row.levelname == '' || scope.row.levelname == null">--</div>
              <div v-else class="level">{{ scope.row.levelname }}</div>
              
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="直接推广员别名" :formatter="formatterValue" width="180"></el-table-column>
      <el-table-column prop="phone" label="直接推广员手机" :formatter="formatterValue" width="180"></el-table-column>
      <el-table-column prop="commissionStr" label="直接收入佣金金额" :formatter="formatterValue"></el-table-column>
      <el-table-column label="间接推广员昵称/头像" width="200">
        <template slot-scope="scope">
          <div style="display:flex;align-items:center;">
            <div class="ima-title">
              <span v-if="scope.row.iavatar == '' || scope.row.iavatar == null">--</span>
              <img :src="scope.row.iavatar" v-else >
            </div>
            <div style="margin-left:5px;">
               <div v-if="scope.row.inickname == '' || scope.row.inickname == null">--</div>
              <div v-else >{{ scope.row.inickname }}</div>
             <div v-if="scope.row.ilevelname == ''  || scope.row.ilevelname == null">--</div>
              <div v-else class="level" >{{ scope.row.ilevelname }}</div>    
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="ialias" label="间接推广员别名" :formatter="formatterValue" width="180"></el-table-column>

      <el-table-column prop="iphone" label="间接接推广员手机" :formatter="formatterValue" width="180"></el-table-column>

      <el-table-column prop="indirectCommissionStr" label="间接推广佣金" :formatter="formatterValue"></el-table-column>
      <el-table-column label="累计客户(个)" :formatter="formatterValue"></el-table-column>

      <el-table-column label="结算状态">
        <template slot-scope="scope">
          <span v-if="scope.row.closeAccount == 0">未结算</span>
          <span v-if="scope.row.closeAccount == 1">已结算</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="100" label="是否结算">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-if="scope.row.closeAccount == 0"
            @click="closeAnAccount(scope.row)"
          >结算</el-button>
          <el-button type="primary" v-if="scope.row.closeAccount == 1" disabled>已结算</el-button>
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
  name: "record",
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
      date: "",
      condition: "",
      status: "",
      delodogstatus: "",
      tableData: [],
      options: [
        {
          value: "",
          label: "是否结算"
        },
        {
          value: "0",
          label: "未结算"
        },
        {
          value: "1",
          label: "已结算"
        }
      ],
      pageSize: 10,
      currentPage: 1,
      totalPage: 0
    };
  },
  watch: {
    activeName: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (newValue == "record") {
          this.getGeneralizeRecord();
        }
      },
      deep: true
    }
  },
  // mounted: function() {

  // },
  methods: {
    //格式化数据
    formatterValue(row, column, cellValue, index) {
      if (cellValue == undefined || cellValue == "") {
        return "--";
      } else {
        return cellValue;
      }
    },
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
        "api/backstage/expand/exportGeneralizeRecordExcel?param=" +
        encodeURIComponent(JSON.stringify(param)) +
        "&type=1&pageSize=" +
        this.pageSize +
        "&currentPage=" +
        this.currentPage;
    },
    //  结算
    closeAnAccount(row) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", row.id);
      that.$axios.post("/api/backstage/expand/closeAnAccount", params).then(
        res => {
          if (res.data.code == 200) {
            this.getGeneralizeRecord();
            this.$message.success("结算成功！");
          } else {
            that.$message.error("结算失败！");
          }
        },
        err => {
          that.$message.error("加载失败");
        }
      );
    },
    // 获取分销员列表
    getGeneralizeRecord() {
      var that = this;
      var str = {};
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
      if (this.condition != "") {
        str.condition = this.condition;
      }
      if (this.status != "") {
        str.status = this.status;
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
        .get("/api/backstage/expand/getGeneralizeRecord", { params })
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
      this.getGeneralizeRecord();
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
