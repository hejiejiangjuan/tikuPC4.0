<template>
  <div class="permission">
    <div class="permission-tree">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="角色名" width="180">
          <template slot-scope="scope">
            <el-popover placement="top">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="editorList(scope.$index, scope.row)"
              v-if="scope.row.static"
            >编辑权限</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="outroleList(scope.$index, scope.row)"
              v-if="scope.row.static"
            >删除</el-button>
            <el-button size="mini" type="info" @click="lookList(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-input v-model="roleName" placeholder="请输入内容" v-if="updateRoleName"></el-input>
      <!-- 添加角色  -->
      <div class="tianjia" @click="jiaNumber">+</div>
      <div class="tianjia-int" v-show="ishiden">
        <input type="text" class="ipttiankjia" v-model="introle" placeholder="输入角色名" />
        <input type="text" class="ipttiankjia" v-model="roleNameId" placeholder="输入角色id" />
        <el-button class="btntijiao" type="primary" @click="okBtn">确定添加</el-button>
      </div>
    </div>
    <div class="permission-tree-right">
      <!-- 新增 -->
      <el-tree
        v-show="isbodiu"
        :data="editordata"
        show-checkbox
        node-key="id"
        ref="treerole"
        :props="defaultProps"
        style="margin-top:20px;"
      ></el-tree>
      <!-- 查看 -->
      <el-tree :data="menudata" :props="defaultProps" v-show="islook"></el-tree>
      <!-- 编辑 -->
      <el-tree
        v-show="isedito"
        :data="editordata"
        show-checkbox
        :default-checked-keys="editokeys"
        node-key="id"
        ref="tree"
        :props="defaultProps"
        style="margin-top:20px;"
      ></el-tree>
      <!-- 编辑确认按钮-->
      <div class="permission-tree-topcenter" v-show="isedito" @click="editorOk">确认修改</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      static: false,
      roleNameId: "",
      role: [],
      menudata: [], //查看
      editordata: [], //编辑
      editokeys: [], //默认勾选
      defaultProps: {
        children: "children",
        label: "menu"
      },
      updateRoleName: false,
      islook: false,
      isedito: false,
      ishiden: false,
      isbodiu: false,
      powerlist: [],
      tableData: [],
      introle: "",
      roleId: "",
      roleName: ""
    };
  },
  watch: {
    checkedKeys(val) {}
  },
  mounted: function() {
    // this.getPermissionList();
    this.roleList();
  },
  methods: {
    handleEdit(index, row) {},

    //初始化角色列表
    roleList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("tfk", sessionStorage.getItem("tfk"));
      this.$axios.post("/api/backstage/role/list", params).then(
        res => {
          var arr = res.data.datas;
          var sar = [];
          for (var i in arr) {
            var str = {};
            str.data = arr[i].roleId;
            str.name = arr[i].roleName;
            str.roleType = arr[i].type;
            str.tfk = arr[i].tfk;
            str.id = arr[i].id;
            if (sessionStorage.getItem("type") == 1) {
              if (str.roleType == 1 && str.data == "super_admin") {
                str.static = false;
              } else if (
                (str.roleType == 2 && str.data == "system_admin") ||
                str.data == "dbo"
              ) {
                str.static = true;
              } else {
                str.static = true;
              }
            } else if (sessionStorage.getItem("type") == 2) {
              if (
                (str.roleType == 2 && str.data == "system_admin") ||
                str.data == "dbo"
              ) {
                str.static = false;
              } else if (str.roleType == 3) {
                str.static = true;
              }
            } else if (sessionStorage.getItem("type") == 3) {
              if (sessionStorage.getItem("tfk") == 1) {
                if (str.roleType == 1 && str.data == "super_admin") {
                  str.static = false;
                } else if (
                  (str.roleType == 2 && str.data == "system_admin") ||
                  str.data == "dbo"
                ) {
                  str.static = true;
                } else {
                  str.static = true;
                }
              } else {
                if (str.roleType == 1 && str.data == "super_admin") {
                  str.static = false;
                } else if (
                  (str.roleType == 2 && str.data == "system_admin") ||
                  str.data == "dbo"
                ) {
                  str.static = false;
                } else {
                  str.static = true;
                }
              }
            }

            sar.push(str);
          }
          that.tableData = sar;
        },
        err => {}
      );
    },
    //查看
    lookList(index, row) {
      this.updateRoleName = false;
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", row.data);
      params.append("type", sessionStorage.getItem("tfk"));
      this.$axios.post("/api/backstage/auth/getMenu", params).then(
        res => {
          this.isedito = false;
          this.islook = true;
          this.ishiden = false;
          this.isbodiu = false;
          this.menudata = res.data.datas;
        },
        err => {}
      );
    },
    // 调用方法
    demo(type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("type", type);
      that.$axios.post("/api/backstage/auth/getALLAuth", params).then(
        res => {
          that.editordata = res.data.datas;
        },
        err => {}
      );
    },
    //编辑
    editorList(id, row) {
      this.roleId = row.id;
      this.roleName = row.name;
      this.editordata = [];
      this.updateRoleName = true;
      this.islook = false;
      this.ishiden = false;
      this.isbodiu = false;
      this.isedito = true;
      var that = this;
      that.demo(sessionStorage.getItem("tfk"));
      var params = new URLSearchParams();
      params.append("roleId", row.data);
      params.append("type", sessionStorage.getItem("tfk"));
      that.$axios.post("/api/backstage/auth/getMenu", params).then(
        res => {
          var keys = res.data.datas;
          var opadta = [];
          for (var i in keys) {
            opadta.push(keys[i].id);
            for (var k in keys[i].children) {
              opadta.push(keys[i].children[k].id);
            }
          }
          that.editokeys = opadta;
        },
        err => {}
      );
    },

    // 删除角色
    outroleList(index, row) {
      this.islook = false;
      this.ishiden = false;
      this.isbodiu = false;
      this.isedito = false;
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
            err => {}
          );
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 确认修改
    editorOk() {
      // 点击提交
      var that = this;
      that.powerlist = [];
      var val = this.$refs.tree.getCheckedKeys();
      //原始数据
      const tdchildren = [];
      //对比val后数据
      const tdval = [];

      for (const i in that.editordata) {
        for (const k in that.editordata[i].children) {
          tdchildren.push(that.editordata[i].children[k]);
        }
      }
      for (const k in tdchildren) {
        for (const n in val) {
          if (tdchildren[k].id == val[n]) {
            tdval.push(tdchildren[k].pid);
            tdval.push(val[n]);
          }
        }
      }
      // 去掉重复的父节点
      var newArr = [];
      tdval.forEach(function(e) {
        if (!newArr.includes(e)) {
          newArr.push(e);
        }
      });
      for (const i in newArr) {
        that.powerlist.push(newArr[i]);
      }
      var params = new URLSearchParams();
      params.append("roleId", that.roleId);
      params.append("roleName", that.roleName);
      params.append("auth", JSON.stringify(that.powerlist));
      that.$axios.post("api/backstage/role/update", params).then(
        res => {
          this.isedito = false;
          this.updateRoleName = false;
          this.roleList();
          that.$message({
            type: "success",
            message: "提交成功!"
          });
        },
        err => {
          that.$message({
            type: "error",
            message: "提交失败!"
          });
        }
      );
    },
    // 添加角色
    jiaNumber() {
      this.islook = false;
      this.ishiden = true;
      this.isbodiu = true;
      this.isedito = false;
      this.updateRoleName = false;
      this.demo(sessionStorage.getItem("tfk"));
    },
    // 确定添加
    okBtn() {
      var that = this;
      var val = that.$refs.treerole.getCheckedKeys();
      if (that.introle == "") {
        return this.$message.error("角色名为空！");
      }
      if (that.introle == "") {
        return this.$message.error("角色id为空！");
      }
      if (val == "") {
        return this.$message.error("你还未分配菜单权限！");
      }
      var params = new URLSearchParams();
      params.append("roleName", that.introle);
      params.append("auth", val);
      params.append("roleId", that.roleNameId);
      params.append("tfk", sessionStorage.getItem("tfk"));
      that.$axios.post("/api/backstage/role/add", params).then(
        res => {
          if (res.data.code == 200) {
            this.roleList();
            that.$message({
              type: "success",
              message: "提交成功!"
            });
            this.islook = false;
            this.ishiden = false;
            this.isbodiu = false;
            this.isedito = false;
            this.roleNameId = "";
            this.introle = "";
          } else if (res.data.code == 300) {
            this.$message.error(res.data.message);
          } else {
            this.$message.error("添加失败！");
          }
        },
        err => {
          that.$message({
            type: "error",
            message: "提交失败!"
          });
        }
      );
    }
  }
};
</script>
<style>
.permission {
  width: 100%;
  height: 100%;
  display: flex;
}
.permission-tree {
  width: 500px;
  height: 100%;
  overflow-x: hidden;
  border: 1px solid #cccccc;
}
.permission-ul {
  width: 100%;
  list-style: none;
}
.permission-ul-li {
  width: 90%;
  padding: 10px 10px;
  height: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.permission-ul-li-span {
  display: block;
}
.permission-span {
  display: inline-block;
  width: 68px;
  height: 32px;
  border-radius: 50px;
  text-align: center;
  line-height: 32px;
  background: #cccccc;
}
.permission-ul-li-spanadminbianji {
  background: #409eff;
}
.permission-tree-right {
  width: 50%;
  height: 100%;
  overflow-x: hidden;
  margin-left: 30px;
}
.permission-treeright-left {
  width: 50%;
  height: 100%;
}
.permission-treeright-right {
  width: 50%;
  height: 100%;
}
.permissiontijao-button {
  width: 103px;
  background: #409eff;
  border: none;
  border-radius: 5px;
  padding: 8px 11px;
  margin: 10px;
}

.okBtn {
  width: 30%;
  height: 100%;
  border: none;
  background: #cccccc;
}
.permission-tree-topcenter {
  width: 100px;
  height: 35px;
  margin-left: 10px;
  text-align: center;
  line-height: 35px;
  background: #409eff;
  color: #ffffff;
  border-radius: 20px;
}
.tianjia {
  width: 50px;
  height: 50px;
  margin: 15px auto;
  border: 1px solid #cccccc;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
  color: #cccccc;
}
.tianjia-int {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 50px 0;
}
.ipttiankjia {
  width: 75%;
  height: 100%;
  border: 1px solid #cccccc;
  padding-left: 10px;
  margin: 20px 5px;
}
.btntijiao {
  width: 20%;
  height: 100%;
  border: none;
  background: #409eff;
  color: #ffffff;
}
</style>
