/************************** 填写表单 *****************
******************** author yuanyuan.xie *************
******************** createTime 2019.11.01 ***********/
<template> 
  <div style="margin-top: 100px">  
    <el-form ref="form" class="b-a" label-width="120px" >
      <transition-group class="form-list-group write-form" type="transition" :name="'flip-list'" tag="div">
        <renders v-for="(items, index) in form_list" :key="index" :ele="items.ele" :obj="items.obj"></renders>
      </transition-group>
      <el-form-item>
        <el-button @click="handleSubmit()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script> 
  import renders from "../../components/custom_form/Render";
  export default {
    name: "WriteForm",
    components: {
      renders
    },
    props: {
      form_list: {   //表单list
        type: Array, 
        required: true
      }
    },
    data () { 
      return { 
        loading:  false,  
      };
    },
    computed: {
       
    },
    created() {  
    },
    mounted() {   
    },
    methods: { 
      /**
       * 提交表单
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit() {
        if(this.form_list.length && this._noNameInvalid().length){
          this.$emit('saveCustomForm', this._noNameInvalid())
        }else{
          this.$message.info('请确认是否添加了组件，如若添加了组件请检查组件中是否每一个都没有添加name属性！')
        }
      },
      /**
       * 表单中没有name名字的自动给踢出，不保存
       * @return {[String]} [表单数组字符串]
       */
      _noNameInvalid(){ 
        return this.form_list.filter( item => {
          return item.obj.name ? true : false;
        }) 
      },
    }
  }
</script>
<style>
  .inline {
    display: inline-block;
  }

  .m-l-lg {
    margin-left: 30px
  }

  .wrapper {
    padding: 15px
  }

  .inline-block {
    display: inline-block;
  }

  .padder-sm {
    padding-right: 10px;
    padding-left: 10px
  }

  .b-a {
    border: 1px solid #ccc;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .form-list-group {
    min-height: 200px;
    padding: 20px !important;
  }

  /* 设置items下所有鼠标样式为 move */

  .draggable-form{
    .items,
    .items * {
      cursor: move !important;
    }
  }
  .operation-form{
    .items,
    .items * {
      cursor: pointer !important;
    }
  }


  /* 配置按钮默认位置 */

  /* 例如P Hr Title按钮 */

  .items .item-icon {
    transition: all 2s ease;
    position: absolute;
    top: -29px;
    right: 0px;
    opacity: 0;
    max-height: 0px;
    overflow: hidden;
  }

  /* form控件下配置按钮位置 */

  .ivu-form-item.items .item-icon {
    top: -15px;
  }

  /* 配置按钮样式 */

  .item-icon i {
    cursor: pointer !important;
    margin-right: 5px;
  }

  .items:hover .item-icon {
    transition: inherit;
    opacity: 1;
    max-height: 50px;
  }

  /* 提交按钮下方无 margin-bottom */

  .form_content .ivu-form-item:last-child {
    margin-bottom: 0;
  }


  /* 表单校验选项样式 */

  .ivu-form-item-required .ivu-form-item-label:before {
    content: '';
  }

  .items.sortable-items-required .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
</style>