<template>
  <div>
    <!-- 头部统计模块-->
    <div class="topStatis">
      <el-row :gutter="15">
        <el-col :span="6" style="width:13%">
          <div class="grid-content bg-purple" style="background:#00BFFF;">
            <div class="statusImg">
              <img width="100%" src="../../assets/logo.png">
            </div>
            <div class="statusTest">
              <span class="span">今日收益</span>
              <br>
              <span>{{topCount.dayPayment}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="width:13%">
          <div class="grid-content bg-purple" style="background:#3CB371;">
            <div class="statusImg">
              <img width="100%" src="../../assets/benyue.png">
            </div>
            <div class="statusTest">
              <span class="span">本月收益</span>
              <br>
              <span>{{topCount.menthPayMent}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="width:13%">
          <div class="grid-content bg-purple" style="background:#deab8a;">
            <div class="statusImg">
              <img width="100%" src="../../assets/countPay.png">
            </div>
            <div class="statusTest">
              <span class="span">累计收益</span>
              <br>
              <span>{{topCount.countPay}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="width:13%" v-if="tfk==1">
          <div class="grid-content bg-purple" style="background:#FF7F50;">
            <div class="statusImg">
              <img width="100%" src="../../assets/renshu.png">
            </div>
            <div class="statusTest">
              <span class="span">今日注册人数</span>
              <br>
              <span>{{topCount.datCount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="width:13%" v-if="tfk==1">
          <div class="grid-content bg-purple" style="background:#F4A460;">
            <div class="statusImg">
              <img width="100%" src="../../assets/yuerenshu.png">
            </div>
            <div class="statusTest">
              <span class="span">本月注册人数</span>
              <br>
              <span>{{topCount.menthCount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" style="width:13%">
          <div class="grid-content bg-purple" style="background:#FA8072;">
            <div class="statusImg">
              <img width="100%" src="../../assets/logo.png">
            </div>
            <div class="statusTest">
              <span class="span">总购买量</span>
              <br>
              <span>{{topCount.countNum}}</span>
            </div>
          </div>
          <br>
        </el-col>

        <el-col :span="6" style="width:13%" v-if="tfk==1">
          <div class="grid-content bg-purple" style="background:#ff6666;">
            <div class="statusImg">
              <img width="100%" src="../../assets/jinri.png">
            </div>
            <div class="statusTest">
              <span class="span">今日登录人数</span>
              <br>
              <span>{{topCount.dayLoginCount}}</span>
            </div>
          </div>
          <br>
        </el-col>

        <el-col :span="6" style="width:13%" v-if="tfk!=1">
          <div class="grid-content bg-purple" style="background:#ff6666;"  @click="routerNumber">
            <div class="statusImg">
              <img width="100%" src="../../assets/jinri.png">
            </div>
            <div class="statusTest">
              <span class="span">可提现金额</span>
              <br>
              <span>{{topCount.account}}</span>
            </div>
          </div>
          <br>
        </el-col>
      </el-row>
    </div>
    <div style="position: relative;">
      <div class="statis-select">
        <el-select v-model="type" placeholder="请选择" @change="getDrawLine">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="conterStatis" id="myChart"></div>
    </div>
    <br>
    <!-- 底部统计图-->
    <div class="bottomStatis" >
      <!--左边-->
      <div class="leftDiv" id="income" v-show="tfk==1"></div>

      <!--右边-->
      <div class="rightDiv" id="browse" v-show="tfk==1"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tfk: sessionStorage.getItem("tfk"),
      topCount: {},
      type: "3",
      options: [
        {
          value: "0",
          label: "上周"
        },
        {
          value: "1",
          label: "本周"
        },
        {
          value: "2",
          label: "上月"
        },
        {
          value: "3",
          label: "本月"
        },
        {
          value: "4",
          label: "本季度"
        }
      ]
    };
  },
  mounted() {
    //获取头部标签数据
    this.getList();
    //获取收益趋势数据渲染图表
    this.getDrawLine();
    //获取各类型占比数据渲染图表
    this.getTypeProfit();
    //获取浏览量前十用户数据渲染图表
    this.getBrowseList();
  },
  methods: {
    // 跳转到提现页面
    routerNumber(){
     this.$router.push({ path: "/home/account" });
    },
    //获取头部统计数据
    getList() {
      this.$axios.post("api/backstage/statis/getList").then(
        res => {
          if (res.data.code == 200) {
            this.topCount = res.data.datas;
          } else {
            this.$message.error("查询失败");
          }
        },
        err => {}
      );
    },
    //获取各类型占比数据渲染图表
    getTypeProfit() {
      this.$axios.post("api/backstage/statis/getTypeProfit").then(
        res => {
          if (res.data.code == 200) {
            let income = this.$echarts.init(
              document.getElementById("income")
            );
            income.setOption({
              title: {
                text: "各类型收入占比",
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              color: [
                "#7bbfea",
                "#33a3dc",
                "#90d7ec",
                "#fcf16e",
                "#deab8a",
                "#ffce7b",
                "#45b97c",
                "#f8aba6",
                "#fedcbd",
                "#cde6c7"
              ],
              legend: {
                orient: "vertical",
                left: "left",
                data: res.data.datas.type
              },
              series: [
                {
                  name: "类型收入",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "60%"],
                  data: res.data.datas.typeProfitList,

                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          } else {
            document.getElementById("income").innerHTML = "暂无数据";
          }
        },
        err => {}
      );
    },
    //获取统计浏览量前十位数据渲染图表
    getBrowseList() {
      this.$axios.post("api/backstage/statis/getBrowseList").then(
        res => {
          if (res.data.code == 200) {
             let browse = this.$echarts.init(
              document.getElementById("browse")
            );
            //let browse = this.$echarts.init(document.getElementById("browse"));
            browse.setOption({
              title: {
                text: "浏览量前十位测评",
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              color: [
                "#7bbfea",
                "#33a3dc",
                "#90d7ec",
                "#fcf16e",
                "#deab8a",
                "#ffce7b",
                "#45b97c",
                "#f8aba6",
                "#fedcbd",
                "#cde6c7"
              ],
              legend: {
                orient: "vertical",
                left: "left",
                data: res.data.datas.type
              },
              label: {
                formatter: function(e) {
                  return e.name.length > 4
                    ? e.name.substring(0, 4) + ".."
                    : e.name;
                }
              },
              series: [
                {
                  name: "测评标题",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "60%"],
                  data: res.data.datas.browseList,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          } else {
            document.getElementById("browse").innerHTML = "暂无数据";
          }
        },
        err => {}
      );
    },
    //查询收益趋势数据渲染图标
    getDrawLine() {
      var params = new URLSearchParams();
      params.append("type", this.type);
      this.$axios.post("api/backstage/statis/getDrawLine", params).then(
        res => {
          if (res.data.code == 200) {
            let myChart = this.$echarts.init(
              document.getElementById("myChart")
            );
            // 绘制图表
            myChart.setOption({
              title: {
                text: "收益每日变化趋势图"
              },
              tooltip: {
                trigger: "axis"
              },
              legend: {
                data: res.data.datas.legendData
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: res.data.datas.xAxisData
              },
              yAxis: {
                type: "value"
              },
              series: res.data.datas.series
            });
          } else {
            this.$message.error("查询失败");
          }
        },
        err => {}
      );
    }
  }
};
</script>

<style >
.bottomStatis {
  width: 100%;
}
.leftDiv {
  width: 40%;
  height: 290px;
  display: block;
  float: left;
}
.rightDiv {
  width: 50%;
  height: 290px;
  display: block;
  float: right;
}
.conterStatis {
  width: 100%;
  height: 380px;
  display: block;
  float: right;
}
.conterDiv {
  width: 5%;
  height: 380px;
  display: block;
  float: left;
}
.statusImg {
  width: 30%;
  display: block;
}
.statusTest {
  width: 70%;
  display: block;
}
.statusTest > span {
  display: block;
}
.statusTest > .span {
  display: block;
  font-size: 18px;
}
.el-row {
  margin-bottom: 20px;
  text-align: center;
}
.el-col {
  border-radius: 4px;
  margin-left: 20px;
}
/* .bg-purple-dark {
  background: #99a9bf;
} */
.bg-purple {
  background: #d3dce6;
  height: 100px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #ffffff;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.statis-select {
  width: 172px;
  height: 60px;
  position: absolute;
  top: 8px;
  right: 74px;
  z-index: 2000;
}
.topStatis {
  margin-right: 2%;
}
</style>
