<template>
  <div>
    <div>
      <el-input v-model="title" placeholder="请输入标题" style="width:30%"></el-input>
      <el-select v-model="order" placeholder="请选择">
        <el-option
          v-for="item in orderList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getSearchList">搜索</el-button>
    </div>
    <br>
    <el-table
      ref="singleTable"
      :data="searchList"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="subhead" label="副标题"></el-table-column>
      <el-table-column prop="typeName" label="类型"></el-table-column>
      <el-table-column prop="currentPriceStr" label="当前价格(元)"></el-table-column>
      <el-table-column prop="originalPriceStr" label="原价格(元)"></el-table-column>
      <el-table-column prop="questionNum" label="问题数量"></el-table-column>
      <el-table-column prop="reportPageNum" label="报告页数"></el-table-column>
      <el-table-column prop="testTime" label="测试时间"></el-table-column>
      <el-table-column prop="useNum" label="使用人数"></el-table-column>
      <el-table-column prop="baseUseNum" label="基础人数"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="danger">下架</el-tag>
          <el-tag v-if="scope.row.status==1" type="success">上架</el-tag>
          <el-tag v-if="scope.row.status==3">待发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          
          <el-button
            type="info"
            v-if="scope.row.status == 1"
            size="small"
            @click="openAdd(scope.row,0)"
          >推荐</el-button> 
          
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPage"
    ></el-pagination>

    <!-- 弹出框 -->
    <el-dialog title="选择测评" :visible.sync="dialogTableVisible">
      <div style="width:100%;display:flex;">
        <el-input v-model="modaltitle" placeholder="请输入标题" style="width:30%"></el-input>
        <!-- <el-select v-model="modalField" filterable placeholder="请选择" style="margin:0 5px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
        <el-button type="primary" @click="getSearchListWhere">搜索</el-button>
      </div>
      <br>
      <el-table :data="seList" border>
        <el-table-column label="序号"
      type="index"
      width="50">
    </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="subhead" label="副标题"></el-table-column>
        <el-table-column prop="currentPriceStr" label="当前价格" sortable></el-table-column>
        <el-table-column prop="originalPriceStr" label="原价格" sortable></el-table-column>
        <el-table-column prop="useNum" label="使用人数"  sortable></el-table-column>
        <el-table-column label="选择" prop="rid"  width="100" fixed="right">
          <template slot-scope="scope">
            <el-button  v-if="scope.row.isre == 0 " type="primary" size="small" @click="open(scope.row,0)">推荐</el-button>
            <el-button  v-else type="primary" size="small" @click="open(scope.row,1)">取消推荐</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @current-change="sehandleCurrentChange"
          :page-size="sepageSize"
          layout="prev, pager, next"
          :total="setotalPage"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picImg: "",
      title: "",
      modaltitle:"",
      typeId:"",
      searchList: [],
      seList: [],
      order: "0",
      orderList: [],
      field: "4",
      modalField:"4",
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
      securrentPage: 1,
      sepageSize: 10,
      setotalPage : 0,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      uploadUrl: "",
      currentId: "",
      appraisalId:"",
      dialogTableVisible: false,

    };
  },
  mounted: function() {
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.getSearchList();
    this.getTypeList();
  },
  methods: {
    //打开添加弹窗
    openAdd(scop) {
      this.dialogTableVisible = true;
      this.modaltitle ="";
      this.modalField = "4"
      this.getEvalList(scop);
    },
     //弹框确认
    open(row,type) {
      var that=this;
      var typeName="";
      var recommendId = row.recommendId
      if(type=="0"){
        typeName="添加推荐";
      }else{
        typeName="取消推荐";
      }
      this.$confirm("是否要"+typeName+""+ row.title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = new URLSearchParams();
          params.append("appraisalId",that.appraisalId);
           params.append("recommendId",row.id);
          params.append("type",type);
          params.append("tfk",sessionStorage.getItem("tfk"));
          that.$axios.post("/api/backstage/appraisal/recommend",params).then(
            res => {
              if (res.data.code == 200) {
                
                that.$message({
                  type: "success",
                  message: typeName+"成功!"
                });
                // this.dialogTableVisible = false;
                this.getSearchListWhere();
              } else {
                that.$message.error(typeName+"失败");
              }
            },
            err => {
            }
          );
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消"+typeName
          });
        });
    },
       //查询推荐
    getSearchListWhere() {
      var that = this;
       var params = new URLSearchParams();
      if(that.modaltitle != ""){
        params.append("title", this.modaltitle);
      }
       if (that.modalField != "" && that.modalField != "4") {
        params.append("typeId", that.modalField);
      }
      params.append("appraisalId", that.appraisalId);
      params.append("field", "create_date");
      params.append("order", "asc");
      params.append("currentPage", that.securrentPage);
      params.append("pageSize", that.sepageSize);
      params.append("tfk", sessionStorage.getItem("tfk"));
      that.$axios.post("/api/backstage/appraisal/searchRecommendList", params).then(
        res => {
          if (res.data.code == 200) {
            this.seList = res.data.datas.list
            this.setotalPage = res.data.datas.totalNum;
          } else {
          }
        },
        err => {
        }
      );
    },
    // 获取推荐 
    getEvalList(scop){
      this.appraisalId = scop.id;
      var that = this;
      var params = new URLSearchParams();
      params.append("appraisalId", scop.id);
      params.append("field", "create_date");
      params.append("order", "asc");
      params.append("currentPage", this.securrentPage);
      params.append("pageSize", this.sepageSize);
      params.append("tfk", sessionStorage.getItem("tfk"));
      that.$axios.post("/api/backstage/appraisal/searchRecommendList", params).then(
        res => {
          if (res.data.code == 200) {
            this.seList = res.data.datas.list
          } else {
          }
        },
        err => {
        }
      );
   
    },
    //编辑数据
    compileList(row, type) {
      var that = this;
      that.$router.push({
        name: "appraisalAdd",
        params: row
      });
    },
    //下架
    soldOut(row, type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", row.id);
      params.append("type", type);
      that.$axios.post("api/backstage/appraisal/soldOut", params).then(
        res => {
          if (res.data.code == 200) {
            that.getSearchList();
            that.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            that.$message.error(res.data.message);
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
    },
    //弹框分页查询
    sehandleCurrentChange(val) {
      this.securrentPage = val;
      this.getEvalList();
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
      params.append("field", "create_date");
      params.append("order", "asc");
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("tfk",sessionStorage.getItem("tfk"));
      params.append("status", 1);
      if (that.title != "") {
        params.append("title", that.title);
      }
      if (that.order != "" && that.order != "0") {
        params.append("typeId", that.order);
      }
      this.$axios.post("api/backstage/appraisal/searchList", params).then(
        res => {
          if (res.data.code == 200) {
            that.searchList = res.data.datas.list;
            that.totalPage = res.data.datas.totalNum;
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "success-row";
      } else {
        return "";
      }
      // else if (rowIndex === 3) {
      //   return 'warning-row';
      // }
      return "";
    }
  }
};
</script>

<style>
.leimg {
  width: 375px;
  height: 280px;
}
.leimg > .el-image__inner {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
.eldialog > .el-dialog {
  width: 40%;
}
.eldialog > .el-dialog > .el-dialog__body {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-table .warning-row {
  background: #efefef;
}

.el-table .success-row {
  background: #efefef;
}
</style>
