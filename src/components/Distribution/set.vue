<template>
  <div class="box" style="width:100%;">
    <div class="tab-hd">
      <div class="tab-one-two" href="javascript:;" :class="{'now':index==1}" @click="index=1">推广页设置</div>
      <div class="tab-one-two" href="javascript:;" :class="{'now':index==2}" @click="index=2">招募设置</div>
      <div class="tab-one-two" href="javascript:;" :class="{'now':index==3}" @click="index=3">等级规则设置</div>
    </div>
    <div class="tab-bd">
      <div class="tab-item" v-show="index==1">
        <popset></popset>
      </div>
      <div class="tab-item" v-show="index==2">
        <page></page>
      </div>
      <div class="tab-item" v-show="index==3">
        <raght></raght>
      </div>
    </div>
  </div>
</template>

<script>
import popset from "./setcomponent/popset";
import page from "./setcomponent/page";
import raght from "./setcomponent/raght";
export default {
  name: "set",
  components: { popset, page, raght },
  data() {
    return {
      index: 1
    };
  }
};
</script>

<style>
.tab-hd {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  line-height: 20px;
  font-size: 14px;
  font-weight: 600;
}
.tab-one-two {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: -1px;
  margin-right: 5px;
  padding: 8px;
  width: 120px;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid #eeeeee;
  border-bottom: 0;
  text-align: center;
  background-color: rgba(238, 238, 238, 0.3);
  cursor: pointer;
}
.now {
  color: #2a75ed;
  background-color: #fff;
}
</style>
