<template>
  <div class="popset">
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">推广员招募</div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">开启招募</div>
        <div>
          <div class="radiodivapp">
            <el-radio v-model="openRecruit" label="1">开启</el-radio>
            <span class="config-span">开启后可申请成为推广员</span>
          </div>
          <div>
            <el-radio v-model="openRecruit" label="0">关闭</el-radio>
            <span class="config-span">关闭后用户不可申请成为推广员</span>
          </div>
          <div class="config" v-show="openRecruit == '1'">
            <div class="EC8 ET3 config-title">招募审核</div>
            <div>
              <div class="radiodivapp">
                <el-radio v-model="recruitAudit" label="1">开启</el-radio>
                <span class="config-span">开启后用户申请成为推广员需要商家审核</span>
              </div>
              <div>
                <el-radio v-model="recruitAudit" label="0">关闭</el-radio>
                <span class="config-span">关闭后，满足条件的用户可成为推广员，无需商家审核</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="config">
        <div class="EC8 ET4 config-title">发展下级</div>
        <div>
          <div class="radiodivapp">
            <el-radio v-model="developJunior" label="1">开启</el-radio>
            <span class="config-span">开启后，所有推广员可邀请好友成为推广员；被邀请方成功推广后，邀请方会获得“间接推广佣金”</span>
          </div>
          <div style="margin-bottom: 10px;display: flex;">
            <el-radio v-model="developJunior" label="0">关闭</el-radio>
            <span class="config-span">关闭后，所有推广员不可邀请好友成为推广员，已存在的邀请关系不受影响</span>
          </div>
          <span class="config-span zhuyishegn">注意：升级后，开启“发展下级”，普通/高级推广员都可以发展下级，但不影响您现有推广分成，已兼容原数据。</span>
        </div>
      </div>
    </div>
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">客户绑定模式</div>
      </div>
      <div class="configcard">
        <el-row :gutter="20">
          <el-col :span="5" style="position: relative;">
            <el-card shadow="always">
              <div @click="cardA">
                <div class="card-btn">
                  <div class="btn">
                    <el-radio v-model="customerType" label="0">选择简单模式</el-radio>
                  </div>
                  <span
                    style="font-size:20px;"
                    class="el-icon-warning-outline"
                    @mouseenter="enter(1)"
                    @mouseleave="leave(1)"
                  >
                    <div class="positopn-top" :class="isShowID== 1? 'autactive' : ''">
                      推广员A与买家B已绑定为客户关系：
                      <br>若B购买了商品则算推广员A的业绩,
                      <br>不会被其他推广员抢走。
                    </div>
                  </span>
                </div>
                <div class="popset-h2">简单模式</div>
                <div class="popser-p">
                  客户永久有效
                  <br>不允许抢客
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" style="position: relative;">
            <el-card shadow="always">
              <div @click="cardB">
                <div class="card-btn">
                  <div class="btn">
                    <el-radio v-model="customerType" label="1">选择平衡模式</el-radio>
                  </div>
                  <span
                    style="font-size:20px;"
                    class="el-icon-warning-outline"
                    @mouseenter="enter(2)"
                    @mouseleave="leave(2)"
                  >
                    <div class="positopn-top" :class="isShowID== 2? 'autactive' : ''">
                      推广员A与买家B已绑定为客户关系：
                      <br>在15天内,绑定关系不变，若B购买了商品则算推广A的业绩。
                    </div>
                  </span>
                </div>
                <div class="popset-h2">平衡模式</div>
                <div class="popser-p">
                  客户15天内有效
                  <br>不允许抢客
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" style="position: relative;">
            <el-card shadow="always" @click="cardC">
              <div @click="cardC">
                <div class="card-btn">
                  <div class="btn">
                    <el-radio v-model="customerType" label="2">选择竞争模式</el-radio>
                  </div>
                  <span
                    style="font-size:20px;"
                    class="el-icon-warning-outline"
                    @mouseenter="enter(3)"
                    @mouseleave="leave(3)"
                  >
                    <div
                      class="positopn-top"
                      style="height:145px;"
                      :class="isShowID== 3? 'autactive' : ''"
                    >
                      推广员A与买家B已绑定为客户关系；
                      <br>在15天内，若B购买了商品，则算推，广员A的业绩；若B通过推广员C的推
                      <br>广链接购买，则业绩属于推广员C。
                    </div>
                  </span>
                </div>
                <div class="popset-h2">竞争模式</div>
                <div class="popser-p">
                  客户永久有效
                  <br>客户随时可以被抢走
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" style="position: relative;">
            <el-card shadow="always">
              <div @click="cardD">
                <div class="card-btn">
                  <div class="btn">
                    <el-radio v-model="customerType" label="3">自定义</el-radio>
                  </div>
                  <span
                    style="font-size:20px;"
                    class="el-icon-warning-outline"
                    @mouseenter="enter(4)"
                    @mouseleave="leave(4)"
                  >
                    <div
                      class="positopn-top"
                      style="height:90px"
                      :class="isShowID== 4? 'autactive' : ''"
                    >
                      可设置有效期：永久有效，或自定义有效期,
                      <br>可设置抢客：不可抢客，或指定时间过后可以抢客.
                    </div>
                  </span>
                </div>
                <div class="popset-h2">自定义</div>
                <div class="popser-p" >
                  有效期：
                  <span v-if="auto == '1'">永久有效</span>
                  <span v-if="auto == '0'">{{title}}天内有效</span>
                  <br>
                  <span v-if="noauto == '1'">不许抢客</span>
                  <span v-if="noauto == '0'">{{input}}天内不许抢客</span>
                </div>
                <span class="shezhi-span" @click="customClick">去设置</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <span style="padding-left:20px;font-size: 12px;color: #888;">模式修改后立即生效，每天只能修改一次</span>
      </div>
    </div>
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">权益设置</div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">结算方式</div>
        <div>
          <div class="radiodivapp">
            <el-radio v-model="clearType" label="1">自动结算</el-radio>
            <span class="config-span">（间接推广佣金）</span>
          </div>
          <div>
            <el-radio v-model="clearType" label="0">手动结算</el-radio>
          </div>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">自购分佣</div>
        <div>
          <div class="radiodivapp">
            <el-radio v-model="buyMyself" label="1">开启</el-radio>
            <span class="config-span">（开启后，推广员购买推广商品，可获得直接推广佣金，推广员的上级邀请人获得间接推广佣金）</span>
          </div>
          <div>
            <el-radio v-model="buyMyself" label="0">关闭</el-radio>
          </div>
        </div>
      </div>
    </div>
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">公众号通知设置</div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">推广通知</div>
        <div>
          <div class="radiodivapp">
            <el-radio v-model="generalizeNotice" disabled label="1">开启</el-radio>
            <span class="config-span">（默认关闭，暂不开放！）</span>
          </div>
          <div>
            <el-radio v-model="generalizeNotice" disabled label="0">关闭</el-radio>
          </div>
          <div class="config">
            <div class="EC8 ET3 config-title">审核结果通知</div>
            <div>
              <div class="radiodivapp">
                <el-radio v-model="audit_notice" disabled label="1">已开启</el-radio>
                <span class="config-span">（默认关闭，暂不开放）</span>
                <div>
                  <el-radio v-model="audit_notice" disabled label="0">已关闭</el-radio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="recruit-wrapper">
      <div class="title">
        <div class="title__text">其他设置</div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">最低提现金额</div>
        <div>
          <el-input-number placeholder="请输入最低提现金额" v-model="minWithdrawal"></el-input-number>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">每日最大提现金额</div>
        <div>
          <el-input-number placeholder="请输入每日最大提现金额" v-model="dayMaxWishdrawal"></el-input-number>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">每笔最大提现金额</div>
        <div>
          <el-input-number placeholder="请输入每笔最大提现金额" v-model="timeMaxWishdrawal"></el-input-number>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">店铺海报</div>
        <div>
          <div class="config" id="config">
            <div class="imgporrer">
              <span class="config-span" style="color:red;margin:15px 0;">建议尺寸：300x500px或者3:5</span>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleImageSuccess"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="imageUrl"
                  :src="uploadimgUrl+imageUrl"
                  style="width:100%;height:100%"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="config">
        <div class="EC8 ET4 config-title">推广员邀请描述</div>
        <div>
          <el-input
            type="textarea"
            style="width:800px;"
            placeholder="请输入描述邀请"
            v-model="shareInviteDescribe"
          ></el-input>
        </div>
      </div>
    </div>
    <el-dialog title="自定义模式" :visible.sync="dialogVisible" width="45%">
      <div>
        <div class="config">
          <div class="valid-title">绑定有效期</div>
          <div class="valid-btn">
            <div class="radiodivapp">
              <el-radio v-model="auto" label="1" @change="noautochangeValue">永久有效</el-radio>
              <div style="margin-top:10px;display:flex;align-items: center;">
                <el-radio v-model="auto" label="0" @change="autochangeValue">
                  <el-input
                    v-model="autoinput"
                    :disabled="disabledone"
                    style="width:100px;"
                    placeholder="输入天数"
                  ></el-input>
                </el-radio>
                <div>
                  天内有效
                  <span class="config-span">到期后客户会自动解锁,需重新推广客户</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="config">
          <div class="valid-title">允许抢客</div>
          <div class="valid-btn">
            <div class="radiodivapp">
              <el-radio v-model="noauto" label="1" @change="noautoValue">不许抢客</el-radio>
              <div style="margin-top:10px;display:flex;align-items: center;">
                <el-radio v-model="noauto" label="0" @change="changeValue">
                  自绑定起
                  <el-input
                    v-model="noautoinput"
                    :disabled="disabledtwo"
                    style="width:100px;margin:0 5px;"
                    placeholder="输入天数"
                  ></el-input>天后抢客
                </el-radio>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </span>
    </el-dialog>
    <div class="btn-ok">
      <el-button type="primary" @click="updateSystemSet" :loading="toLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "popset",
  data() {
    return {
      isShowID: "",
      uploadUrl: "",
      imageUrl: "",
      uploadimgUrl: "",
      dialogVisible: false,
      openRecruit: "1",
      recruitAudit: "0",
      developJunior: "1",
      buyMyself: "1",
      generalizeNotice: "0",
      customerType: "0",
      audit_notice: "0",
      shareInviteDescribe: "",
      minWithdrawal: "",
      dayMaxWishdrawal: "",
      timeMaxWishdrawal: "",
      disabledone: true,
      disabledtwo: true,
      bindingIndate: "", //绑定有效期(-1时为永久有效，其他数字代表天数)
      robCustomer: "", //绑定有效期(-1时为永久有效，其他数字代表天数)
      auto: "1",
      autoinput: "",
      noauto: "1",
      noautoinput: "",
      title: "",
      input: "",
      date: new Date(),
      toLoading: false,
      clearType: ""
    };
  },
  created() {
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.uploadimgUrl = this.$uploadUrl;
  },
  mounted: function() {
    this.getSystemSetInfo();
    // this.getDisUserLevelList();
  },
  methods: {
    enter(id) {
      this.isShowID = id;
    },
    leave(id) {
      this.isShowID = "";
    },
    handleImageSuccess(res, file) {
      this.imageUrl = res.datas;
    },
    // 验证图片
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";

      let _this = this;
      return new Promise(function(resolve, reject) {
        // let width = 654; // 限制图片尺寸为654X270
        // let height = 270;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          // let valid = img.width === width && img.height === height; 如果上传图片为固定尺寸，则用此项。
          let valid = img.width / img.height == 0.6;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸限制为3:5！");
          return Promise.reject();
        }
      );
    },
    // 弹框确定
    dialogOk() {
      if (this.auto == "0" && this.autoinput == "") {
        this.$message.error("时间为空！");
        return;
      } else {
        this.title = this.autoinput;
      }
      if (this.noauto == "0" && this.noautoinput == "") {
        this.$message.error("时间为空！");
        return;
      } else {
        this.input = this.noautoinput;
      }
      this.dialogVisible = false;
    },
    noautochangeValue(val) {
      if (val == "1") {
        this.disabledone = true;
      }
    },
    noautoValue(val) {
      if (val == "1") {
        this.disabledtwo = true;
      }
    },
    changeValue(val) {
      if (val == "0") {
        this.disabledtwo = false;
      }
    },
    autochangeValue(val) {
      if (val == "0") {
        this.disabledone = false;
      }
    },
    // 获取设置
    getSystemSetInfo() {
      var params = new URLSearchParams();
      this.$axios.get("/api/backstage/expand/getSystemSetInfo", params).then(
        res => {
          if (res.data.code == 200) {
            var str = res.data.datas;
            this.openRecruit = str.openRecruit;
            this.recruitAudit = str.recruitAudit;
            this.developJunior = str.developJunior;
            this.clearType = str.clearType;
            this.generalizeNotice = str.generalizeNotice;
            this.audit_notice = str.audit_notice;
            this.minWithdrawal = str.minWithdrawalStr;
            this.dayMaxWishdrawal = str.dayMaxWishdrawalStr;
            this.timeMaxWishdrawal = str.timeMaxWishdrawalStr;
            this.buyMyself = str.buyMyself;
            this.customerType = str.customerType;
            this.imageUrl = str.posterAddr;
            this.shareInviteDescribe = str.shareInviteDescribe;
            this.lastUpdateTime = str.lastUpdateTime;
            if (str.bindingIndate == -1) {
              this.auto = "1";
            } else {
              this.auto = "0";
              this.disabledone = false;
              this.title = str.bindingIndate;
              this.autoinput = str.bindingIndate;
            }
            if (str.robCustomer == -1) {
              this.noauto = "1";
            } else {
              this.noauto = "0";
              this.disabledtwo = false;
              this.input = str.robCustomer;
              this.noautoinput = str.robCustomer;
            }
          } else {
            this.$message.error("查询失败");
          }
        },
        err => {
          this.$message.error("加载失败");
        }
      );
    },
    //  完成设置状态提交
    updateSystemSet() {
      var that = this;
      var Indate;
      var tomer;
      var params = new URLSearchParams();
      if (this.customerType == "3") {
        if (this.auto == "1") {
          Indate = -1;
        } else {
          Indate = this.title;
        }
        if (this.noauto == "1") {
          tomer = -1;
        } else {
          tomer = this.input;
        }
      } else {
        Indate = "";
        tomer = "";
      }
      var a = this.date;
      var result =
        a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();

      var str = {
        openRecruit: this.openRecruit,
        recruitAudit: this.recruitAudit,
        developJunior: this.developJunior,
        clearType: this.clearType,
        generalizeNotice: this.generalizeNotice,
        audit_notice: this.audit_notice,
        minWithdrawal: this.minWithdrawal,
        dayMaxWishdrawal: this.dayMaxWishdrawal,
        timeMaxWishdrawal: this.timeMaxWishdrawal,
        buyMyself: this.buyMyself,
        customerType: this.customerType,
        bindingIndate: Indate,
        robCustomer: tomer,
        posterAddr: this.imageUrl,
        shareInviteDescribe: this.shareInviteDescribe,
        lastUpdateTime: result
      };
      this.toLoading = true;
      params.append("param", JSON.stringify(str));
      that.$axios.post("/api/backstage/expand/updateSystemSet", params).then(
        res => {
          if (res.data.code == 200) {
            this.toLoading = false;
            this.$message.success("保存成功！");
          } else {
            that.$message.error("查询失败");
          }
        },
        err => {
          that.$message.error("加载失败");
        }
      );
    },
    // 自定义设置
    customClick() {
      this.dialogVisible = true;
    },
    // 模式
    cardA() {
      this.customerType = "0";
    },
    cardB() {
      this.customerType = "1";
    },
    cardC() {
      this.customerType = "2";
    },
    cardD() {
      this.customerType = "3";
    }
  }
};
</script>

<style>
.popset {
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
}
.recruit-wrapper {
  margin-top: 40px;
}
.title {
  display: flex;
  border-left: 2px solid #2a75ed;
  padding-left: 8px;
}
.title__text {
  font-weight: 600;
  font-size: 16px;
  color: #353535;
}
.config {
  display: flex;
  margin-top: 25px;
}
.config-title {
  margin-right: 20px;
}
.ET4 {
  font-size: 14px;
}
.ET3 {
  font-size: 14px;
}
.EC8 {
  color: #888;
}
.config-span {
  line-height: 20px;
  font-size: 12px;
  color: #888;
}
.configcard {
  width: 100%;
  margin-top: 25px;
  padding-left: 10px;
}
.card-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.btn {
  width: 25px;
  height: 25px;
}
.btn img {
  width: 100%;
  height: 100%;
}
.popset-h2 {
  font-size: 18px;
  font-weight: 600;
  padding: 20px 0;
}
.popser-p {
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 40px;
}
.shezhi {
  padding-bottom: 24px;
}
.shezhi-span {
  display: block;
  width: 100%;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #2a75ed;
  position: absolute;
  bottom: 30px;
  left: 0;
}
.radiodivapp {
  /* display: flex; */
  margin-bottom: 15px;
}
.zhuyishegn {
  padding-top: 20px;
}
.btn-ok {
  width: 100%;
  margin-top: 40px;
  text-align: center;
}
.valid-title {
  width: 96px;
  text-align: left;
}
#config {
  width: 300px;
  height: 500px;
}

#config .imgporrer .avatar-uploader .el-upload {
  width: 300px;
  height: 500px;
}

#config .imgporrer .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
#config .imgporrer .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#config .imgporrer .avatar-uploader .el-upload.el-icon-plus {
  width: 100%;
  height: 100%;
  line-height: 500px;
  font-size: 28px;
}
/* .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
} */
.right-ride {
  margin-left: 20px;
}
.positopn-top {
  position: absolute;
  display: none;
  width: 139px;
  top: 52px;
  right: -25px;
  height: 113px;
  font-size: 12px;
  text-align: left;
  padding: 10px 11px;
  line-height: 22px;
  background: #ffffff;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.05), 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
.always {
  position: relative;
}
.autactive {
  display: block;
}
</style>
