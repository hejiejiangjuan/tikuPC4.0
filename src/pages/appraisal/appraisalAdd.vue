<template>
  <div class="appraisa">
    <div class="step-sop">
      <el-steps :active="active" style="width:100%;" align-center finish-status="success">
        <el-step title="添加基本信息"></el-step>
        <el-step title="添加题目"></el-step>
        <el-step title="添加报告"></el-step>
      </el-steps>
    </div>
    <div class="article">
      <article-detail v-if="isHidden" :appraisalId="id"  v-on:appRas="next" :is-edit="false"/>
      <set-Atheme
        v-on:btn="backSlep"
        ref="setAtheme"
        :appraisalId="id"
        :isstate="isstate"
        v-if="isshow"
        :is-edit="false"
      />
      <add-Report v-if="isReport" v-on:lastStep="text"  :arrNumber="arrNumber" :divisiveSex="divisiveSex"  :appraisalId="id"/>
    </div>
    <div></div>
  </div>
</template>

<script>
import ArticleDetail from "./components/ArticleDetail";
import addReport from "@/components/report/report";
import setAtheme from "../setAtheme/setAtheme";

export default {
  name: "CreateForm",
  data() {
    return {
      active: 0,
      isHidden: true,
      isshow: false,
      isReport: false,
      id: 0,
      isstate: false,
      divisiveSex:'',
      arrNumber:{},
      statusID:'',
    };
  },
  components: { ArticleDetail, setAtheme, addReport },
  created() {
  //    var status = this.$route.params.status;
    var idtop = this.$route.params.id;
  //  this.statusID = Number(status);
   
    if (idtop != null) {
      this.id = idtop;
    }
  },

  methods: {
    next(data) {
      this.id = Number(data.appraisalId);
      this.divisiveSex = data.divisiveSex
      
      this.active = Number(data.Id);
      this.isHidden = false,
        this.isReport = false,
        this.isshow = true,
        // 进入查询条件
      this.isstate = data.isstate;
    
    },
    backSlep(data) {
      if (data == "0") {
        this.active = Number(data);
        (this.isHidden = true), (this.isshow = false), (this.isReport = false);
      } else if (data.id == "3") {
        this.active = Number(data.id);
        this.arrNumber = data.strNumber
        this.isHidden = false, 
        this.isshow = false,
         this.isReport = true;
      }
    },
    text(data) {
      this.active = Number(data);
      (this.isHidden = false), (this.isshow = true), (this.isReport = false);
      // 进入查询条件
      this.isstate = true;
    }
    
  },

};
</script>
<style>
.appraisa {
  width: 100%;
  height: 100%;
  margin-top: 80px;
  /* overflow: hidden; */
}
.article {
  width: 100%;
  height: 100%;
  /* padding: 0 10px; */
  /* overflow-x: hidden; */
}
.buttonnext {
  width: 20%;
  margin: 0 auto;
  margin-bottom: 10px;
  text-align: center;
}
.step-sop {
  width: 95%;
  background: #ffffff;
  /* border-bottom: 1px solid #cccccc; */
  margin-bottom: 10px;
  position: absolute;
  top: 60px;
  z-index: 1999;
}
</style>
