<template>
  <div class="distribution">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的账户" v-if="tfk != 1" name="close">
        <close :activeName="activeName" :numberClose="numberClose" v-on:toNmber="toNmber"></close>
      </el-tab-pane>
      <el-tab-pane label="查询账户" name="query">
        <query :activeName="activeName" :numberquery="numberClose" ></query>
      </el-tab-pane>
      <el-tab-pane label="提现" v-if="tfk != 1" name="withdraw">
        <withdraw :activeName="activeName"  v-on:minnumber="minnumber"></withdraw>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import close from "@/components/Account/close";
import query from "@/components/Account/query";
import withdraw from "@/components/Account/withdraw";
export default {
  data() {
    return {
      activeName: "close",
      tfk: "",
      numberClose:0,
    };
  },
  components: { close, query, withdraw },
  created(){
     this.tfk = sessionStorage.getItem("tfk");
      if (this.tfk == "1") {
        this.activeName = "query";
      }
  },
  // mounted: function() {},
  methods: {
    minnumber(data){
      if(data == 12){
        this.numberClose = data
        this.activeName = "close";
      }
    },
    toNmber(data) {
      if (data == 3) {
        this.activeName = "withdraw";
      }
    }
  }
};
</script>

<style>
.distribution {
  width: 100%;
  height: 100%;
}
</style>
