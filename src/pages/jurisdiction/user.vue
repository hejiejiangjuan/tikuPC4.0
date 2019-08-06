<template>
  <div class="adduserlist">
    <div class="adduserlist-top">
      <div class="elinput">
        <el-input v-model="usName" placeholder="用户姓名" style="width:80%"></el-input>
      </div>
      <div class="elinput">
        <el-select v-model="usType" style="width:80%">
          <el-option
            v-for="item in opDate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="elinput" v-if="tfk == 1">
        <el-select v-model="tenant" filterable  clearable style="width:80%">
          <el-option
            v-for="item in tenants"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="elinput">
        <el-select v-model="usRole" clearable style="width:80%">
          <el-option
            v-for="item in usRoleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="chaxunApi">查询</el-button>
      <el-button type="info" @click="addUserModel =true">新增用户</el-button>
    </div>
    <div class="adduser-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-text="数据加载中"
      >
        <el-table-column fixed prop="userName" label="用户名"></el-table-column>
        <el-table-column fixed prop="alias" label="用户别名"></el-table-column>
        <el-table-column prop="userSex" label="用户性别"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="roleName" label="用户角色"></el-table-column>
        <el-table-column prop="userType" label="用户类型"></el-table-column>
        <el-table-column prop="tfkName" label="所属租户" v-if="tfk ==1 "></el-table-column>
        <el-table-column prop="status" label="账号状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '正常' ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="forbidden(scope.row)"
              type="danger"
              size="small"
              v-if="scope.row.status=='正常'"
              v-show="scope.row.caozuo"
            >禁用</el-button>
            <el-button @click="forbidden(scope.row)" type="primary" size="small" v-else>启用</el-button>
            <el-button @click="handleClick(scope.row)" type="success" size="small" v-show="scope.row.caozuo">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出编辑框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.tiname" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户别名" :label-width="formLabelWidth">
            <el-input v-model="form.alias" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-select v-model="userSex" style="width:100%;" placeholder="请选择性别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          

          <el-form-item label="用户角色" :label-width="formLabelWidth">
            <el-select style="width:100%;" v-model="userRolevalue" placeholder="请选择用户角色">
              <el-option
                filterable
                v-for="item in addUserRolevalueList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogOk">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出提示框 -->
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <span style="display:block;width:100%;margin:0 auto;color:red;">你是否要{{biddentext}}该账号？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="biddenOk">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户新增弹出框 -->
      <el-dialog title="添加新用户" :visible.sync="addUserModel">
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="addUserName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户别名" :label-width="formLabelWidth">
            <el-input v-model="alias" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-select v-model="addUserSex" style="width:100%;" placeholder="请选择性别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="addUserPhone" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="用户角色" :label-width="formLabelWidth">
            <el-select style="width:100%;" v-model="addUserRolevalue" placeholder="请选择用户角色">
              <el-option
                filterable
                v-for="item in addUserRolevalueList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserModel = false,addUserremove">取 消</el-button>
          <el-button type="primary" @click="addUserInfo">确 定</el-button>
        </div>
      </el-dialog>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ElementUI, { Message } from "element-ui";
export default {
  data() {
    return {
      caozuo:false,
      tenants: [],
      tenant: "",
      tfk:sessionStorage.getItem("tfk"),
      tfks:'',
      loading: false,
      usName: "",
      usCode: "",
      usPhone: "",
      userName: "",
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableData: [],
      userRole: [],
      userRolevalue: "",
      addUserRolevalue: "",
      addUserName: "",
      addUserSex: "",
      addUserPhone: "",
      addUserModel: false,
      alias:'',
      addUserRolevalueList: [],
      options: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        },
        {
          value: "0",
          label: "未知"
        }
      ],
      opDate: [
        {
          value: "2",
          label: "请选择用户类型"
        },
        {
          value: "0",
          label: "管理员"
        },
        {
          value: "1",
          label: "普通用户"
        }
      ],
      usRoleList: [],
      usRole: "",
      userSex: "",
      usType: "2",
      biddentext: null,
      uesrform: null,
      centerDialogVisible: false,
      row: null,
      dialogFormVisible: false,
      form: {
        name: "",
        Code: "",
        phone: "",
        tiname: "",
        cosplay: "",
        alias:"",
      },
      formLabelWidth: "120px"
    };
  },
  mounted: function() {
    this.getRoleList();
    this.getUserRoleList();
    this.getTenant();
  },
  methods: {
    // 清空
    addUserremove(){
      this.addUserName = "";
      this.alias = "";
      this.addUserSex = "";
      this.addUserPhone = "";
      this.addUserRolevalue = "";
      
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
    //添加用户
    addUserInfo() {
      var that = this;
      var params = new URLSearchParams();
      if (that.addUserName == "") {
        that.$message.error("请输入用户名");
        return;
      }
      var res = /^[0-9a-zA-Z]*$/g;
      if (!res.test(that.addUserName)) {
        return this.$message.error("用户名只能为字母或数字！");
      }
      if (that.addUserSex == "") {
        that.$message.error("请选择用户性别");
        return;
      }
      if (that.addUserPhone == "") {
        that.$message.error("请输入用户手机号");
        return;
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.addUserPhone)) {
        return this.$message.error("手机号格式不正确！");
      }
      if (that.addUserRolevalue == "0" || that.addUserRolevalue == "") {
        that.$message.error("请选择用户角色");
        return;
      }
      params.append("username", that.addUserName);
      params.append("phone", that.addUserPhone);
      params.append("userSex", that.addUserSex);
      params.append("roleId", that.addUserRolevalue);
      params.append("tfk", sessionStorage.getItem("tfk"));
      params.append("alias", that.alias);
      this.$axios.post("api/backstage/user/register", params).then(
        res => {
          if (res.data.code == 200) {
            that.addUserModel = false;
            that.addUserremove();
            that.getRoleList();
            that.$message.success("添加成功");
          } else if(res.data.code == 300){
            that.$message.error(res.data.message);
            that.addUserremove();
          }
        },
        err => {
        }
      );
    },
    //获取角色列表
    getUserRoleList() {
      var that=this;
      var params = new URLSearchParams();
      params.append("tfk",that.tfk);
      this.$axios.post("api/backstage/role/list",params).then(
        res => {
          if (res.data.code == 200) {
            var datas = res.data.datas;
            var userRoleList = [];
            for (var i = 0; i < datas.length; i++) {
              var userRole = {};
              userRole.value = datas[i].id;
              userRole.label = datas[i].roleName;
              userRoleList.push(userRole);
            }
            this.usRoleList = userRoleList;
            this.addUserRolevalueList = userRoleList;
          } else {
          }
        },
        err => {
        }
      );
    },
    // 禁用
    forbidden(row) {
      this.centerDialogVisible = true;
      if (row.status == "正常") {
        this.biddentext = "禁用";
      } else if (row.status == "禁用") {
        this.biddentext = "启用";
      }
      this.row = row;
    },
    biddenOk() {
      var that = this;
      var params = new URLSearchParams();
      var flag = "";
      var type = "";
      if (that.row.status == "正常") {
        flag = 0;
        type = "禁用";
      } else {
        flag = 1;
        type = "启用";
      }
      let userInfo = JSON.stringify({
        id: that.row.id,
        type: flag
      });
      params.append("userId", that.row.id);
      params.append("type", flag);
      this.$axios.post("/api/backstage/user/forbidden", params).then(
        res => {
          if (res.data.code == 200) {
            this.centerDialogVisible = false;
            this.getRoleList();
          } else {
          }
        },
        err => {
        }
      );
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRoleList();
    },
    // 查询
    chaxunApi() {
      this.getRoleList();
    },
    //初始化表格tenant
    getRoleList() {
      var that = this;
      var params = new URLSearchParams();
      if (this.usType != "" && this.usType != "2") {
        params.append("userType", this.usType);
      }
      if (this.usRole != "" && this.usRole != "0") {
        params.append("roleId", this.usRole);
      }
      if (this.usName != "") {
        params.append("username", that.usName);
      }
      if(this.tenant == null || this.tenant == "" ){
        params.append("tfk", sessionStorage.getItem("tfk"));
      }else{
        params.append("tfk", this.tenant);
      }
      params.append("currentPage", that.pageNum);
      
      params.append("pageSize", that.pageSize);
      // that.loading=true;de
      that.$axios.post("/api/backstage/user/getList", params).then(
        res => {
          if (res.data.code == 200) {
            var list = res.data.datas.list;
            var arr = [];
            for (var i in list) {
              var str = {};
              str.createDate = list[i].createDate;
              str.id = list[i].id;
              str.password = list[i].password;
              if (list[i].phone != "null") {
                str.phone = list[i].phone;
              }
              str.roleId = list[i].roleId;
              str.roleName = list[i].roleName;
              str.userName = list[i].userName;
              str.tfkName = list[i].tfkName;
              if(list[i].userName!=sessionStorage.getItem("username")){
                str.caozuo=true;
              }
              if(list[i].alias != null || list[i].alias != ""){
                str.alias=list[i].alias;
              }else{
                str.alias="";
              }
              if (list[i].userSex == "1") {
                str.userSex = "男";
              } else if (list[i].userSex == "2") {
                str.userSex = "女";
              } else {
                str.userSex = "未知";
              }
              if (list[i].userType == "0") {
                str.userType = "超级管理员";
              } else if (list[i].userType == "1") {
                str.userType = "普通用户";
              }
              if (list[i].status == "0") {
                str.status = "禁用";
              } else if (list[i].status == "1") {
                str.status = "正常";
              }
              arr.push(str);
            }
            that.tableData = arr;

            that.count = Number(res.data.datas.totalNum);
            that.loading = false;
          }
        },
        err => {
        }
      );
    },
    //编辑
    handleClick(row) {
      this.form.phone = row.phone;
      this.form.tiname = row.userName;
      this.form.alias = row.alias;
      this.userRolevalue = row.roleId;
      this.userSex = row.userSex;
      this.dialogFormVisible = true;
      this.uesrform = row;
    },
    dialogOk() {
       var res = /^[0-9a-zA-Z]*$/g;
      if (!res.test(this.form.tiname)) {
        return this.$message.error("用户名只能为字母或数字！");
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.form.phone)) {
        return this.$message.error("手机号格式不正确！");
      }
      var params = new URLSearchParams();
      params.append("id", this.uesrform.id);
      params.append("username", this.form.tiname);
      params.append("alias", this.form.alias);
      params.append("userSex", this.userSex);
      params.append("phone", this.form.phone);
      params.append("roleId", this.userRolevalue);
      this.$axios.post("/api/backstage/user/update", params).then(
        res => {
          if (res.data.code == 200) {
           this.$message.success("添加成功");
            this.getRoleList();
            this.dialogFormVisible = false;
          } else {
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
.adduserlist {
  width: 100%;
}

.el-table {
}
.elinput {
  width: 20%;
  float: left;
}
.adduser-table {
  /* width: 100%; */
  /* height: 100%; */
  margin-top: 20px;
}
</style>

