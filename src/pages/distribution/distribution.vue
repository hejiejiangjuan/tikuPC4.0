<template>
  <div class="distribution">
    <el-tabs v-model="activeName">
      <el-tab-pane label="推广员" name="agent">
        <d-Agent></d-Agent>
      </el-tab-pane>
      <el-tab-pane label="商品列表" name="list">
        <list :activeName="activeName"></list>
      </el-tab-pane>
      <el-tab-pane label="推广记录" name="record">
        <record :activeName="activeName"></record>
      </el-tab-pane>
      <el-tab-pane label="绑定查询" name="bound">
        <bound></bound>
      </el-tab-pane>
      <el-tab-pane label="业绩统计" name="porformance">
        <porformance :activeName="activeName"></porformance>
      </el-tab-pane>
      <el-tab-pane label="设置" name="set">
        <set></set>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DAgent from "@/components/Distribution/agent";
import list from "@/components/Distribution/list";
import record from "@/components/Distribution/record";
import bound from "@/components/Distribution/bound";
import porformance from "@/components/Distribution/porformance";
import set from "@/components/Distribution/set";
export default {
  data() {
    return {
      activeName: "agent"
    };
  },
   components: { DAgent, list, record, bound, porformance,set },
  // methods: {
  //   handleClick(tab, event) {
  //     console.log(tab, event);
  //   }
  // }
};
</script>

<style>
.distribution{
  width: 100%;
  height: 100%;
}
</style>
