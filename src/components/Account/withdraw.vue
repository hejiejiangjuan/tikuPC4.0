<template>
  <div>
    <withdrawpage v-show="iswithdrawpage" :numberder="numberder" v-on:adchengNumber="adchengNumber"></withdrawpage>
    <bound v-show="isbound"  v-on:adchengNone="adchengNone"></bound>
  </div>
</template>

<script>
import withdrawpage from "./wirhcomponent/withdrawpage";
import bound from "./wirhcomponent/bound";
export default {
  name: "withdraw",
  components: { withdrawpage, bound },
  data() {
    return {
      iswithdrawpage: true,
      isbound: false,
      str: "",
      numberder: 0,
    };
  },
  methods: {
    adchengNumber(data) {
      if (data == 4) {
        this.iswithdrawpage = false;
        this.isbound = true;
      }
      if(data == 12){
         this.$emit("minnumber", 12);
      }
    },
    adchengNone(data) {
      if (data == 5) {
        this.iswithdrawpage = true;
        this.isbound = false;
        this.numberder = data
      }
    }
  }
};
</script>

<style>
.withdim {
  width: 70%;
  margin-top: 40px;
}
.span-div {
  display: block;
  width: 200px;
  margin-left: 20px;
}
.moneg-span {
  font-size: 18px;
  color: #fb6161;
}
.wx-account {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  padding: 15px;
  width: 400px;
  height: 70px;
  background: #f5f7fa;
  font-size: 14px;
}
.wxs-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.cheng {
  flex: 1;
  text-align: right;
  color: #2a75ed;
}
.cheng:hover {
  cursor: pointer;
}
.cheng1 {
  display: block;
  width: 100%;
  text-align: center;
  color: #2a75ed;
}
.cheng1:hover {
  cursor: pointer;
}
.ount {
  text-align: center;
}
</style>
