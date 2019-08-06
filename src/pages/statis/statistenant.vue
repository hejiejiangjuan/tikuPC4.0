<template>
  <div>
    <div>
      <el-select v-model="tenant" filterable clearable placeholder="请选择租户">
        <el-option
          v-for="item in tenants"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="type" placeholder="请选择" >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="getList" type="primary">搜索</el-button>
    </div>
    <div>
      <br />
      <el-table
        ref="singleTable"
        border
        highlight-current-row
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="tenant_name" label="租户名称"></el-table-column>
        <el-table-column prop="create_date" label="创建时间"></el-table-column>
        <el-table-column prop="orderCount" label="订单数量" sortable></el-table-column>
        <el-table-column prop="payment" label="收益总金额" sortable></el-table-column>
        <el-table-column prop="divide_payment" label="提成金额" sortable></el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tenants: [],
      tenant: "",
      currentPage: 1,
      pageSize: 20,
      totalPage: 0,
      tableData: [],
      type: "5",
      options: [
        {
          value: "0",
          label: "上周"
        },
        {
          value: "1",
          label: "本周"
        },
        {
          value: "2",
          label: "上月"
        },
        {
          value: "3",
          label: "本月"
        },
        {
          value: "4",
          label: "本季度"
        },
        {
          value: "5",
          label: "全部"
        }
      ]
    };
  },
  mounted: function() {
    this.getSearchList();
    this.getTenant();
  },
  methods: {
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
    //条件搜索
    getList() {
      this.getSearchList();
    },
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSearchList();
    },
    //请求测评列表数据
    getSearchList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("type", that.type);
      if(that.tenant!=null && that.tenant!=""){
        params.append("tfk", that.tenant);
      }

      this.$axios.post("api/backstage/tenant/getStatistenant", params).then(
        res => {
          if (res.data.code == 200) {
            that.tableData = res.data.datas.list;
            for(var i=0;i<that.tableData.length;i++){
              if(that.tableData[i].tfk==1){
                that.tableData[i].divide_payment="--";
              }
            }
            that.totalPage = res.data.datas.count;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    }
  }
};
</script>
<style>
</style>
