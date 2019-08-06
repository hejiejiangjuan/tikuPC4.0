<template>
  <div class="UE">
    <!--这个地方的大小是可以自己控制的-->
    <div class="ue-left">
      <script :id="id" :name="id" type="text/plain"></script>
    </div>
    <!-- <div :id="id" :name="id" class="ue-left"></div> -->
    <div class="ue-right" v-html="Uecenter"></div>
  </div>
</template>

<script>
export default {
  name: "ue",
  props: {
    value: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    center: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editor: {},
      name: null,
      Uecenter: ""
    };
  },
  watch: {
    center: {
      handler(newValue, oldValue) {
        //父组件param对象改变会触发此函数
        this.Uecenter = newValue;
      },
      deep: true
    }
  },
  mounted() {
    
    // 实例化editor编辑器
    var that = this;
    
    that.editor = window.UE.getEditor(that.id);
    
    // UE.delEditor = function (id) {
    //     if (that.editor = instances[id]) {
    //         that.editor.key && editor.destroy();
    //         delete instances[id]
    //     }
    // }
    that.editor.ready(function() {
      window.UE.getEditor(that.id).setContent(that.Uecenter);
    });
     that.editor.addListener("contentChange keyup", function(editor) {
       that.Uecenter =  window.UE.getEditor(that.id).getContent();
    });
    that.editor.addListener("blur", function(editor) {
       that.Uecenter =  window.UE.getEditor(that.id).getContent();
       var str = {
         editor:'',
         sponsor:'',
          readme:'',
          notice:'',
       }
       if(that.id == "editor"){
         str.editor = window.UE.getEditor(that.id).getContent()
       }
       if(that.id == "sponsor"){
          str.sponsor = window.UE.getEditor(that.id).getContent()
       }
       if(that.id == "readme"){
          str.readme = window.UE.getEditor(that.id).getContent()
       }
       if(that.id == "notice"){
          str.notice = window.UE.getEditor(that.id).getContent()
       }
       that.$emit("ueditor", str);

       
      //相关操作
    });
      that.editor.render(that.id)

  },
  methods: {
    //获取编辑器中的内容
    getUEContent() {
      return this.editor.getContent();
    }
  },
  destroyed() {
    // 将editor进行销毁
    window.UE.getEditor(this.id).destroy();
  }
};
</script>

<style>
.UE {
  width: 100%;
  display: flex;
  align-items: center;
}
.ue-left {
  width: 40%;
  height: 100%;
}
.ue-right {
  width: 50%;
  height: 550px;
  padding: 5px 10px;
  overflow-x: hidden;
  /* background: red; */
  margin-left: 60px;
  border: 1px solid #000000;
}
.ue-right p{
  width: 100%;
}
.ue-right p img{
  max-width: 100%;
}
/* .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
#edui227 {
  width: 395px;r edui-default
} */
.el-form-item__content {
  line-height: 0px;
}
/* .ue-left  .edui-editor{
  width: 400px !important;
}
.ue-left  .edui-editor .edui-editor-iframeholder{
  width: 400px !important;
} */
</style>
