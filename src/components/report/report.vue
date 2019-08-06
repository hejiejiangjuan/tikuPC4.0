<template>
  <div class="report-top">
    <div class="serathen-left">
      <ul>
        <li
          v-for="(item,index) in items"
          :key="index"
          class="serathen-left-li"
          @click="reportThem(index)"
          :class="index==number? 'acve':''"
        >
          <span style="overflow: hidden;">{{item.dimName}}</span>
        </li>
      </ul>
    </div>
    <div class="report-right">
      <div class="report" v-for="(item,index) in items" v-show="index == number" :key="index">
        <!-- {{item}} -->
        <div class="repo int-shuoming">
          说明：
          <br />&nbsp;&nbsp;1.请严格按照题目总分大小进行设置，如：测评分数范围为0-100，每个报告中的最小最大分数依次设置为0-20,20-30，30-100，依次类推。
          <br />&nbsp;&nbsp;2.若该测评不区分性别，则直接依次设置分数段。
          <br />&nbsp;&nbsp;3.若该测评区分性别，建议先设置一种性别的分数，在设置另外一种，防止遗漏分数段。
          <br />
          <div style="width:100%;margin:10px auto;font-size:18px;padding-left:20px;">
            该维度分值范围是:
            <span style="color:red;" v-if="item.type == '1'">{{allmax}}分</span>
            <span style="color:red;" v-else>{{item.min}}分</span>~
            <span style="color:red;" v-if="item.type == '1'">{{ allmin}}分.</span>
            <span style="color:red;" v-else>{{item.max}}分.</span>
          </div>
        </div>

        <div class="repo" v-if="item.type != '1'">
          <div class="reportsatticass">
            <div class="reportsat">
              <span>建议内容(可选)：</span>
              <div class="int-repo85"></div>
            </div>
            <div class="bentichaozuo" @click="suggestRemove(number,index)">
              <i class="el-icon-delete"></i>
              <span>删除本项</span>
            </div>
          </div>
          <div class="textop" style="margin-bottom: 20px;">
            <div class="UE">
              <vue-ueditor-wrap v-model="item.appAdvice.jycontent" id="jycontent" class="ue-left"></vue-ueditor-wrap>
              <div class="ue-right">
                <div class="artincadmin">
                  <h1 class="h1111" style="color:#ffffff;">预览</h1>
                </div>
                <div class="ue-html" id="ue-html" v-html="item.appAdvice.jycontent"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 测后付费阶段 -->
        <div v-for="(inNub,Num) in item.reportList" :key="Num">
          <div class="repo" v-if="inNub.payStage == '2'">
            <div class="repo-top">
              <div class="reportsatticass">
                <div class="reportsat">
                  <span style="font-weight: 600;font-size:18px;">测后付费内容及说明</span>
                  <div class="int-repo85"></div>
                </div>
                <div class="bentichaozuo" @click="poprepot(Num,index,2)">
                  <i class="el-icon-delete"></i>
                  <span>删除本项</span>
                </div>
              </div>
              <div class="reportsatticass555" v-if="divisiveSex == '1'">
                <div class="reportsat">
                  <span>所属性别:</span>
                  <div class="elselce">
                    <el-select v-model="inNub.gender" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="reportsatticass555">
                <div class="reportsat">
                  <span>最小分数范围:</span>
                  <div class="int-repo">
                    <el-input
                      placeholder="最小范围"
                      @blur="minElint(Num,index,2)"
                      v-model="inNub.minPoint"
                    ></el-input>
                  </div>
                </div>
              </div>
              <div class="reportsatticass555">
                <div class="reportsat">
                  <span>最大分数范围:</span>
                  <div class="int-repo">
                    <el-input
                      placeholder="最大范围"
                      @blur="maxElint(Num,index,2)"
                      v-model="inNub.maxPoint"
                    ></el-input>
                  </div>
                </div>
              </div>
            </div>

            <div style="padding:20px 0;">报告内容:</div>
            <div class="textop" style="margin-top:20px;">
              <!-- <quill-editor ref="myTextEditor" v-model="num.content" :config="editorOption"></quill-editor> -->
              <div class="UE">
                <vue-ueditor-wrap v-model="inNub.content" id="content" class="ue-left"></vue-ueditor-wrap>
                <div class="ue-right">
                  <div class="artincadmin">
                    <h1 class="h1111" style="color:#ffffff;">预览</h1>
                  </div>
                  <div class="ue-html" id="ue-html" v-html="inNub.content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="tinajiarepo"
          v-if="payStage == '2' && item.type != '2'"
          @click="addReport(index,2)"
        >
          <span class="adjia">+</span>添加测后付费说明
          <span class="adjia">+</span>
        </div>
        <!-- 报告内容 -->
        <div v-for="(num,number) in item.reportList" :key="number">
          <div class="repo" v-if="num.payStage == '1'">
            <div class="repo-top">
              <div class="reportsatticass">
                <div class="reportsat">
                  <span style="font-weight: 600;font-size:18px;">相关报告内容及说明</span>
                  <div class="int-repo85"></div>
                </div>
                <div class="bentichaozuo" @click="poprepot(number,index,1)">
                  <i class="el-icon-delete"></i>
                  <span>删除本项</span>
                </div>
              </div>
              <div class="reportsatticass555" v-if="divisiveSex == '1'">
                <div class="reportsat">
                  <span>所属性别:</span>
                  <div class="elselce">
                    <el-select v-model="num.gender" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="reportsatticass555">
                <div class="reportsat">
                  <span>最小分数范围:</span>
                  <div class="int-repo">
                    <el-input
                      placeholder="最小范围"
                      @blur="minElint(number,index,1)"
                      v-model="num.minPoint"
                    ></el-input>
                  </div>
                </div>
              </div>
              <div class="reportsatticass555">
                <div class="reportsat">
                  <span>最大分数范围:</span>
                  <div class="int-repo">
                    <el-input
                      placeholder="最大范围"
                      @blur="maxElint(number,index,1)"
                      v-model="num.maxPoint"
                    ></el-input>
                  </div>
                </div>
              </div>
            </div>

            <div style="padding:20px 0;">报告内容:</div>
            <div class="textop" style="margin-top:20px;">
              <!-- <quill-editor ref="myTextEditor" v-model="num.content" :config="editorOption"></quill-editor> -->
              <div class="UE">
                <vue-ueditor-wrap v-model="num.content" id="content" class="ue-left"></vue-ueditor-wrap>
                <div class="ue-right">
                  <div class="artincadmin">
                    <h1 class="h1111" style="color:#ffffff;">预览</h1>
                  </div>
                  <div class="ue-html" id="ue-html" v-html="num.content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tinajiarepo" @click="addReport(index,1)">
          <span class="adjia">+</span>添加报告说明
          <span class="adjia">+</span>
        </div>
      </div>
     
      <div class="ser-btn">
        <el-button type="success" :loading="btnloading" @click="lastStep">上一步</el-button>
        <el-button type="primary" :loading="btnloading" @click="reortOk">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { quillEditor } from "vue-quill-editor";
// import Tinymce from "@/components/Tinymce";
// import Ueditor from "@/components/Ueditor";
import { Loading } from 'element-ui';
export default {
  data() {
    return {
      removeads: "",
      payStage: "",
      payStageAll: "",
      reTypeList: [
        {
          value: "1",
          label: "测试前"
        },
        {
          value: "2",
          label: "测试后"
        }
      ],
      options: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      value: "",
      editorOption: {},
      content: "",
      jycontent: "",
      items: [],
      text: 0,
      mininput: "",
      isiveSex: "",
      number: 0,
      isType: true,
      btnloading: false,
      maxarr: [],
      minarr: [],
      allmax: 0,
      allmin: 0,
      ispass: true,
      iscontent: true,
      reType: {}
    };
  },

  props: {
    appraisalId: {
      type: Number,
      default: 0
    },
    divisiveSex: {
      type: String,
      default: "0"
    },
    arrNumber: {
      type: Array,
      default: []
    }
  },
  mounted() {
    this.reportFunction();
    this.reType = JSON.parse(sessionStorage.getItem("questiontype"));
    this.payStage = this.reType.ayStage;
    this.payStageAll = this.reType.ayStage;
    var maxarr = [];
    var minarr = [];

    for (var i in this.arrNumber) {
      var maxPoint = [];
      var minPoint = [];
      for (var k in this.arrNumber[i].question) {
        var point = [];
        for (var j in this.arrNumber[i].question[k].answer) {
          point.push(this.arrNumber[i].question[k].answer[j].point);
        }
        minPoint.push(Math.min.apply(Math, point));
        maxPoint.push(Math.max.apply(Math, point));
      }
      // 求数组元素总和
      let max1 = 0;
      minPoint.forEach(item => {
        max1 += item;
      });
      this.maxarr.push(max1);
      let min1 = 0;
      maxPoint.forEach(item => {
        min1 += item;
      });
      this.minarr.push(min1);
    }
    // 求全部
    let max = 0;
    this.maxarr.forEach(item => {
      max += item;
    });
    this.allmax = max;
    let min = 0;
    this.minarr.forEach(item => {
      min += item;
    });
    this.allmin = min;
    var that = this;
    setTimeout(function() {
      that.openreporOne();
    }, 2000);
  },

  methods: {
    // 点击切换
    reportThem(index) {
      this.number = index;
    },
    // 添加
    addReport(index, type) {
      if (this.divisiveSex == "0") {
        this.isiveSex = "0";
      } else {
        this.isiveSex = "";
      }
      var datas = {
        appraisalId: "",
        name: "",
        gender: this.isiveSex,
        minPoint: "",
        maxPoint: "",
        content: "",
        dimId: "",
        id: "",
        payStage: "1",
        divisiveSex: this.divisiveSex,
        ispass: true
      };
      if (this.items[index].type == "1" && this.payStage == "2") {
        var arr = this.items[index].reportList;
        if (type == 2) {
          datas.payStage = "2";
          this.items[index].reportList.push(datas);
        } else if (type == 1) {
          this.items[index].reportList.push(datas);
        }
      } else {
        this.items[index].reportList.push(datas);
      }
    },
    // 删除建议文本
    suggestRemove(number, index) {
      if (this.items[index].appAdvice.id != "") {
        var params = new URLSearchParams();
        params.append("id", this.items[index].appAdvice.id);
        this.$axios.post("/api/backstage/appraisal/deleteAdvice", params).then(
          res => {
            if (res.data.code == "200") {
              this.items[index].appAdvice.jycontent = "";
              this.$message.success("删除成功！");
            } else {
              this.$message.error("删除失败！");
            }
          },
          err => {}
        );
      } else {
        this.items[index].appAdvice.content = "";
      }
    },
    //删除
    poprepot(number, index, type) {
      if (this.items[index].reportList[number].id != "") {
        var params = new URLSearchParams();
        params.append("id", this.items[index].reportList[number].id);
        this.$axios
          .post("/api/backstage/appraisal/deleteReportById", params)
          .then(
            res => {
              if (res.data.code == "200") {
                this.items[index].reportList.splice(number, 1);
                this.$message.success("删除成功！");
              } else {
                this.$message.error("删除失败！");
              }
            },
            err => {}
          );
      } else {
        this.items[index].reportList.splice(number, 1);
      }
    },
    //上一步
    lastStep() {
      this.$emit("lastStep", "2");
    },
    // 失去焦点比较最小值
    minElint(number, index, type) {
      this.ispass = true;
      // 判断index是否为0，若为0，则直接比较最小值。不为零就比较性别。
      if (this.items[index].type == "1") {
        if (number == 0) {
          if (
            this.items[index].reportList[number].minPoint !=
            this.items[index].min
          ) {
            this.$message.error("请输入范围最小值！");
            this.ispass = false;
          }
        } else {
          // 先比较是否有相同类型,
          var currentItem = this.items[index].reportList[number];
          var lastItem = ""; //同类型下的上一个对象
          for (var i = number - 1; i >= 0; i--) {
            var curItem = this.items[index].reportList[i];
            if (
              curItem.gender == currentItem.gender &&
              curItem.payStage == currentItem.payStage
            ) {
              lastItem = curItem;
              break;
            }
          }
          //若有,则用当前性别比较上一个性别,若没有直接比较值.
          if (lastItem != "") {
            if (
              lastItem.gender == this.items[index].reportList[number].gender
            ) {
              if (
                Number(
                  parseFloat(
                    this.items[index].reportList[number].minPoint
                  ).toFixed(2)
                ) != Number(parseFloat(lastItem.maxPoint).toFixed(2))
              ) {
                this.$message.error("请输入上个范围最大值");
                this.ispass = false;
              }
            } else {
              if (
                Number(
                  parseFloat(
                    this.items[index].reportList[number].minPoint
                  ).toFixed(2)
                ) != Number(parseFloat(this.items[index].min).toFixed(2))
              ) {
                this.$message.error("请输入分值范围最小值！");
                this.ispass = false;
              }
            }
          } else {
            if (
              Number(
                parseFloat(
                  this.items[index].reportList[number].minPoint
                ).toFixed(2)
              ) != Number(parseFloat(this.items[index].min).toFixed(2))
            ) {
              this.$message.error("请输入分值范围最小值！");
              this.ispass = false;
            }
          }
        }
      } else {
        // 其他维度比较
        if (number == 0) {
          if (
            Number(
              parseFloat(this.items[index].reportList[number].minPoint).toFixed(
                2
              )
            ) < Number(parseFloat(this.items[index].min).toFixed(2))
          ) {
            this.$message.error("最小值范围应该大于等于分数最小值！");
            this.ispass = false;
            return;
          }
          if (
            Number(
              parseFloat(this.items[index].reportList[number].minPoint).toFixed(
                2
              )
            ) >= Number(parseFloat(this.items[index].max).toFixed(2)) &&
            Number(parseFloat(this.items[index].min).toFixed(2)) !=
              Number(parseFloat(this.items[index].max).toFixed(2))
          ) {
            this.$message.error("最小值范围应该小于最大分数！");
            this.ispass = false;
            return;
          }
        } else {
          // 先比较是否有相同类型,
          var currentItem = this.items[index].reportList[number];
          var lastItem = ""; //同类型下的上一个对象
          for (var i = number - 1; i >= 0; i--) {
            var curItem = this.items[index].reportList[i];
            if (curItem.gender == currentItem.gender) {
              lastItem = curItem;
              break;
            }
          }
          //若有,则用当前性别比较上一个性别,若没有直接比较值.
          if (lastItem != "") {
            if (
              lastItem.gender == this.items[index].reportList[number].gender
            ) {
              if (
                Number(
                  parseFloat(
                    this.items[index].reportList[number].minPoint
                  ).toFixed(2)
                ) < Number(parseFloat(lastItem.maxPoint).toFixed(2))
              ) {
                this.$message.error("必须大于等于上个范围最大值！");
                this.ispass = false;
                return;
              }
              if (
                Number(
                  parseFloat(
                    this.items[index].reportList[number].minPoint
                  ).toFixed(2)
                ) >= Number(parseFloat(this.items[index].max).toFixed(2))
              ) {
                this.$message.error("最小值范围应该小于最大分数！");
                this.ispass = false;
                return;
              }
            } else {
              if (
                Number(
                  parseFloat(
                    this.items[index].reportList[number].minPoint
                  ).toFixed(2)
                ) < Number(parseFloat(this.items[index].min).toFixed(2))
              ) {
                this.$message.error("最小值范围应该大于等于分数最小值！");
                this.ispass = false;
                return;
              }
            }
          } else {
            if (
              Number(
                parseFloat(
                  this.items[index].reportList[number].minPoint
                ).toFixed(2)
              ) < Number(parseFloat(this.items[index].min).toFixed(2))
            ) {
              this.$message.error("最小值范围应该大于等于分数最小值！");
              this.ispass = false;
              return;
            }
          }
        }
      }
    },
    // 最大值
    maxElint(number, index, type) {
      // 判断index是否为0，若为0，则直接比较最小值。不为零就比较性别。
      if (this.items[index].type == "1") {
        if (
          Number(parseFloat(this.allmax).toFixed(2)) ==
          Number(parseFloat(this.allmin).toFixed(2))
        ) {
          this.ispass = true;
          return;
        } else {
          var check = /^\d+(\.{0,1}\d+){0,1}$/;
          var max = this.items[index].reportList[number].maxPoint;
          var min = this.items[index].reportList[number].minPoint;
          if (max == "") {
            this.$message.error("最大值范围不能为空！");
            this.ispass = false;
            return;
          }
          if (
            Number(parseFloat(max).toFixed(2)) >
            Number(parseFloat(this.allmin).toFixed(2))
          ) {
            this.$message.error("最大值范围不能超出分值范围！");
            this.ispass = false;
            return;
          }
          if (!check.test(max)) {
            this.$message.error("请输入数字！");
            this.items[index].reportList[number].maxPoint = "";
            this.ispass = false;
            return;
          }
          if (
            Number(parseFloat(max).toFixed(2)) <=
            Number(parseFloat(min).toFixed(2))
          ) {
            this.$message.error("最大值范围不能小于等于最小范围值！");
            this.ispass = false;
            return;
          }
        }
      } else {
        var check = /^\d+(\.{0,1}\d+){0,1}$/;
        var max = this.items[index].reportList[number].maxPoint;
        var min = this.items[index].reportList[number].minPoint;
        if (max == "") {
          this.$message.error("最大值范围不能为空！");
          this.ispass = false;
          return;
        }
        if (!check.test(max)) {
          this.$message.error("请输入数字！");
          this.items[index].reportList[number].maxPoint = "";
          this.ispass = false;
          return;
        }
        if (
          Number(parseFloat(max).toFixed(2)) <
          Number(parseFloat(min).toFixed(2))
        ) {
          this.$message.error("最大值范围不能小于最小范围值！");
          this.ispass = false;
          return;
        }
      }
    },
    // 查询报告
    reportFunction() {
      if (this.appraisalId != "") {
       let loadingInstance = Loading.service({
            text: '加载中，请稍等...',
            target: document.querySelector('.article')
        });
        var params = new URLSearchParams();
        params.append("appraisalId", this.appraisalId);
        this.$axios.post("/api/backstage/appraisal/getReport", params).then(
          res => {
            if (res.data.code == "200") {
              var arr = res.data.datas;
              for (var k in arr) {
                if (arr[k].type == "1") {
                  this.isType = false;
                }
              }
              if (this.isType == true) {
                var datas = {
                  id: "",
                  appAdvice: "",
                  appraisalId: "",
                  dimName: "综合",
                  question: "",
                  max: 0,
                  min: 0,
                  reportList: "",
                  type: "1"
                };
                arr.unshift(datas);
              }

              for (var i in arr) {
                if (arr[i].appAdvice == undefined || arr[i].appAdvice == "") {
                  arr[i].appAdvice = {
                    id: "",
                    jycontent: ""
                  };
                } else {
                  arr[i].appAdvice.jycontent = arr[i].appAdvice.content;
                }
                if (arr[i].type == "1") {
                  arr[i]["min"] = this.allmax;
                  arr[i]["max"] = this.allmin;
                }
                if (arr[i].reportList == undefined || arr[i].reportList == "") {
                  arr[i].reportList = [];
                }
                if (arr[i].min == undefined && arr[i].type != "1") {
                  arr[i].min = this.maxarr[i - 1];
                }
                if (arr[i].max == undefined && arr[i].type != "1") {
                  arr[i].max = this.minarr[i - 1];
                }
              }
              this.items = arr;
               loadingInstance.close();
            }
          },
          err => {}
        );
      }
    },

    //完成
    reortOk() {
      this.removeads = "离开";
      var len = this.items;
      for (var i in len) {
        if (len[i].type == "1" && this.payStage != "2") {
          if (len[i].reportList.length != 0) {
            if (this.divisiveSex == "1") {
              var stra = [];
              for (var s in len[i].reportList) {
                if (len[i].reportList[s].gender != "") {
                  stra.push(len[i].reportList[s].gender);
                }
              }
              if (stra.indexOf("1") == -1) {
                this.$message.error("你还未设置男性的报告分数范围！");
                return (this.ispass = false);
              } else if (stra.indexOf("2") == -1) {
                this.$message.error("你还未设置女性的报告分数范围！");
                return (this.ispass = false);
              }
            }

            var number = len[i].reportList.length - 1;
            if (
              Number(
                parseFloat(len[i].reportList[number].maxPoint).toFixed(2)
              ) != Number(parseFloat(len[i].max).toFixed(2)) &&
              len[i]
            ) {
              var numb = Number(i) + 1;
              this.$message.error(
                "第" + numb + "个维度值最大范围值应该为" + len[i].max + "！"
              );
              return (this.ispass = false);
            }
            var adlength = len[i].reportList;
            for (var j in adlength) {
              if (adlength[j].content == "") {
                var numb = Number(i) + 1;
                this.$message.error(
                  "第" + numb + "个维度中有报告内容或付费说明为空！"
                );
                return (this.iscontent = false);
              } else {
                this.iscontent = true;
              }
            }
          } else {
            this.$message.error("你还未设置综合维度的详细信息！");
            return;
          }
          if (len[i].reportList[number].content == "") {
            var numb = Number(i) + 1;
            this.$message.error("第" + numb + "个维度中有报告内容为空！");
            this.iscontent = false;
            return;
          } else {
            this.iscontent = true;
          }
        } else if (len[i].type == "1" && this.payStage == "2") {
          if (len[i].reportList.length != 0) {
            if (this.divisiveSex == "1") {
              var stra = [];
              for (var s in len[i].reportList) {
                if (len[i].reportList[s].gender != "") {
                  stra.push(len[i].reportList[s].gender);
                }
              }
              if (stra.indexOf("1") == -1) {
                this.$message.error("你还未设置男性的报告分数范围！");
                return (this.ispass = false);
              } else if (stra.indexOf("2") == -1) {
                this.$message.error("你还未设置女性的报告分数范围！");
                return (this.ispass = false);
              }
            }
            var styType = [];
            for (var s in len[i].reportList) {
              if (len[i].reportList[s].payStage != "") {
                styType.push(len[i].reportList[s].payStage);
              }
            }
            if (styType.indexOf("2") == -1) {
              this.$message.error("你还未设置测后付费说明！");
              return (this.ispass = false);
            }

            var number = len[i].reportList.length - 1;
            if (
              Number(
                parseFloat(len[i].reportList[number].maxPoint).toFixed(2)
              ) != Number(parseFloat(len[i].max).toFixed(2)) &&
              len[i]
            ) {
              var numb = Number(i) + 1;
              this.$message.error(
                "第" + numb + "个维度值最大范围值应该为" + len[i].max + "！"
              );
              return (this.ispass = false);
            }
            var adlength = len[i].reportList;
            for (var j in adlength) {
              if (adlength[j].content == "") {
                var numb = Number(i) + 1;
                this.$message.error("第" + numb + "个维度中有报告内容为空！");
                return (this.iscontent = false);
              } else {
                this.iscontent = true;
              }
            }
          } else {
            this.$message.error("你还未设置综合维度的详细信息！");
            return;
          }
          if (len[i].reportList[number].content == "") {
            var numb = Number(i) + 1;
            this.$message.error("第" + numb + "个维度中有报告内容为空！");
            this.iscontent = false;
            return;
          } else {
            this.iscontent = true;
          }
        } else {
          if (len[i].reportList.length != 0) {
            var number = len[i].reportList.length - 1;
            if (
              Number(
                parseFloat(len[i].reportList[number].maxPoint).toFixed(2)
              ) > Number(parseFloat(len[i].max).toFixed(2)) &&
              len[i]
            ) {
              var numb = Number(i) + 1;
              this.$message.error(
                "第" +
                  numb +
                  "个维度值最大范围值应该小于等于" +
                  len[i].max +
                  "！"
              );
              return (this.ispass = false);
            }
            var adlength = len[i].reportList;
            for (var j in adlength) {
              if (adlength[j].content == "") {
                var numb = Number(i) + 1;
                this.$message.error("第" + numb + "个维度中有报告内容为空！");
                return (this.iscontent = false);
              } else {
                this.iscontent = true;
              }
            }
          }
        }
      }
      if (this.ispass && this.iscontent) {
        this.btnloading = true;
        var params = new URLSearchParams();
        var arr = new Array();
        for (var i in this.items) {
          var Sting = {
            id: this.items[i].id,
            appAdvice: {
              id: this.items[i].appAdvice.id,
              content: this.items[i].appAdvice.jycontent
            }
          };
          var arrrope = new Array();
          for (var k in this.items[i].reportList) {
            var list = {
              id: this.items[i].reportList[k].id,
              gender: this.items[i].reportList[k].gender,
              minPoint: this.items[i].reportList[k].minPoint,
              maxPoint: this.items[i].reportList[k].maxPoint,
              content: this.items[i].reportList[k].content,
              payStage: this.items[i].reportList[k].payStage
            };
            arrrope.push(list);
          }
          Sting.reportList = arrrope;
          arr.push(Sting);
        }
        var str = {
          appraisalId: this.appraisalId,
          data: arr
        };
        params.append("param", JSON.stringify(str));
        this.$axios
          .post("/api/backstage/appraisal/addOrUpdateReport", params)
          .then(
            res => {
              if (res.data.code == "200") {
                localStorage.removeItem("id" + this.appraisalId);
                this.$message({
                  type: "success",
                  message: "保存成功！"
                });
                this.btnloading = false;
                this.$router.push("/home/appraisalList");
              } else {
                this.btnloading = false;
                this.$message.error("保存失败！");
              }
            },
            err => {
              console.log(err);
            }
          );
      } else {
        this.$message.error("输入范围值有误,请检查后提交！");
      }
    },
    openreporOne() {
      for (var i = 0; i < localStorage.length; i++) {
        var lostion = JSON.parse(localStorage.getItem(localStorage.key(i)));

        if (
          localStorage.key(i) == "id" + this.appraisalId &&
          lostion != null &&
          lostion.index == 3
        ) {
          this.$confirm("你有未完成的报告草稿内容，是否覆盖显示?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.items = lostion.items;
              this.$message({
                type: "success",
                message: "读取草稿成功!"
              });
            })
            .catch(() => {
              localStorage.removeItem("id" + this.appraisalId);
              this.$message({
                type: "info",
                message: "取消读取！"
              });
            });
        }
      }
    },
    openreporTwo() {
      this.$confirm("你将要离开报告页面，是否保存草稿?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          var list = {
            index: 3,
            items: this.items
          };
          localStorage.setItem("id" + this.appraisalId, JSON.stringify(list));
          this.$message({
            type: "success",
            message: "保存草稿成功!"
          });
        })
        .catch(() => {
          localStorage.removeItem("id" + this.appraisalId);
          this.$message({
            type: "info",
            message: "取消保存草稿！"
          });
        });
    }
  },
  beforeDestroy() {
    if (this.removeads != "离开") {
      this.openreporTwo();
    }
  }
};
</script>

<style>
#ue-html p img {
  max-width: 100% !important;
}
.int-shuoming {
  /* text-align: center; */
  line-height: 20px;
  font-size: 13px;
  color: #36aafd;
}
.ifshow:hover {
  color: #36aafd;
  cursor: pointer;
}
.elselce {
  width: 60%;
  margin-left: 40px;
}
.elselce > .el-select {
  width: 100%;
}
.textok {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.tinajiarepo {
  width: 220px;
  height: 50px;
  margin: 30px auto;
  /* text-align: center; */
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 50px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  font-size: 14px;
}
.adjia {
  font-size: 20px;
  font-weight: 600;
  padding: 0 5px;
}
.ql-editor {
  min-height: 300px;
}
.nall {
  width: 90%;
  height: 150px;
  margin: 0 auto;
  text-align: center;
  line-height: 150px;
  background: #cccccc;
}
.report-top {
  width: 100%;
  height: 100%;
  display: flex;
}

.report {
  width: 100%;
  min-height: 300px;
  margin: 0 auto;
  /* margin-top: 50px; */
}

.reportsat {
  width: 90%;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.reportsat-top {
  width: 80%;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.botton {
  width: 80px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #36aafd;
  border: none;
  color: aliceblue;
  border-radius: 10px;
}
.set-thenme {
  width: 100%;
  height: 120px;
  box-sizing: border-box;
}
.int-title {
  display: block;
  width: 100%;
  height: 60px;
  font-size: 20px;
  padding-left: 10px;
}
.int-title:hover {
  border: 1px dashed #cccccc;
}
.int-title:focus {
  outline: none;
}
.title-shuming {
  display: block;
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding-left: 10px;
  margin-top: 10px;
}
.title-shuming:hover {
  border: 1px dashed #cccccc;
}
.title-shuming:focus {
  outline: none;
}
.serthem-title-bor {
  width: 90%;
  padding: 10px 20px;
  box-sizing: border-box;
  box-shadow: 1px 3px 5px #cccccc;
  margin: 20px auto;
}

.repo {
  width: 95%;
  padding: 10px 20px;
  margin-top: 10px;
  box-sizing: border-box;
  box-shadow: 1px 3px 5px #cccccc;
  margin: 20px auto;
}
.repo-top {
  width: 100%;
  /* height: 120px; */
  box-sizing: border-box;
}
.int-repo85 {
  display: block;
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding-left: 10px;
}
.int-repo {
  display: block;
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding-left: 10px;
}

.ser-btn {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.radio-div {
  margin-top: 20px;
  margin-left: 10px;
  font-size: 12px;
}
.radio-input {
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.radio-div > .radio-input > .el-radio {
  margin: 0;
}
.int-number {
  width: 100px;
  height: 30px;
}
.spanmarin {
  padding-left: 10px;
}
.radio-shuming {
  width: 40%;
  height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #cccccc;
}
.radio-shuming:hover {
  border: 1px dashed #cccccc;
}
.radio-shuming:focus {
  outline: none;
}
.repo-botton {
  width: 130px;
  height: 30px;
  margin-top: 10px;
  display: flex;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  font-weight: 600;
}
.repo-botton:hover {
  color: #36aafd;
}
.repo-botton-ok {
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border-radius: 20px;
  background: #36aafd;
  color: #ffffff;
}
.repo-botton-ok:hover {
  cursor: pointer;
}
.repo-botton:hover {
  /* background: #dbd9d9; */
  cursor: pointer;
}
.tianjiayige {
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  margin-right: 5px;
  margin-left: 15px;
}
.bentichaozuo {
  width: 100px;
  font-size: 14px;
}
.bentichaozuo:hover {
  color: #36aafd;
}
.reportsatticass {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reportsatticass555 {
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.repobb {
  width: 100%;
  height: 30px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 侧边栏2.0 */
.serathen-left {
  width: 100px;
  height: 100%;
  /* background: #36aafd; */
}
.serathen-right {
  width: 80%;
  height: 100%;
  /* margin: 0 auto; */
}
.serathen-left-li {
  width: 100%;
  height: 26px;
  margin: 10px 0;
  overflow: hidden;
  border: 1px solid #cccccc;
  text-align: center;
  line-height: 26px;
  font-size: 14px;
  box-shadow: 0px 3px 5px #cccccc;
}
.serathen-left-li:hover {
  outline: -webkit-focus-ring-color auto 5px;
  color: #36aafd;
}
.int-iputser {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 14px;
  text-align: center;
}
.report-right {
  width: 100%;
  height: 100%;
}
.acve {
  background: #36aafd;
  color: #ffffff;
}
.acve:hover {
  color: #ffffff;
}

.UE {
  width: 100%;
  display: flex;
  align-items: center;
}
.ue-left {
  width: 420px;
  height: 100%;
}
.ue-right {
  width: 420px;
  height: 550px;
  margin-left: 90px;
}
.ue-html p {
  width: 100%;
}
.ue-html p img {
  max-width: 100%;
}
.artincadmin {
  width: 100%;
  height: 30px;
  color: #ffffff;
  background: #000000;
}
.h1111 {
  width: 70px;
  height: 100%;
  text-align: center;

  line-height: 30px;
  margin: 0 auto;
}
.ue-html {
  width: 100%;
  height: 520px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  overflow-x: hidden;
  border: 1px solid #cacaca;
  background: #f9f9f9;
}


</style>
