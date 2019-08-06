<template>
  <div>
    <div >
      <el-select v-model="tenant" filterable clearable placeholder="请选择" v-if="tfk ==1 ">
        <el-option
          v-for="item in tenants"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getList" v-if="tfk ==1 ">搜索</el-button>
      <el-button type="info" @click="openAdd">新增</el-button>
    </div>
    <br><br>
    <el-table ref="singleTable" :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="subhead" label="副标题"></el-table-column>
      <el-table-column prop="currentPraceStr" label="当前价格(元)"></el-table-column>
      <el-table-column prop="originalPraceStr" label="原价格(元)"></el-table-column>
      <el-table-column prop="stayTimeStr" label="停留时间（小时）"></el-table-column>
      <el-table-column prop="putawayDate" label="上架时间"></el-table-column>
      <el-table-column prop="useNum" label="购买人数"></el-table-column>
      <el-table-column prop="clickNum" label="点击次数"></el-table-column>
      <el-table-column prop="tfkName" label="所属租户" v-if="tfk ==1 "></el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="moveAppraisalId(scope.row,0)">上移</el-button>
          <el-button type="success" size="small" @click="moveAppraisalId(scope.row,1)">下移</el-button>
          <el-button type="danger" size="small" @click="open(scope.row,1)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="选择测评" :visible.sync="dialogTableVisible">
      <div>
        <el-input v-model="title" placeholder="请输入标题" style="width:30%"></el-input>
        <el-select v-model="field" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="order" placeholder="请选择">
          <el-option
            v-for="item in orderList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getSearchListWhere">搜索</el-button>
      </div>
      <br>
      <el-table :data="searchList" border>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="subhead" label="副标题"></el-table-column>
        <el-table-column prop="currentPriceStr" label="当前价格" sortable></el-table-column>
        <el-table-column prop="originalPriceStr" label="原价格" sortable></el-table-column>
        <el-table-column prop="useNum" label="使用人数" sortable></el-table-column>
        <el-table-column label="选择" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="open(scope.row,0)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tfk: sessionStorage.getItem("tfk"),
      tenants: [],
      tenant: "",
      tableData: [],
      dialogTableVisible: false,
      title: "",
      searchList: [],
      order: "0",
      orderList: [],
      field: "4",
      options: [
        {
          value: "4",
          label: "请选择状态"
        },
        {
          value: "0",
          label: "下架"
        },
        {
          value: "1",
          label: "上架"
        },
        {
          value: "2",
          label: "删除"
        },
        {
          value: "3",
          label: "待发布"
        }
      ],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  mounted: function() {
    this.getList();
    this.getTypeList();
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
    //移动数据
    moveAppraisalId(row, type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("appraisalId", row.appraisalId);
      params.append("type", type);
      that.$axios.post("api/backstage/new/move", params).then(
        res => {
          if (res.data.code == 200) {
            that.getList();
            that.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {}
      );
    },
    //打开添加确认框
    open(row, type) {
      var that = this;
      var typeName = "";
      var appraisalId = "";
      if (type == "0") {
        typeName = "新增";
        appraisalId = row.id;
      } else {
        typeName = "下架";
        appraisalId = row.appraisalId;
      }
      this.$confirm("是否要" + typeName + "" + row.title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = new URLSearchParams();
          params.append("appraisalId", appraisalId);
          params.append("type", type);
          that.$axios.post("api/backstage/new/add", params).then(
            res => {
              if (res.data.code == 200) {
                that.getList();
                that.dialogTableVisible = false;
                that.$message({
                  type: "success",
                  message: typeName + "成功!"
                });
              } else {
                that.$message.error(typeName + "失败");
              }
            },
            err => {}
          );
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消" + typeName
          });
        });
    },
    //条件查询
    getSearchListWhere() {
      this.getSearchList();
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
        err => {}
      );
    },
    //分页查询
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSearchList();
    },
    //打开添加弹窗
    openAdd() {
      this.dialogTableVisible = true;
      this.getSearchList();
    },
    //请求测评列表数据
    getSearchList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("field", "create_date");
      params.append("order", "asc");
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("type", "2");
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.order != "" && that.order != "0") {
        params.append("typeId", that.order);
      }
      if (that.field != "" && that.field != "4") {
        params.append("status", that.field);
      }
      this.$axios.post("api/backstage/appraisal/searchListAndTfk", params).then(
        res => {
          if (res.data.code == 200) {
            that.searchList = res.data.datas.list;
            that.totalPage = res.data.datas.totalNum;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    //请求列表数据
    getList() {
      var that = this;
      var params = new URLSearchParams();
      if (that.tenant != null && that.tenant != "") {
        params.append("tenant", that.tenant);
      } else {
        params.append("tenant", that.tfk);
      }
      this.$axios.post("api/backstage/new/list", params).then(
        res => {
          if (res.data.code == 200) {
            that.tableData = res.data.datas;
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
