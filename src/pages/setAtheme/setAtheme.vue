<template>
  <div class="seratheme-top">
    <!-- <div class="position" v-if="btnFlag" @click="havertop">sssss</div> -->
    <div class="serathen-left">
      <ul>
        <li
          v-for="(item,index) in curseList"
          :key="index"
          class="serathen-left-li"
          @click="enterThem(index)"
          :class="{active:num==index}"
        >
          <input
            class="int-iputser"
            :class="{active:num==index}"
            v-if="index == inputIndex"
            v-model="item.dimName"
            placeholder="请输入"
          />
          <span v-else style="overflow: hidden;">{{item.dimName}}</span>
        </li>
        <li class="serathen-left-li" @click="tjcurse">
          <i class="el-icon-circle-plus-outline"></i>
          <span style="font-size:12px;">添加维度</span>
        </li>
        <li class="serathen-left-li" @click="removeCurse">
          <i class="el-icon-delete-solid"></i>
          <span style="font-size:12px;">删除维度</span>
        </li>
      </ul>
    </div>

    <div class="serathen-right">
      <div class="seratheme">
        <div class="nall" v-show="isshow">您还未出题，请先创建维度再创建题目！</div>
        <!-- 题目-->
        <div
          class="serthemname"
          v-for="(item,index) in curseList"
          v-show="index == num"
          :key="index"
        >
          <div class="serthemname" v-for="(qusen,id) in item.question" :key="id">
            <div class="serthemname-top">
              <div class="divacticass">
                <div class="divac">
                  <span>问题{{qusen.rank}}:</span>
                  <!-- <span v-if="index+1">问题{{item.question.length+id+1}}:</span> -->

                  <input class="int-serthemname" v-model="qusen.quesDes" placeholder="这是题目，单选题" />
                </div>
                <div class="bentichaozuo" v-on:click="deleteTest(id,index)">
                  <i class="el-icon-delete"></i>
                  <span>删除本题</span>
                </div>
              </div>
              <div class="radio-div">
                <div class="radio-input" v-for="(answers,number) in qusen.answer" :key="number">
                  <span>选项{{number+1}}、</span>
                  <input
                    :class="stType.questionType  == '2'?'radio-shuming':'otherActiveClass'"
                    v-model="answers.answerDes"
                    placeholder="请输入内容"
                  />
                  <span class="spanmarin">分数：</span>
                  <el-input-number
                    size="mini"
                    controls-position="right"
                    v-model="answers.point"
                    :min="0"
                    label="分数"
                  ></el-input-number>
                  <div v-if="stType.questionType  == '2'">
                    <span class="spanmarin">题目序号：</span>
                    <el-input-number
                      size="mini"
                      :min="-1"
                      controls-position="right"
                      v-model="answers.questionRank"
                    ></el-input-number>
                    <!-- <input
                      class="radio-questionRank"
                      v-model="answers.questionRank"
                      placeholder="请输入跳转题序"
                    />-->
                  </div>
                </div>
              </div>
            </div>

            <div class="serthemnamebb">
              <span
                v-if="stType.questionType  == '2'"
                style="color:red;font-size:12px;margin-top: 10px;"
              >*若直接结束题目序号填-1,若无则为空或0。</span>
              <div class="serthemname-botton" @click="addInput(id,index)">
                <span style="padding-right:5px;" class="el-icon-plus"></span>添加单个选项
              </div>
              <div class="serthemname-botton" @click="deleteInput(id,index)">
                <span style="padding-right:5px;" class="el-icon-delete"></span>删除单个选项
              </div>
            </div>
          </div>
          <div class="seratheme-right" @click="addTest(index)">+</div>
        </div>
      </div>
      <div class="ser-btn">
        <el-button type="primary" :loading="btnloading" @click="backSlepFirste">上一步</el-button>
        <el-button type="success" :loading="btnloading" @click="resultBtn">保存并下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import scroll from "@/components/scroll";
export default {
  data() {
    return {
      inputTitle: "",
      btnloading: false,
      inputWriting: "",
      isshow: true,
      inputtimu: "",
      items: [],
      text: 0,
      iteminputs: [],
      textinput: 2,
      result: [],
      ispass: false,
      strNumber: [],
      isCollapse: true,
      // 2.0新增内容\
      num: 0,
      curseList: [],
      active: false,
      inputIndex: 0,
      btnFlag: true,
      stType: {},
      removead: ""
    };
  },
  // components: {
  //   scroll
  // },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isstate: {
      type: Boolean,
      default: false
    },
    appraisalId: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.getQuestion();
    this.stType = JSON.parse(sessionStorage.getItem("questiontype"));
    this.openOne();
    this.isshowTo();
  },

  methods: {
    // // 回顶部
    // havertop(e) {
      
    // },
    //查询
    getQuestion() {
      var params = new URLSearchParams();
      params.append("appraisalId", this.appraisalId);
      this.$axios.post("/api/backstage/appraisal/getQuestion", params).then(
        res => {
          if (res.data.code == "200") {
            var arr = res.data.datas;
            for (var i in arr) {
              if (arr[i].type == "1") {
                arr.splice(i, 1);
              }
              if (arr[0].question[0].rank == 0) {
                for (var k in arr[i].question) {
                  arr[i].question[k].rank += 1;
                }
              }
            }

            this.curseList = arr;
            this.isshowTo();
          }
        },
        err => {}
      );
    },
    isshowTo() {
      if (this.curseList != "") {
        this.isshow = false;
      }
    },

    // 添加题目
    addTest: function(index) {
      if (this.curseList[index].dimName == "") {
        this.$message.error("请输入该项维度值！");
      } else {
        var len;
        var rank;
        if (index == 0 && this.curseList[index].question.length == 0) {
          rank = 1;
        } else if (this.curseList[index].question != "") {
          len = this.curseList[index].question.length;
          rank = this.curseList[index].question[len - 1].rank + 1;
        } else {
          len = this.curseList[index - 1].question.length;
          rank = this.curseList[index - 1].question[len - 1].rank + 1;
        }

        var question = {
          rank: rank,
          quesDes: "",
          maxPoint: 0,
          minPoint: 0,
          answerNum: 1,
          answer: []
        };
        this.curseList[index].question.push(question);
        this.isshowTo();
      }
    },
    deleteTest: function(id, index) {
      if (this.curseList[index].question[id].id != undefined) {
        var params = new URLSearchParams();
        params.append("id", this.curseList[index].question[id].id);
        this.$axios
          .post("/api/backstage/appraisal/deleteQuestion", params)
          .then(
            res => {
              if (res.data.code == "200") {
                this.curseList[index].question.splice(id, 1);
                this.$message.success("删除成功！");
              } else {
                this.$message.error("删除失败！");
              }
            },
            err => {}
          );
      } else {
        this.curseList[index].question.splice(id, 1);
      }

      this.isshowTo();
    },
    // 保存下一步
    resultBtn: function() {
      this.removead = "离开";
      if (this.curseList == "") {
        this.$message.error("提交内容不能为空！");
      } else if (this.curseList != "") {
        for (var i in this.curseList) {
          if (this.curseList[i].dimName == "") {
            this.$message.error("维度内容不能为空！");
            return;
          }
          if (this.curseList[i].question == "") {
            this.$message.error("提交题目不能为空！");
            return;
          } else if (this.curseList[i].question != "") {
            for (var k in this.curseList[i].question) {
              if (this.curseList[i].question[k].quesDes == "") {
                this.$message.error("题目内容不能为空！");
                return;
              } else if (this.curseList[i].question[k].answer == "") {
                this.$message.error("你没有添加的选项！");
                return;
              } else if (this.curseList[i].question[k].answer != "") {
                for (var j in this.curseList[i].question[k].answer) {
                  if (this.curseList[i].question[k].answer[j].answerDes == "") {
                    this.$message.error("选项内容不能为空！");
                    return;
                  }
                }
              }
            }
          }
        }
        this.btnloading = true;
        var params = new URLSearchParams();
        var list = {};
        list.appraisalId = this.appraisalId;
        list.dim = this.curseList;
        params.append("param", JSON.stringify(list));
        this.$axios
          .post("/api/backstage/appraisal/addOrUpdateQuestion", params)
          .then(
            res => {
              if (res.data.code == "200") {
                // localStorage.removeItem("id" + this.appraisalId);
                this.btnloading = false;
                this.btn(3);
                this.$message({
                  message: "编辑题目成功！",
                  type: "success"
                });
              } else {
                this.btnloading = false;
                this.$message.error("编辑题目失败！");
              }
            },
            err => {}
          );
      }
    },
    // 添加选项
    addInput: function(id, index) {
      var answer = {
        answerDes: "",
        point: "",
        questionRank: ""
      };
      this.curseList[index].question[id].answer.push(answer);
    },
    deleteInput: function(id, index) {
      var len = this.curseList[index].question[id].answer.length;
      if (this.curseList[index].question[id].answer[len - 1].id != undefined) {
        var params = new URLSearchParams();
        params.append(
          "id",
          this.curseList[index].question[id].answer[len - 1].id
        );
        this.$axios.post("/api/backstage/appraisal/deleteAnswer", params).then(
          res => {
            if (res.data.code == "200") {
              this.curseList[index].question[id].answer.splice(len - 1, 1);
              this.$message.success("删除成功！");
            } else {
              this.$message.error("删除失败！");
            }
          },
          err => {}
        );
      } else {
        this.curseList[index].question[id].answer.splice(len - 1, 1);
      }
      if (len == 1) {
        return;
      }
    },
    btn(btnstr) {
      if (btnstr == "0") {
        this.$emit("btn", "0");
      } else if (btnstr == "3") {
        var data = {
          id: "3",
          strNumber: this.curseList
        };
        this.$emit("btn", data);
      }
    },
    // 传值
    backSlepFirste() {
      this.btn(0);
    },

    // 2.0版本更新
    // 添加
    tjcurse() {
      var arr = {
        dimName: "",
        type: "2",
        question: []
      };
      this.curseList.push(arr);
      this.isshowTo();
    },
    //删除维度
    removeCurse(index) {
      var len = this.curseList.length;
      if (this.curseList[len - 1].id != undefined) {
        var params = new URLSearchParams();
        params.append("id", this.curseList[len - 1].id);
        this.$axios
          .post("/api/backstage/appraisal/deleteDimension", params)
          .then(
            res => {
              if (res.data.code == "200") {
                this.curseList.splice(len - 1, 1);
                this.$message.success("删除成功！");
              } else {
                this.$message.error("删除失败！");
              }
            },
            err => {}
          );
      } else {
        this.curseList.splice(len - 1, 1);
      }
      if (this.curseList == "") {
        this.isshow = true;
      }
    },
    // 点击编辑
    enterThem(index) {
      this.inputIndex = index;
      this.num = index;
    },
    openOne() {
      for (var i = 0; i < localStorage.length; i++) {
        var lostion = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (
          localStorage.key(i) == "id" + this.appraisalId &&
          lostion != null &&
          lostion.index == 2
        ) {
          this.$confirm("你有未完成的题目草稿内容，是否覆盖显示?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.curseList = lostion.curseList;
              this.isshowTo();
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
    openTwo() {
      this.$confirm("你将要离开题目设置页面，是否保存草稿?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          var list = {
            index: 2,
            curseList: this.curseList
          };
          localStorage.setItem("id" + this.appraisalId, JSON.stringify(list));
          this.$message({
            type: "success",
            message: "保存草稿成功!"
          });
          this.$message({
            type: "success",
            message: "保存草稿成功!"
          });
        })
        .catch(() => {
          // localStorage.removeItem("curseList");
          localStorage.removeItem("id" + this.appraisalId);
          this.$message({
            type: "info",
            message: "取消保存草稿！"
          });
        });
    }
  },
  beforeDestroy() {
    if (this.removead != "离开") {
      this.openTwo();
    }
  }
};
</script>

<style>
.nall {
  width: 90%;
  height: 150px;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  line-height: 150px;
  background: #dddddd;
}
.nallAll {
  width: 90%;
  height: 150px;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  line-height: 150px;
}
.seratheme-top {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}
.seratheme-right {
  width: 100px;
  height: 100px;
  margin: 10px auto;
  text-align: center;
  line-height: 100px;
  font-size: 30px;
  border: 1px solid #cccccc;
  border-radius: 50%;
}
.seratheme {
  width: 100%;
  min-height: 340px;
  margin: 0 auto;
  /* margin-top: 50px; */
}

.sertheme {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.divac {
  width: 80%;
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

.serthemname {
  width: 95%;
  padding: 10px 10px;
  margin-top: 10px;
  box-sizing: border-box;
  box-shadow: 1px 3px 5px #cccccc;
  margin: 20px auto;
}
.serthemname-top {
  width: 100%;
  /* height: 120px; */
  box-sizing: border-box;
}
.int-serthemname {
  display: block;
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding-left: 10px;
}
.int-serthemname:hover {
  border: 1px dashed #cccccc;
}
.int-serthemname:focus {
  outline: none;
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
.otherActiveClass {
  width: 60%;
  height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #cccccc;
}
.otherActiveClass:hover {
  border: 1px dashed #cccccc;
}
.otherActiveClass:focus {
  outline: none;
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
.radio-questionRank {
  width: 32%;
  height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #cccccc;
}
.radio-questionRank:hover {
  border: 1px dashed #cccccc;
}
.radio-questionRank:focus {
  outline: none;
}
.serthemname-botton {
  width: 180px;
  height: 30px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  font-size: 12px;
  font-weight: 600;
}
.serthemname-botton:hover {
  color: #36aafd;
}
.serthemname-botton-ok {
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border-radius: 20px;
  background: #36aafd;
  color: #ffffff;
}
.serthemname-botton-ok:hover {
  cursor: pointer;
}
.serthemname-botton:hover {
  /* background: #dbd9d9; */
  cursor: pointer;
}

.bentichaozuo {
  width: 100px;
  font-size: 14px;
}
.bentichaozuo:hover {
  color: #36aafd;
}
.divacticass {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.serthemnamebb {
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
.btnbaocuncao {
  width: 100%;
}
.int-iputser {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 14px;
  text-align: center;
}
.active {
  background: #36aafd;
  color: #ffffff;
}
.active:hover {
  background: #36aafd;
  color: #ffffff;
}
.position {
  position: fixed;
  bottom: 10%;
  right: 5%;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: blue;
  font-size: 14px;
  text-align: center;
  line-height: 45px;
}
</style>
