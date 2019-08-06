<template>
  <div>
    <div class="config">
      <el-table :data="datasList" border style="width: 100%">
        <el-table-column fixed prop="name" label="推广级别"></el-table-column>
        <el-table-column label="升级规则">
          <template slot-scope="scope">
            <span v-if="scope.row.id == '1'">所有推广员默认等级</span>
            <div v-else>
              <div class="checkbox-div" v-if="index ==scope.row.id">
                <el-checkbox v-model="scope.row.useCus">累计推广客户</el-checkbox>
                <el-input
                  style="width:60%;"
                  v-model="scope.row.addupCustomer"
                  :disabled="!scope.row.useCus"
                ></el-input>
                <span style="padding:0 8px;">人</span>
              </div>
              <div class="checkbox-div" v-else>
                <span >累计推广客户</span>
                <span style="padding:0 10px">{{scope.row.addupCustomer}}</span>
                <span style="padding:0 8px;">人</span>
              </div>

              <div class="checkbox-div" style="margin:10px 0;" v-if="index ==scope.row.id">
                <el-checkbox v-model="scope.row.useCom">累计推广佣金</el-checkbox>
                <el-input
                  style="width:60%;"
                  v-model="scope.row.addupCommission"
                  :disabled="!scope.row.useCom"
                ></el-input>
                <span style="padding:0 8px;">人</span>
              </div>
              <div class="checkbox-div" style="margin:10px 0;" v-else>
                <span>累计推广佣金</span>
                <span style="padding:0 10px">{{scope.row.addupCommission}}</span>
                <span style="padding:0 8px;">人</span>
              </div>
              <div class="checkbox-div"  v-if="index ==scope.row.id">
                <el-checkbox v-model="scope.row.useInvite">累计邀请数</el-checkbox>
                <el-input
                  style="width:60%;"
                  v-model="scope.row.addupInvite"
                  :disabled="!scope.row.useInvite"
                ></el-input>
                <span style="padding:0 8px;">人</span>
              </div>
              <div class="checkbox-div" v-else>
                <span>累计邀请数</span>
                <span style="padding:0 10px">{{scope.row.addupInvite}}</span>
                <span style="padding:0 8px;">人</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="默认直接推广佣金比例">
          <template slot-scope="scope">
            <div v-if="scope.row.id == index">
              <el-input
                style="width:50%;"
                v-model="scope.row.defaultDirectRatio"
                placeholder="请输入内容"
              ></el-input>
              <span style="padding-left:10px;">%</span>
            </div>
            <span v-else>{{scope.row.defaultDirectRatio}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="默认间接推广佣金比例">
          <template slot-scope="scope">
            <div v-if="scope.row.id == index">
              <el-input
                style="width:50%;"
                v-model="scope.row.defaultIndirectRatio"
                placeholder="请输入内容"
              ></el-input>
              <span style="padding-left:10px;">%</span>
            </div>
            <span v-else>{{scope.row.defaultIndirectRatio}}%</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.id == index">
              <el-button type="text" size="small" @click="updateDisUserLevel(scope.row,index)">保存</el-button>
              <el-button type="text" size="small" @click="handleClick">取消</el-button>
            </div>
            <div v-else>
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button
                @click="removeClick(scope.row,105)"
                type="text"
                v-if="datasList[(datasList.length-1)].id == scope.row.id && datasList[(datasList.length-1)].id != 1"
                size="small"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tianjiayige">
      <span>*选择多个升级条件时，需要同时满足才能升级</span>
      
    </div>
    <div class="dengjiadm" @click="hoverClick" v-if="datasList.length < len">添加等级</div>
    <!-- <div class="btn-ok">
      <el-button type="primary" @click="updateDisUserLevel">完成</el-button>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      len:3,
      tableData: [],
      datasList: [],
      ishaind: false,
      index: "",
      useCus: false, //推广状态
      useCom: false,
      useInvite: false,
      haind: true,
      showHind: true
    };
  },
  mounted: function() {
    this.getLevelList();
  },
  methods: {
    // 添加
    hoverClick() {
      var str = {};
      for (var i in this.tableData) {
        for (var k in this.datasList) {
          if (
            this.tableData[i].status != this.datasList[k].status &&
            this.datasList <= this.tableData
          ) {
            this.tableData[i].status = "1";
            str = this.tableData[i];
            this.datasList.push(str);
            return;
          }
        }
      }
    },
    // 编辑
    handleClick(row) {
      this.index = row.id;
      this.haind = false;
    },
    // 删除
    removeClick(row,number) {
      var num = this.datasList.length - 1;
      if (this.datasList.length != 1) {
        this.datasList[num].status = "0";
        this.datasList.pop();
         this.updateDisUserLevel(row,number);
        this.showHind = true;
       
      }
    },
    // 修改完成
    updateDisUserLevel(row, index) {
      if(index != 105){
        if (
        row.defaultDirectRatio <= this.datasList[index - 2].defaultDirectRatio &&
        row.id != "1"
      ) {
        this.$message.error(row.name + "佣金必须比上一等级佣金高！");
        return;
      }
      if (
        row.defaultIndirectRatio <=
          this.datasList[index - 2].defaultIndirectRatio &&
        row.id != "1"
      ) {
        this.$message.error(row.name + "佣金必须比上一等级佣金高！");
        return;
      }
      }
      var that = this;
      if (row.useCus == false) {
        row.useCus = "0";
      } else if (row.useCus == true) {
        row.useCus = "1";
      }
      if (row.useInvite == false) {
        row.useInvite = "0";
      } else if (row.useInvite == true) {
        row.useInvite = "1";
      }
      if (row.useCom == false) {
        row.useCom = "0";
      } else if (row.useCom == true) {
        row.useCom = "1";
      }
      var params = new URLSearchParams();
      params.append("param", JSON.stringify(row));

      that.$axios.post("/api/backstage/expand/updateDisUserLevel", params).then(
        res => {
          if (res.data.code == 200) {
            this.index = "";
            this.datasList = [];
            this.getLevelList();
           if(index == 105){
              this.$message.success("删除成功！");
           }else{
              this.$message.success("保存成功！");
           }
          } else {
            this.$message.error("保存失败");
          }
        },
        err => {
          that.$message.error("加载失败");
        }
      );
    },
    // 获取等级
    getLevelList() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios
        .get("/api/backstage/expand/getDisUserLevelList", { params })
        .then(
          res => {
            if (res.data.code == 200) {
              var arr = res.data.datas;
              for (var i in arr) {
                if (arr[i].useCus == "0") {
                  arr[i].useCus = false;
                } else if (arr[i].useCus == "1") {
                  arr[i].useCus = true;
                }
                if (arr[i].useInvite == "0") {
                  arr[i].useInvite = false;
                } else if (arr[i].useInvite == "1") {
                  arr[i].useInvite = true;
                }
                if (arr[i].useCom == "0") {
                  arr[i].useCom = false;
                } else if (arr[i].useCom == "1") {
                  arr[i].useCom = true;
                }
                if (arr[i].status == "1") {
                  this.datasList.push(arr[i]);
                }
              }
              this.tableData = res.data.datas;
            } else {
              that.$message.error("查询失败");
            }
          },
          err => {
            that.$message.error("加载失败");
          }
        );
    }
  }
};
</script>

<style>
.config {
  display: flex;
  margin-top: 25px;
  padding-left: 10px;
}
.config-title {
  margin-right: 20px;
}
.ET4 {
  font-size: 14px;
}
.ET3 {
  font-size: 14px;
}
.EC8 {
  color: #888;
}
.config-div-table {
  width: 100%;
}
.li-top {
  width: 100%;
  text-align: center;
  background: #e9e9e9;
  height: 40px;
  line-height: 40px;
}
.tianjiayige {
  padding: 10px 15px;
  font-size: 12px;
  color: #888;
}
.dengjiadm {
  padding: 10px 20px;
  font-size: 15px;
  color: #2a75ed;
  cursor: pointer;
}
.checkbox-div {
  display: flex;
  align-items: center;
}
.btn-ok {
  width: 100%;
  margin-top: 40px;
  text-align: center;
}
</style>
