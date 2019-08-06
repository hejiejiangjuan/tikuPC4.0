<template>
  <div class="type">
    <div style="width:100%; display:flex;">
      <el-dialog title="类型名称" width="30%" :visible.sync="dialogFormVisible">
        <el-input v-model="name"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addType">确 定</el-button>
        </div>
      </el-dialog>
      <div style="margin-left: 1%">
        <el-card shadow="always" style="text-align: center;">
          <el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">新增类型</el-button>
        </el-card>
      </div>
    </div>
    <div class="type-list-center">
      <div class="type-list" v-for="(item,index) in typedata" :key="index">
        <el-card shadow="always">
          <el-form ref="form" label-width="80px" label-position="left">
            <el-form-item label="类型名称">
              <el-input :disabled="item.disabled" v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-input :disabled="true" v-model="item.createDate"></el-input>
            </el-form-item>
            <div class="btn-type">
              <!-- <el-button type="success" v-show="item.disabled" @click="amendType(index)">修改</el-button>
              <el-button type="success" v-show="!item.disabled" @click="amendTypeOK(index)">确定</el-button>-->
              <el-button type="warning" v-if="item.status == 0" @click="putaway(index)">上架</el-button>
              <el-button type="danger" v-if="item.status == 1" @click="soldlt(index)">下架</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typedata: [],
      name: "",
      dialogFormVisible: false
    };
  },

  mounted: function() {
    this.typeList();
  },
  methods: {
    // 新增

    addType() {
      if (this.name == "") {
        this.$message.error("值不能为空！");
      } else {
        var params = new URLSearchParams();
        params.append("name", this.name);
        this.$axios.post("/api/backstage/type/addOrUpdate", params).then(
          res => {
            if (res.data.code == 200) {
              this.$message({
                message: "新增成功！",
                type: "success"
              });
              this.typeList();
              this.dialogFormVisible = false;
            } else {
              this.$message.error("新增失败！");
            }
          },
          err => {}
        );
      }
    },
 
    //上架
    putaway(index) {
      this.$confirm("此操作将上架该类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var i = 0; i < this.typedata.length; i++) {
            if (index == i) {
              this.typedata[i].status = 1;
            }
          }
          var params = new URLSearchParams();
          params.append("id", this.typedata[index].id);
          params.append("type", this.typedata[index].status);
          this.$axios.post("/api/backstage/type/status", params).then(
            res => {
              if (res.data.code == 200) {
                this.$message({
                  message: "上架成功！",
                  type: "success"
                });
                this.typeList();
              } else {
                this.$message.error("上架失败！");
              }
            },
            err => {}
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //下架
    soldlt(index) {
      this.$confirm("此操作将下架该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var i = 0; i < this.typedata.length; i++) {
            if (index == i) {
              this.typedata[i].status = 0;
            }
          }
          var params = new URLSearchParams();
          params.append("id", this.typedata[index].id);
          params.append("type", this.typedata[index].status);

          this.$axios.post("/api/backstage/type/status", params).then(
            res => {
              if (res.data.code == 200) {
                this.$message({
                  message: "下架成功！",
                  type: "success"
                });
                this.typeList();
              } else {
                this.$message.error("上架失败！");
              }
            },
            err => {}
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //查询类型
    typeList() {
      var params = new URLSearchParams();
      this.$axios.post("/api/backstage/type/getType", params).then(
        res => {
          var arr = res.data.datas;
          for (var i in arr) {
            arr[i].disabled = true;
          }
          this.typedata = arr;
        },
        err => {}
      );
    }
  }
};
</script>

<style lang="scss">
.type {
  width: 100%;
  height: 100%;
}
.type-list-center {
  width: 100%;
  margin-top: 20px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}
.type-list {
  width: 23%;
  margin: 10px 10px;
}
.type-list1 {
  width: 500px;
}
.btn-type {
  width: 100%;
  text-align: center;
}
</style>
