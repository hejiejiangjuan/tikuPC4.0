<template>
  <div>
    <div>
      <el-input placeholder="请输入内容" v-model="title" class="input-with-select" style="width:20%">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
    </div>
    <div>
      <br>
      <el-table
        ref="singleTable"
        border
        highlight-current-row
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="create_date" label="创建时间"></el-table-column>
        <el-table-column prop="use_num" label="使用人数" sortable></el-table-column>
        <el-table-column prop="payNum" label="收益总金额" sortable></el-table-column>
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
      title: "",
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: []
    };
  },
  mounted: function() {
    this.getSearchList();
  },
  methods: {
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
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      if (that.title != "") {
        params.append("title", that.title);
      }
      this.$axios.post("api/backstage/appraisal/getList", params).then(
        res => {
          if (res.data.code == 200) {
            that.tableData = res.data.datas.list;
            that.totalPage = res.data.datas.count;
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
</style>
