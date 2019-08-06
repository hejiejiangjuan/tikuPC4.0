<template>
  <div class="client">
    <el-breadcrumb class="breadcrumb">
      <div class="bre-img" @click="toDistribution">
        <img src="@/assets/fanhui.png" alt>
      </div>
      <el-breadcrumb-item style="margin-left:10px;">返回上一级</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-info">
      <div class="detail-info__top">
        <img
          :src="row.avatar"
          class="detail-info__avatar"
        >
        <span class="detail-info__nickname">{{row.nickname != null ? row.nickname : '--'}}</span>
      </div>
      <div class="detail-client__top">
        <div class="detail-info__item" style="border:none;">
          <div class="listName">
            <span>姓名：</span>
            <span class="one-line">{{row.alias != null ? row.alias : '--'}}</span>
          </div>
          <div class="listName">
            <span>手机号：</span>
            <span class="one-line">{{row.phone != null ? row.phone : '--' }}</span>
          </div>
        </div>
        <div class="detail-info__item">
          <div class="listName">
            <span>直接推广数：</span>
            <span class="one-line">{{row.addupCustomer}}</span>
          </div>
          <div class="listName">
            <span>直接推广金额：</span>
            <span class="one-line">￥{{row.directCommissionStr}}</span>
          </div>
        </div>
        <div class="detail-info__item">
          <div class="listName">
            <span>上级推广员：</span>
            <span class="one-line">{{row.superiorName != null ? row.superiorName : '--' }}</span>
          </div>
          <div class="listName">
            <span>加入时间：</span>
            <span class="one-line">{{row.createDate}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="他的客户" name="first">
        <clients></clients>
      </el-tab-pane>
      <el-tab-pane label="他的下级" name="second">
        <lower></lower>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clients from "@/components/Distribution/clients";
import lower from "@/components/Distribution/lower";
export default {
  data() {
    return {
      activeName: "first",
      row:"",
    };
  },
  components: { clients, lower },
  mounted(){
    this.row = this.$route.query.row
  },
  methods: {
    // handleClick(tab, event) {

    // },
    toDistribution() {
      this.$router.push({ path: "/home/distribution" });
    }
  }
};
</script>

<style>
.client {
  width: 100%;
  height: 100%;
}
.breadcrumb {
  width: 15%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.bre-img {
  width: 30px;
  height: 30px;
}
.bre-img img {
  width: 100%;
  height: 100%;
}
.detail-info {
  position: relative;
  padding: 20px 0px;
  margin: 20px 0;
  width: 100%;
  background-color: #f5f7fa;
}
.detail-info__top {
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.detail-info__avatar {
  width: 40px;
  height: 40px;
  vertical-align: bottom;
  border-radius: 50%;
}
.detail-info__nickname {
  margin: 0 20px 0 10px;
}
.detail-client__top {
  margin-top: 20px;
  display: flex;
  align-items: center;
  line-height: 17px;
  font-size: 12px;
}
.detail-info__item {
  position: relative;
  padding-left: 70px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 33%;
  border-left: 1px solid #e5e5e5;
}
.one-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.listName {
  padding: 10px 0;
  font-family: PingFangSC, "Microsoft Yahei", Helvetica, Tahoma, Arial,
    "Hiragino Sans GB", "Hiragino Sans GB W3", STXihei, STHeiti, Heiti, SimSun,
    sans-serif !important;
}
</style>
