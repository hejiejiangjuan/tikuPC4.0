<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">
        <div style="margin:0 auto;"></div>
        <div class="postInfo-container">
          <el-row>
            <el-col :span="7">
              <el-form-item label-width="140px" label="标题:" class="postInfo-container-item">
                <el-input v-model="postForm.title" maxlength="20" focus placeholder="请输入标题(20字内)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="140px" label="副标题:" class="postInfo-container-item">
                <el-input
                  v-model="postForm.subhead"
                  maxlength="40"
                  focus
                  placeholder="请输入副标题(40字内)"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label-width="140px" label="报告页数:" class="postInfo-container-item">
                <el-input
                  :min="0"
                  focus
                  maxlength="8"
                  v-model="postForm.report_page_num"
                  placeholder="请输入报告页数"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="7">
              <el-form-item label-width="140px" label="基础使用人数:" class="postInfo-container-item">
                <el-input
                  :min="0"
                  focus
                  v-model="postForm.base_use_num"
                  maxlength="8"
                  placeholder="请输入人数"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label-width="140px" label="测试时间(分钟):" class="postInfo-container-item">
                <el-input :min="0" maxlength="8" v-model="postForm.test_time" placeholder="请输入时间"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label-width="140px" label="类型名称:" class="postInfo-container-item">
                <el-select v-model="type_name" placeholder="请选择">
                  <el-option
                    v-for="item in typenameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label-width="140px" label="问题数量:" class="postInfo-container-item">
                <!-- <el-input
                  :min="0"
                  maxlength="8"
                  v-model="postForm.question_num"
                  v-if="statusID == 0 || statusID == 1 || statusID == 2"
                  :disabled="true"
                  placeholder="请输入问题数"
                ></el-input>-->
                <el-input
                  :min="0"
                  maxlength="8"
                  v-model="postForm.question_num"
                  placeholder="请输入问题数"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label-width="140px" label="题目类型:" class="postInfo-container-item">
                <el-select v-model="questionType" placeholder="请选择">
                  <el-option
                    v-for="item in questionTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item
                label-width="140px"
                label="是否区分性别:"
                class="postInfo-container-item"
                style
              >
                <div class="postInfo-rido">
                  <el-radio v-model="divisive_sex" label="0">否</el-radio>
                  <el-radio v-model="divisive_sex" label="1">是</el-radio>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label-width="140px" label="是否付费:" class="postInfo-container-item" style>
                <div class="postInfo-rido">
                  <el-radio v-model="need_pay" label="0">否</el-radio>
                  <el-radio v-model="need_pay" label="1">是</el-radio>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="need_pay =='1'">
              <el-form-item label-width="140px" label="付费阶段:" class="postInfo-container-item">
                <el-select v-model="payStage" placeholder="请选择">
                  <el-option
                    v-for="item in payStageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="need_pay =='1'">
              <el-form-item label-width="140px" label="原价格(元):" class="postInfo-container-item">
                <el-input
                  :min="0"
                  v-model="postForm.original_prace"
                  maxlength="7"
                  placeholder="请输入原价"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7" v-if="need_pay =='1'">
              <el-form-item label-width="140px" label="现价格(元):" class="postInfo-container-item">
                <el-input
                  :min="0"
                  v-model="postForm.current_prace"
                  maxlength="7"
                  placeholder="请输入现价"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="7">
            <div>
              <div class="h2">
                请选择封面图片(
                <span style="color:red;">比例：1:1</span> ):
              </div>
              <div class="imgporrer">
                <ImgCutter
                  :label="'选择图片'"
                  :boxWidth="750"
                  :boxHeight="750"
                  :rate="valliOne"
                  v-on:cutDown="cutDown"
                >
                  <!-- <button type="button" slot="openImgCutter">选择图片</button> -->
                </ImgCutter>
                <div style="width:100%;">
                  <div class="stylecaijian">
                    <img
                      style="width:100%;height:100%;"
                      :src="uploadimgUrl+imageUrl"
                      v-if="!!imageUrl"
                      alt
                    />
                  </div>
                </div>
                <!-- <el-form-item
                  style="margin-bottom: 30px;margin-left: 60px;width:180px;height:180px;border:1px dashed #cccccc;"
                >
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleImageSuccess"
                    :before-upload="beforeUpload"
                  >
                    <img
                      style="border:1px solid #cccccc;"
                      v-if="imageUrl"
                      :src="uploadimgUrl+imageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>-->
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div>
              <div class="h2">
                请选择详情图片(
                <span style="color:red;">尺寸比列：1.7:1。</span> ):
              </div>
              <div class="imgporrer">
                <ImgCutter
                  :label="'选择图片'"
                  :boxWidth="850"
                  :boxHeight="500"
                  :rate="villTwo"
                  v-on:cutDown="cutDownTwo"
                >
                  <!-- <button type="button" slot="openImgCutter">选择图片</button> -->
                </ImgCutter>
                <div style="width:100%;">
                  <div class="stylecaijianTwo">
                    <img
                      style="width:100%;height:100%;"
                      :src="uploadimgUrl+dataImageUrl"
                      v-if="!!dataImageUrl"
                      alt
                    />
                  </div>
                </div>
                <!-- <el-form-item
                  style="margin-bottom: 30px;margin-left: 60px;width:180px;height:180px;border:1px dashed #cccccc;"
                >
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="dataLeImageSuccess"
                    :before-upload="beforeUploadData"
                  >
                    <img
                      style="border:1px solid #cccccc;"
                      v-if="dataImageUrl"
                      :src="uploadimgUrl+dataImageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>-->
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="artice-reader">
          <el-form-item label-width="115px" label="是否展示首页:" class="postInfo-container-item">
            <el-radio v-model="radio" label="0">否</el-radio>
            <el-radio v-model="radio" label="1">是</el-radio>
          </el-form-item>
        </div>
        <h2 class="h2" v-if="radio =='1'">首页内容</h2>
        <div class="textop" v-if="radio =='1'" style="margin-bottom: 30px;">
          <div class="UE">
            <vue-ueditor-wrap v-model="postForm.content" id="content" class="ue-left"></vue-ueditor-wrap>
            <!-- <div id="editor" name="editor" ></div>  postForm.content postForm.introduce readme notice-->
            <div class="ue-right">
              <div class="artincadmin">
                <h1 class="h1111" style="color:#ffffff;">预览</h1>
              </div>
              <div class="ue-html" id="ue-html" v-html="postForm.content"></div>
            </div>
          </div>
        </div>

        <div class="artice-reader">
          <el-form-item label-width="140px" label="是否展示测评介绍:" class="postInfo-container-item">
            <el-radio v-model="radioSponsor" label="0">否</el-radio>
            <el-radio v-model="radioSponsor" label="1">是</el-radio>
          </el-form-item>
        </div>
        <h2 class="h2" v-if="radioSponsor == '1'">测评介绍:</h2>
        <div class="textop" id="textop" style="margin-top:5px;" v-if="radioSponsor == '1'">
          <div class="UE">
            <vue-ueditor-wrap v-model="postForm.introduce" id="introduce" class="ue-left"></vue-ueditor-wrap>
            <!-- <div id="sponsor" name="sponsor" class="ue-left"></div> -->
            <div class="ue-right">
              <div class="artincadmin">
                <h1 class="h1111" style="color:#ffffff;">预览</h1>
              </div>
              <div class="ue-html" id="ue-html" v-html="postForm.introduce"></div>
            </div>
          </div>
        </div>

        <div class="artice-reader">
          <el-form-item label-width="140px" label="是否展示测评须知:" class="postInfo-container-item">
            <el-radio v-model="radioReadme" label="0">否</el-radio>
            <el-radio v-model="radioReadme" label="1">是</el-radio>
          </el-form-item>
        </div>
        <h2 class="h2" v-if="radioReadme == '1'">测评须知:</h2>
        <div class="textop" id="textop" style="margin-top:5px;" v-if="radioReadme == '1'">
          <div class="UE">
            <vue-ueditor-wrap v-model="readme" id="readme" class="ue-left"></vue-ueditor-wrap>
            <!-- <div id="readme" name="readme" class="ue-left"></div> -->
            <div class="ue-right">
              <div class="artincadmin">
                <h1 class="h1111" style="color:#ffffff;">预览</h1>
              </div>
              <div class="ue-html" id="ue-html" v-html="readme"></div>
            </div>
          </div>
        </div>

        <div class="artice-reader">
          <el-form-item label-width="140px" label="是否展示测前提示:" class="postInfo-container-item">
            <el-radio v-model="radioTextop" label="0">否</el-radio>
            <el-radio v-model="radioTextop" label="1">是</el-radio>
          </el-form-item>
        </div>
        <h2 class="h2" v-if="radioTextop == '1'">测前提示:</h2>
        <div class="textop" id="textop" style="margin-top:5px;" v-if="radioTextop == '1'">
          <div class="UE">
            <vue-ueditor-wrap v-model="notice" id="notice" class="ue-left"></vue-ueditor-wrap>
            <!-- <div id="notice" name="notice" class="ue-left"></div> -->
            <div class="ue-right">
              <div class="artincadmin">
                <h1 class="h1111" style="color:#ffffff;">预览</h1>
              </div>
              <div class="ue-html" id="ue-html" v-html="notice"></div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="buttont">
      <el-button
        :loading="btnloading"
        style="margin-left: 10px;"
        type="success"
        @click="submitForm(postForm)"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import ImgCutter from "@/components/ImgCutter";
import Upload from "@/components/Upload/SingleImage3";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL, isNumber, isIntNum } from "@/utils/validate";
// import { quillEditor } from "vue-quill-editor";
// import { fetchArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'

import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  subhead: "", //副标题
  content: "", // 文章首页
  introduce: "", // 文章摘要
  pic_addr: "", // 文章图片
  original_prace: "", //原有价格
  current_prace: "", //现有价格，
  question_num: "", //问题数量
  report_page_num: "", //报告页数
  base_use_num: "", //基础使用人数，
  test_time: "", //测试时间
  id: undefined,
  platforms: ["a-platform"],
  comment_disabled: false,
  importance: 0
};

export default {
  name: "ArticleDetail",
  components: {
    VueUeditorWrap,
    MDinput,
    Upload,
    Sticky,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
    ImgCutter
  },

  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    appraisalId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      questionType: "",
      questionTypeList: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "树形"
        }
      ],
      payStage: "",
      payStageList: [
        {
          value: "1",
          label: "测试前"
        },
        {
          value: "2",
          label: "测试后"
        }
      ],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      tempRoute: {},
      editorOption: {},
      readmeOption: {},
      noticeOption: {},
      need_pay: "0",
      divisive_sex: "0",
      type_name: "",
      typenameList: [],
      imageUrl: "",
      uploadUrl: "",
      uploadimgUrl: "",
      dataImageUrl: "",
      getInfo: "",
      articId: "",
      radio: "1",
      needparyst: "",
      Formcurrent: "",
      radioCenter: "",
      readme: "",
      notice: "",
      ifshow: false,
      btnloading: false,
      dataUeditor: {},
      radioSponsor: "1",
      radioReadme: "1",
      radioTextop: "1",
      editor: {},
      valliOne: "1:1",
      imgSrc: null,
      villTwo: "1.7:1",
      imgSrc2: null,
      localInfo:{},
      isbaocun:false,
    };
  },
  watch: {
    title(newValue, oldValue) {
      this.localInfo.title =newValue;
    },
    subhead(newValue, oldValue) {
      this.localInfo.subhead =newValue;
    },
    original_prace(newValue, oldValue) {
      this.localInfo.original_prace =newValue;
    },
    current_prace(newValue, oldValue) {
      this.localInfo.current_prace =newValue;
    },
    report_page_num(newValue, oldValue) {
      this.localInfo.report_page_num =newValue;
    },
    base_use_num(newValue, oldValue) {
      this.localInfo.base_use_num =newValue;
    },
    question_num(newValue, oldValue) {
      this.localInfo.question_num =newValue;
    },
    test_time(newValue, oldValue) {
      this.localInfo.test_time =newValue;
    },
    content(newValue, oldValue) {
      this.localInfo.content =newValue;
    },
    introduce(newValue, oldValue) {
      this.localInfo.introduce =newValue;
    },
    need_pay(newValue, oldValue) {
      this.localInfo.need_pay =newValue;
    },
    type_name(newValue, oldValue) {
      this.localInfo.type_name =newValue;
    },
    imageUrl(newValue, oldValue) {
      this.localInfo.imageUrl =newValue;
    },
    dataImageUrl(newValue, oldValue) {
      this.localInfo.dataImageUrl =newValue;
    },
    divisive_sex(newValue, oldValue) {
      this.localInfo.divisive_sex =newValue;
    },
    questionType(newValue, oldValue) {
      this.localInfo.questionType =newValue;
    },
    payStage(newValue, oldValue) {
      this.localInfo.payStage =newValue;
    },
    radio(newValue, oldValue) {
      this.localInfo.radio =newValue;
    },
    radioSponsor(newValue, oldValue) {
      this.localInfo.radioSponsor =newValue;
    },
    radioReadme(newValue, oldValue) {
      this.localInfo.radioReadme =newValue;
    },
    radioTextop(newValue, oldValue) {
      this.localInfo.radioTextop =newValue;
    },
    readme(newValue, oldValue) {
      this.localInfo.readme =newValue;
    },
    notice(newValue, oldValue) {
      this.localInfo.notice =newValue;
    }
  },

  computed: {
    title() {
      return this.postForm.title;
    },
    subhead() {
      return this.postForm.subhead;
    },
    original_prace() {
      return this.postForm.original_prace;
    },
    current_prace() {
      return this.postForm.current_prace;
    },
    report_page_num() {
      return this.postForm.report_page_num;
    },
    base_use_num() {
      return this.postForm.base_use_num;
    },
    question_num() {
      return this.postForm.question_num;
    },
    test_time() {
      return this.postForm.test_time;
    },
    content() {
      return this.postForm.content;
    },
    introduce() {
      return this.postForm.introduce;
    },

    contentShortLength() {
      return this.postForm.introduce.length;
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
    this.tempRoute = Object.assign({}, this.$route);
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.uploadimgUrl = this.$uploadUrl;
  },
  mounted() {
    this.typeList();
    if (this.appraisalId != "" || this.appraisalId != 0) {
      this.handInit();
    }else{
      this.localInfoList()
    }
  },
  methods: {
    // base64转成原文件
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },

    cutDown: function(res) {
      var files = this.dataURLtoFile(res.dataURL);
      let form = new FormData();
      form.append("file", files);
      let xhr = new XMLHttpRequest();
      xhr.open("post", this.uploadUrl, true);
      xhr.timeout = 30 * 1000;
      xhr.upload.onprogress = this.progress;
      xhr.onload = this.uploadComplete;
      xhr.onerror = this.uploadFailed;
      xhr.upload.onloadstart = () => {
        let date = new Date().getTime();
        let initSize = 0;
      };
      xhr.send(form);
    },
    // 上传成功
    uploadComplete: function(evt) {
      var data = JSON.parse(evt.target.responseText);
      this.imageUrl = data.datas;
    },
    uploadFailed() {
      this.$message.error("图片保存失败！");
    },
    cutDownTwo: function(res) {
      var files = this.dataURLtoFile(res.dataURL);
      let form = new FormData();
      form.append("file", files);
      let xhr = new XMLHttpRequest();
      xhr.open("post", this.uploadUrl, true);
      xhr.timeout = 30 * 1000;
      xhr.upload.onprogress = this.progress;
      xhr.onload = this.uploadCd;
      xhr.onerror = this.uploadCf;
      xhr.upload.onloadstart = () => {
        let date = new Date().getTime();
        let initSize = 0;
      };
      xhr.send(form);
    },
    // 上传成功
    uploadCd: function(evt) {
      var data = JSON.parse(evt.target.responseText);
      this.dataImageUrl = data.datas;
    },
    uploadCf() {
      this.$message.error("图片保存失败！");
    }, 
    localInfoList(){
      var getInfo = JSON.parse(localStorage.getItem("localInfo"));
            if (getInfo.content != "" ||  getInfo.content != null) {
              this.radio = "1";
            }else{
              console.log(1)
            }
            
            this.postForm.title = getInfo.title;
            this.postForm.subhead = getInfo.subhead;
            this.postForm.original_prace = getInfo.original_prace;
            this.postForm.current_prace = getInfo.current_prace;
            this.postForm.report_page_num = getInfo.report_page_num;
            this.postForm.base_use_num = getInfo.base_use_num;
            this.postForm.question_num = getInfo.question_num;
            this.postForm.test_time = getInfo.test_time;
            this.need_pay = getInfo.need_pay;
            this.type_name = getInfo.type_name;
            this.readme = getInfo.readme;
            this.notice = getInfo.notice;
            this.imageUrl = getInfo.imageUrl;
            this.dataImageUrl = getInfo.dataImageUrl;
            this.divisive_sex = getInfo.divisive_sex;
            this.postForm.content = getInfo.content;
            this.postForm.introduce = getInfo.introduce;
            this.questionType = getInfo.questionType;
            this.payStage = getInfo.payStage;

            if (this.postForm.content == "") {
              this.radio = "0";
            }
            if (this.postForm.introduce == "") {
              this.radioSponsor = "0";
            }
            if (this.readme == "") {
              this.radioReadme = "0";
            }
            if (this.notice == "") {
              this.radioTextop = "0";
            }
    },
    // 查询
    handInit() {
      var params = new URLSearchParams();
      params.append("appraisalId", this.appraisalId);
      this.$axios.post("/api/backstage/appraisal/getInfo", params).then(
        res => {
          if (res.data.code == "200") {
            var getInfo = res.data.datas;
            if (getInfo.content != "") {
              this.radio = "1";
            }
            var time = getInfo.testTime;
            var str = time.replace("分钟", "");
            this.postForm.title = getInfo.title;
            this.postForm.subhead = getInfo.subhead;
            this.postForm.original_prace = getInfo.originalPrace;
            this.postForm.current_prace = getInfo.currentPrace;
            this.postForm.report_page_num = getInfo.reportPageNum;
            this.postForm.base_use_num = getInfo.baseUseNum;
            this.postForm.question_num = getInfo.questionNum;
            this.postForm.test_time = str;
            this.need_pay = getInfo.needPay;
            this.type_name = getInfo.typeId;
            this.readme = getInfo.readme;
            this.notice = getInfo.notice;
            this.imageUrl = getInfo.picAddr;
            this.dataImageUrl = getInfo.detailAddr;
            this.divisive_sex = getInfo.divisiveSex;
            this.postForm.content = getInfo.content;
            this.postForm.introduce = getInfo.introduce;
            this.questionType = getInfo.questionType;
            this.payStage = getInfo.payStage;

            if (this.postForm.content == "") {
              this.radio = "0";
            }
            if (this.postForm.introduce == "") {
              this.radioSponsor = "0";
            }
            if (this.readme == "") {
              this.radioReadme = "0";
            }
            if (this.notice == "") {
              this.radioTextop = "0";
            }
          }
        },
        err => {}
      );
    },

    handleImageSuccess(res, file) {
      this.imageUrl = res.datas;
    },
    dataLeImageSuccess(res, file) {
      this.dataImageUrl = res.datas;
    },
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data;

          // just for test
          this.postForm.title += `   Article Id:${this.postForm.id}`;
          this.postForm.introduce += `   Article Id:${this.postForm.id}`;

          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch(err => {});
    },
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title} - ${this.postForm.id}`;
    },
    // 点击下一步
    submitForm(local) {
      var reg = /^(0|[1-9]\d*)$/;
      if (this.postForm.title == "") {
        this.$message({
          message: "请填写标题",
          type: "warning"
        });
        return;
      }
      if (this.postForm.subhead == "") {
        this.$message({
          message: "请填写副标题",
          type: "warning"
        });
        return;
      }
      if (
        this.postForm.report_page_num == "" ||
        !isIntNum(this.postForm.report_page_num)
      ) {
        this.$message({
          message: "报告页数不能为空并且为正整数！",
          type: "warning"
        });
        return;
      }
      if (this.questionType == undefined || this.questionType == "") {
        this.$message({
          message: "请选择题目类型",
          type: "warning"
        });
        return;
      }
      if (this.need_pay == "1") {
        if (this.payStage == undefined || this.payStage == "") {
          this.$message({
            message: "请选择付费阶段",
            type: "warning"
          });
          return;
        }
      }
      if (
        this.postForm.base_use_num == "" ||
        !isIntNum(this.postForm.base_use_num)
      ) {
        this.$message({
          message: "使用人数不能为空并且正整数！",
          type: "warning"
        });
        return;
      }

      var regExp = /^[0-9-]{1,8}$/; //    \u4e00-\u9fa5 是中文字符的unicode编码
      if (!regExp.test(this.postForm.test_time)) {
        this.$message({
          message: "只能输入数字，若是范围请用'-'号隔开！",
          type: "warning"
        });
        return;
      }

      if (
        this.postForm.question_num == "" ||
        !isIntNum(this.postForm.question_num)
      ) {
        this.$message({
          message: "问题数量不能为空并且正整数！",
          type: "warning"
        });
        return;
      }

      if (
        (this.need_pay == "1" && this.postForm.original_prace == "") ||
        (this.need_pay == "1" && this.postForm.current_prace == "")
      ) {
        this.$message({
          message: "原价与现价不能为空！",
          type: "warning"
        });
        return;
      }
      if (
        this.need_pay == "1" &&
        Number(parseFloat(this.postForm.current_prace).toFixed(2)) <= 0
      ) {
        this.$message({
          message: "现价格必须大于0！",
          type: "warning"
        });
        return;
      }
      if (
        (this.need_pay == "1" &&
          !parseFloat(reg.test(this.postForm.original_prace)).toFixed(2)) ||
        (this.need_pay == "1" &&
          !parseFloat(reg.test(this.postForm.current_prace)).toFixed(2))
      ) {
        this.$message({
          message: "价格应该为数字！",
          type: "warning"
        });
        return;
      }
      if (this.imageUrl == "") {
        this.$message({
          message: "请上传封面图片",
          type: "warning"
        });
        return;
      }
      if (this.dataImageUrl == "") {
        this.$message({
          message: "请上传详情图片",
          type: "warning"
        });
        return;
      }
      if (this.radio == "1" && this.postForm.content == "") {
        this.$message({
          message: "首页内容不能为空",
          type: "warning"
        });
        return;
      }
      if (this.radioSponsor == "1" && this.postForm.introduce == "") {
        this.$message({
          message: "测评介绍不能为空",
          type: "warning"
        });
        return;
      }
      if (this.radioReadme == "1" && this.readme == "") {
        this.$message({
          message: "测评须知不能为空",
          type: "warning"
        });
        return;
      }
      if (this.radioTextop == "1" && this.notice == "") {
        this.$message({
          message: "测前提示不能为空",
          type: "warning"
        });
        return;
      }
      if (this.radio == "0") {
        this.postForm.content == "";
      }
      if (this.radioSponsor == "0") {
        this.postForm.introduce == "";
      }
      if (this.radioReadme == "0") {
        this.readme == "";
      }
      if (this.radioTextop == "0") {
        this.notice == "";
      }
      // if (this.radio == "1" && this.readme == "") {
      //   this.$message({
      //     message: "用户须知不能为空",
      //     type: "warning"
      //   });
      //   return;
      // }
      // if (this.notice == "1" && this.notice == "") {
      //   this.$message({
      //     message: "测前提示不能为空",
      //     type: "warning"
      //   });
      //   return;
      // }
      if (this.type_name == "") {
        this.$message({
          message: "请选择类型名称！",
          type: "warning"
        });
        return;
      }
      var typename = "";
      for (var k in this.typenameList) {
        if (this.type_name == this.typenameList[k].value) {
          typename = this.typenameList[k].label;
        }
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          var that = this;
          var params = new URLSearchParams();
          if (this.need_pay == "0") {
            this.needparyst = "0";
            this.Formcurrent = "0";
            this.payStage = "";
          } else {
            this.needparyst = this.postForm.original_prace;
            this.Formcurrent = this.postForm.current_prace;
          }
          if (this.radio == "0") {
            this.radioCenter = "";
          } else if (this.radio == "1") {
            this.radioCenter = this.aeditor;
          }
          var listInfo = {
            title: this.postForm.title,
            subhead: this.postForm.subhead,
            originalPrace: this.needparyst,
            currentPrace: this.Formcurrent,
            reportPageNum: this.postForm.report_page_num,
            baseUseNum: this.postForm.base_use_num,
            questionNum: this.postForm.question_num,
            testTime: this.postForm.test_time,
            needPay: this.need_pay,
            typeId: this.type_name,
            typeName: typename,
            picAddr: this.imageUrl,
            divisiveSex: this.divisive_sex,
            content: this.postForm.content,
            introduce: this.postForm.introduce,
            readme: this.readme,
            notice: this.notice,
            detailAddr: this.dataImageUrl,
            questionType: this.questionType,
            payStage: this.payStage
          };
          sessionStorage.setItem(
            "questiontype",
            JSON.stringify({
              questionType: this.questionType,
              ayStage: this.payStage
            })
          );
        
          this.btnloading = true;
          if (this.appraisalId == "" || this.appraisalId == 0) {
            // 新增
            params.append("param", JSON.stringify(listInfo));
            this.$axios.post("/api/backstage/appraisal/addInfo", params).then(
              res => {
                if (res.data.code == "200") {
                  localStorage.removeItem("localInfo")
                  this.isbaocun = true;
                  this.articId = res.data.datas.id;
                  this.$message({
                    message: "新增成功！",
                    type: "success"
                  });
                  this.btnloading = false;
                  var str = {
                    Id: "2",
                    divisiveSex: this.divisive_sex,
                    appraisalId: this.articId,
                    isstate: true
                  };
                  this.$emit("appRas", str);
                  this.postForm.status = "published";
                } else {
                  this.btnloading = false;
                  this.$message.error("新增失败！");
                }
              },
              err => {}
            );
          } else {
            //修改
            listInfo.id = this.appraisalId;
            params.append("param", JSON.stringify(listInfo));
            this.$axios
              .post("/api/backstage/appraisal/updateInfo", params)
              .then(
                res => {
                  if (res.data.code == "200") {
                    localStorage.removeItem("localInfo")
                    this.isbaocun = true;
                    this.articId = res.data.datas.id;
                    this.$message({
                      message: "修改成功！",
                      type: "success"
                    });
                    this.btnloading = false;
                    var str = {
                      divisiveSex: this.divisive_sex,
                      Id: "2",
                      appraisalId: this.articId
                    };
                    this.$emit("appRas", str);

                    this.postForm.status = "published";
                  } else {
                    this.btnloading = false;
                    this.$message.error("修改失败！");
                  }
                },
                err => {}
              );
          }
        } else {
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000
      });
      this.postForm.status = "draft";
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return;
        this.userListOptions = response.data.items.map(v => v.name);
      });
    },
    // 获取类型列表
    typeList() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/api/backstage/appraisal/getType").then(
        res => {
          var arr = res.data.datas;
          var array = [];
          for (var i in arr) {
            var str = {};
            str.value = arr[i].id;
            str.label = arr[i].name;
            array.push(str);
          }
          that.typenameList = array;
        },
        err => {}
      );
    },
    open() {
        this.$confirm('测评信息页面有未保存内容，是否保存草稿?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          localStorage.setItem("localInfo",JSON.stringify(this.localInfo));
          this.localInfo = {};
          this.$message({
            type: 'success',
            message: '保存草稿成功!'
          });
        }).catch(() => {
          this.localInfo = {};
          localStorage.removeItem("localInfo")
          this.$message({
            type: 'info',
            message: '取消保存草稿！'
          });
        });
      }
  },
  beforeDestroy() {
    let objArr = Object.keys(this.localInfo)
    if(this.isbaocun == false && objArr.length != 0 && (this.appraisalId == "" || this.appraisalId == 0)){
      this.open()
    }
  }
};
</script>

<style>
.ql-editor {
  min-height: 150px !important;
}
#ue-html p img {
  max-width: 100% !important;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
// td,th{ border:1px solid #DDD; }
.artice-img {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.artice-reader {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#textop > .quill-editor > .ql-container > {
  min-height: 100px !important;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 0px 20px 0px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.postInfo-rido {
  // display: flex;
  // width: 100%;
  // height: 100%;
  // align-items: center;
}
.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.buttont {
  width: 20%;
  margin: 0 auto;
  margin-bottom: 10px;
  text-align: center;
}
.h2 {
  font-size: 14px;
  color: #606266;
  padding: 10px 0;
}
.imgporrer {
  width: 100%;
  // display: flex;
  // align-items: center;
}
.stylecaijian {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 20px;
}
.stylecaijianTwo {
  width: 340px;
  height: 200px;
  margin: 0 auto;
  margin-top: 20px;
}
.vuecropper {
  width: 300px;
  height: 200px;
  margin-left: 20px;
  border: 1px solid #cccccc;
}
.show-preview {
  width: 375px;
  height: 280px;
  overflow: hidden;
}
.radfrom > .el-form-item__content {
  line-height: 0px !important;
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
  // padding: 10px;
}
.ue-html p {
  width: 100%;
}
#ue-html p img {
  max-width: 100% !important;
}
.artincadmin {
  width: 100%;
  height: 30px;
  color: #ffffff;
  background: #000000;
  // border-radius: 5px;
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
  padding: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
  border: 1px solid #cacaca;
  // border-radius: 5px;
  background: #f9f9f9;
}
</style>
