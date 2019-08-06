<template>
  <div>
    <div class="withdim">
      <el-form ref="form" :model="form" label-width="130px" :label-position="labelPosition">
        <el-form-item label="可提现余额(元)">
          <span class="moneg-span" v-if="str.balanceStr == null">0.00</span>
          <span class="moneg-span" v-else>{{str.balanceStr}}</span>
        </el-form-item>
        <el-form-item label="到账微信账号">
          <div class="wx-account" v-if="str.nickname != null">
            <img class="wxs-img" :src="str.avatar" alt />
            <span style="font-size:14px;">{{str.nickname}}</span>
            <span class="cheng" @click="adcheng">更改</span>
          </div>
          <div class="wx-account ount" v-else>
            <span class="cheng1" @click="adcheng">你还未绑定任何账户，点击绑定</span>
          </div>
        </el-form-item>
        <el-form-item label="提现金额">
          <div style="width:60%;display:flex;">
            <el-input type="number" id="inputaiv" v-model="form.number"></el-input>
            <!-- <span class="span-div">今日已提现：0元</span> -->
          </div>
        </el-form-item>
        <el-form-item label="提现说明">
          <div style="font-size:12px;">
            1、每笔提现金额：<span style="color:red;">{{str.timeMaxWishdrawal}}元</span>；
            2、最低提现金额：<span style="color:red;">{{str.minWithdrawalStr}}元</span>；
            3、每日提现金额：<span style="color:red;">{{str.dayMaxWishdrawalStr}}元</span>；
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="lodingto">立即提现</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "withdraw",
  data() {
    return {
      lodingto: false,
      labelPosition: "left",
      form: {
        number: ""
      },
      str: {}
    };
  },
  props: {
    numberder: {
      type: Number,
      default: 0
    }
  },
  watch: {
    numberder: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        if (this.numberder == 5) {
          this.getTenantById();
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.getTenantById();
  },
  methods: {
    getTenantById() {
      // 查询当前渠道用户
      var params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("tfk"));
      this.$axios.get("/api/backstage/tenant/getTenantById", { params }).then(
        res => {
          if (res.data.code == 200) {
            this.str = res.data.datas;
          } else {
            this.$message.error("修改失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    onSubmit() {
      if (
        Number(parseFloat(this.str.balanceStr).toFixed(2)) <= 0 ||
        this.str.balanceStr == null
      ) {
        return this.$message.error("账户余额为0，不能提现！");
      }

      if (this.str.nickname == null || this.str.nickname == "") {
        return this.$message.error("你还未绑定账户，不能提现！");
      }
      if (this.form.number == "") {
        return this.$message.error("请输入提现金额");
      }
      if (Number(parseFloat(this.form.number).toFixed(2)) <= 0) {
        return this.$message.error("提现金额必须大于零");
      }
      if (
        Number(parseFloat(this.form.number).toFixed(2)) >
        Number(parseFloat(this.str.balanceStr).toFixed(2))
      ) {
        return this.$message.error("提现金额必须小于余额！");
      }
      var params = new URLSearchParams();
      params.append(
        "yuanPrice",
        Number(parseFloat(this.form.number).toFixed(2))
      );
      this.lodingto = true;
      this.$axios.post("/api/backstage/account/createEntOrder", params).then(
        res => {
          if (res.data.code == 200) {
            this.code = res.data.datas.code;
            this.getTenantById();
            this.form.number = "";
            this.lodingto = false;
            this.adcheng(12)
          } else {
            this.$message.error(res.data.message);
            this.lodingto = false;
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    adcheng(is) {
     if(is == 12){
       this.$emit("adchengNumber", 12);
     }else{
        this.$emit("adchengNumber", 4);
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
#inputaiv {
  padding: 0;
}
</style>
