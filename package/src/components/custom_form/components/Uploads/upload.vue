<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :limit="10"
      :data="myFileData"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :name="name">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload> 
  </div>
</template>
<script>
export default {
  name: "uploadCustom",
  data() {
    return {
      headers:{},
      formData: {
        file_name: "",
        index: -1
      },
      imgName: "",
      visible: false,
      uploadList: [],
      resultList: [],
    };
  },
  computed:{
    myFileData(){
      return {type:this.filetype,userId:Number(sessionStorage.getItem(this.AccessKey)) || null};
    },
  },
  methods: {
    /**
     * 添加headers和认证、验证上传文件大小
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    beforeUpload(file) {

      let flag = false //false表示默认错误 匹配到了正确的格式后 改为true
      const isLtXM = file.size/1024 < this.maxSize;
      if (!isLtXM) { flag = false }else{ flag = true } 
      if (!flag) {
        this.$message.error(`上传文件大小不能超过 ${this.maxSize}KB!`);
        return false
      }

      try {
        console.log(sessionStorage.getItem(this.AccessToken).split(' ')[0])
        if(sessionStorage.getItem(this.AccessToken)) {
          sessionStorage.getItem(this.AccessToken).split(' ')[0].split('"')[1]=='Bearer'?this.headers['Authorization'] = JSON.parse(sessionStorage.getItem(this.AccessToken) || null):this.headers['Authorization'] = 'Bearer '+JSON.parse(sessionStorage.getItem(this.AccessToken) || null);
        }
      } catch(e) {
        this.$message.error("获取授权有误, 上传文件失败!")
        return false
      }

      this.headers['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
      this.headers['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
      this.headers['secret']     = "pom-product-client" // 口令
      this.headers['type']       = "PC"      // 口令
      let object = {
        'nonce':      this.headers.nonce,
        'Time-Stamp': this.headers['Time-Stamp'],
        'secret':     this.headers.secret,
        'Access-Key': this.headers['Access-Key'],
      }
      let array = []
      for ( let k in object ) {
        array.push(k)
      }
      array.sort()
      let FinalArray = [] //组合完成并排序后的数组
      array.forEach( (item, index) => {
        FinalArray.push(object[item])
      })
      this.headers['sign'] = window.md5Js(FinalArray.join(""))// 写入sign
    },
    /**
     * 限制文件上传个数
     * @param  {[type]} files    [description]
     * @param  {[type]} fileList [description]
     * @return {[type]}          [description]
     */
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传10个文件！`);
    },
    /**
     * 移除文件
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // 更新uploadList
      // this.uploadList = this.$refs.upload.fileList;
      
      let arr = [];
      fileList.forEach( function(element, index) {
        let file = element.response.data[0]
        arr.push({name:file.fileName,id:file.fileId,path:file.path})
      });
      this.resultList = arr;

      this.$emit('handleUploadsValue', this.resultList);
    },
    /**
     * 上传文件成功
     * @param  {[type]} res      [description]
     * @param  {[type]} file     [description]
     * @param  {[type]} fileList [description]
     * @return {[type]}          [description]
     */
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      // 更新uploadList
      // this.uploadList = this.$refs.upload.fileList;
      
      if(response&&response.meta.code == 0) {
        if(response.data) {
          let file = response.data[0]
          this.resultList.push({name:file.fileName,id:file.fileId,path:file.path})
        }
      } else {
        this.$message.error(response.meta.message)
      }

      this.$emit('handleUploadsValue', this.resultList);
    },

    handleChangeAlias() {
      this.uploadList[this.formData.index]['file_name'] = this.formData.file_name;
      this.uploadList[this.formData.index]['visible'] = false;
      this.$emit('handleUploadsValue', this.uploadList);
      this.formData = {
        file_name: "",
        index: -1
      };
    },
    handleAlias(item, index) {
      // 有上传操作未完成的
      if (this.formData.index != -1) {
        this.$set(this.uploadList[this.formData.index], 'visible', false);
      }
      this.formData = Object.assign({}, this.formData, {
        file_name: item.file_name || "",
        index,
      });
      this.$set(this.uploadList[index], 'visible', true);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件：" +
          file.name +
          "格式不正确, 请选择 jpg/png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出最大限制",
        desc: "文件：" + file.name + "超出设定最大限制" + this.maxSize + "kb"
      });
    },
    handleBeforeUpload() {
      // 更新uploadList
      this.uploadList = this.$refs.upload.fileList;
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "一次最多选择五个文件进行上传."
        });
      }
      return check;
    }
  },
  mounted() { 
    
  },
  props: {
    defaultList: { //默认
      type: Array,
      default () {
        return [];
      }
    },
    maxSize: { //文件大小
      type: Number,
      default: 2048
    },
    action: { //提交地址
      type: String,
      default: ''
    },
    type: { //支持拖拽
      type: String,
      default: 'select'
    },
    name: { //上传附件的属性名字
      type: String,
      default: 'files'
    },
    filename: { //上传附件的文件名称
      type: String,
      default: 'files'
    },
    filetype: { //上传附件的额外参数---文件类型名称
      type: String,
      default: 'processFiles'
    },
    multiple: { //是否可以多附件
      type: Boolean,
      default: false
    },
    AccessKey: { //Access-Key
      type: String,
      default: 'Access-Key'
    },
    AccessToken: { //Access-Token
      type: String,
      default: 'Access-Token'
    },
  }
};

</script>
<style>
.demo-upload-list {
  margin-top: 15px;
  display: block;
  line-height: 20px;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-right: 4px;
}

.demo-upload-list .ivu-progress-bg {
  height: 5px !important;
}

.demo-upload-list input {
  padding-top: 0;
  padding-bottom: 0;
  border: 0;
  outline: 0;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  line-height: 19px;
  height: 18px;
}

.demo-upload-list input:focus {
  box-shadow: inherit;
}

.alias-btn {
  margin-right: 10px
}

</style>
