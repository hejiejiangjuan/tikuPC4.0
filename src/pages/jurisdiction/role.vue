<template>
  <div class="role">
    <div class="eletable">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="id" label="角色id"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
            <el-button type="primary"  size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  mounted: function() {
    this.roleList();
  },
  methods: {
    //初始化角色表格
    roleList() {
      var that = this;
      
      that.$axios.post("/api/backstage/role/list").then(
        res => {
          that.tableData = res.data.datas;
        },
        err => {
        }
      );
    },
    // 添加
    addRole() {
      this.dialogFormVisible = true;
    },
    // 点击删除
    handleClick(row) {
      var that = this;
      that
        .$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var params = new URLSearchParams();
          params.append("roleId", row.id);
          that.$axios.post("/api/backstage/role/delete", params).then(
            res => {
              if (res.data.code == "200") {
                this.roleList();
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                that.$message({
                  type: "info",
                  message: "删除失败!"
                });
              }
            },
            err => {
            }
          );
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.role {
  width: 100%;
  height: 100%;
}
.eletable {
  margin-top: 10px;
}
</style>
