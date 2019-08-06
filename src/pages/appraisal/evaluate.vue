<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-input v-model="title" placeholder="测评标题" style="width:15%"></el-input>
      <el-input v-model="username" placeholder="用户名" style="width:15%"></el-input>
      <el-input v-model="experience" placeholder="评价内容" style="width:15%"></el-input>
      <el-select v-model="value">
        <el-option
          v-for="item in orderList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="evaluate">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="测评标题"></el-table-column>
      <el-table-column prop="nickname" label="用户名"></el-table-column>
      <el-table-column prop="praiseNum" label="点赞数量"></el-table-column>
      <el-table-column prop="typeName" label="测试类型"></el-table-column>
      <el-table-column prop="understandability" label="题目易懂性(分)"></el-table-column>
      <el-table-column prop="veracity" label="题目准确性(分)"></el-table-column>
      <el-table-column prop="practicability" label="题目实用性(分)"></el-table-column>
      <el-table-column prop="anonymity" label="是否匿名">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.anonymity=='0'" type="danger">否</el-tag>
          <el-tag v-if="scope.row.anonymity=='1'" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="experience" label="测评内容"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='0'" type="warning">待审核</el-tag>
          <el-tag v-if="scope.row.status=='1'" type="success">通过</el-tag>
          <el-tag v-if="scope.row.status=='2'" type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="status" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="getEvaluateOk(scope.row,1)"
            v-if="scope.row.status=='1'"
            type="danger"
            size="small"
          >不通过</el-button>
          <el-button
            @click="getEvaluateOk(scope.row,0)"
            v-if="scope.row.status=='0' || scope.row.status=='2'"
            type="primary"
            size="small"
          >通过</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      experience: "",
      title: "",
      username: "",
      adminNo: "",
      pageSize: 10,
      currentPage: 1,
      totalNum: 0,
      tableData: [],
      orderList: [],
      value: ""
    };
  },

  mounted() {
    this.getTypeList();
    this.evaluate();
  },
  methods: {
    // 是否通过
    getEvaluateOk(index, type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", index.id);
      params.append("type", type);
      
      this.$axios.post("/api/backstage/evaluate/updateStatus", params).then(
        res => {
          if (res.data.code == 200) {
            this.evaluate();
            that.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {
        }
      );
    },
    //翻页
    autherCurrentChange(val) {
      this.currentPage = val;
      this.evaluate();
    },

    // 隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "success-row";
      }
      return "";
    },
    // 获取评价
    evaluate() {
      var that = this;
      var params = new URLSearchParams();
      params.append("currentPage", that.currentPage);
      params.append("pageSize", that.pageSize);
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.username != "") {
        params.append("username", that.username);
      }
      if (that.experience != "") {
        params.append("experience", that.experience);
      }
      if (that.value != "") {
        params.append("typeId", that.value);
      }
      
      this.$axios.post("/api/backstage/evaluate/searchList", params).then(
        res => {
          if (res.data.code == 200) {
            this.tableData = res.data.datas.list;
            this.totalNum = res.data.datas.totalNum;
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
