<template>
  <div>
    <!--当前在线人数统计-->
    <div class="dayUserCount" id="myChart"></div>
    <!--人均付费比-->
    <div style="position: relative;">
      <div class="statis-select">
        <el-select v-model="type" placeholder="请选择" @change="getUserPayCount">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="conterStatis" id="userPayCount"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
     type: "1",
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
    //当前在线人数统计
    this.getDrawLine();
    //指定时间人均付费
    this.getUserPayCount();
  },
  methods: {
      //指定时间人均付费
      getUserPayCount() {
      var params = new URLSearchParams();
      params.append("type", this.type);
      this.$axios.post("api/backstage/statis/getUserPayCount", params).then(
        res => {
          if (res.data.code == 200) {
            let myChart = this.$echarts.init(
              document.getElementById("userPayCount")
            );
            // 绘制图表
            myChart.setOption({
              title: {
                text: "用户付费"
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
        err => {
        }
      );
    },
    //当前在线人数统计
    getDrawLine() {
      this.$axios.post("api/backstage/statis/getDayUserCount").then(
        res => {
          if (res.data.code == 200) {
            let myChart = this.$echarts.init(
              document.getElementById("myChart")
            );
            // 绘制图表
            myChart.setOption({
              title: {
                text: "各时间段在线人数"
              },
              tooltip: {
                trigger: "axis"
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
                data: res.data.datas.datTime
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
        err => {
        }
      );
    }
  }
};
</script>
<style>
.dayUserCount {
  width: 100%;
  height: 380px;
  display: block;
}
.conterStatis {
  margin-top: 40px;
  width: 100%;
  height: 380px;
  display: block;
}
.statis-select {
  width: 172px;
  height: 60px;
  position: absolute;
  top: 8px;
  right: 74px;
  z-index: 2000;
}
</style>
