/************************** 自定义activiti表单 *****************
******************** author chuanlin.Xiao *************
******************** createTime 2019.12.20 ***********/
<template> 
  <div>  
    <el-row :gutter="20">   
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组件库</span> 
          </div>
          <el-form ref="form" class="b-a" label-width="120px">
            <draggable :clone="cloneData" :list="form_list" :options="dragelOptions1">
              <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
                <renders v-for="(items, index) in form_list" :key="index" :ele="items.ele" :obj="items.obj || {}"></renders>
              </transition-group>
            </draggable>
          </el-form>
        </el-card> 
      </el-col>
      <!-- 操作表单 -->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>表单</span> 
          </div>
          <el-form ref="form" :model="formData" class="b-a" label-width="150px" > 
            <el-alert
              title="未添加name属性无效"
              type="warning"
              :closable="false">
            </el-alert> 
              <draggable :list="sortable_item" :options="dragelOptions2" >
                <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div"> 
                  <renders @handleRemoveEle="removeEle" @handleConfEle="confEle" @changeVisibility="changeVisibility" v-for="(element,index) in sortable_item" :key="index" :index="index" :ele="element.ele" :obj="element.obj || {}" :data="formData" @handleChangeVal="val => handleChangeVal(val,element)" :sortableItem="sortable_item" :config-icon="true">
                  </renders> 
                </transition-group>
              </draggable> 
            <el-form-item>
                <el-button @click="handleSubmit()">保存</el-button>
              </el-form-item>
          </el-form>
        </el-card> 
      </el-col>
    </el-row>
    <!-- 配置弹框 -->
    <el-dialog :title="'配置' + modalFormData.modalTitle + '属性'" :visible.sync="dialogVisible">
      <el-form class="form_content" label-width="120px" :model="modalFormData" ref="modalFormData">
        <el-form-item label="控件名称：" v-if="typeof modalFormData.label != 'undefined'">
          <el-input v-model="modalFormData.label" placeholder="请输入控件名称" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="数据字典：" v-if="dialogVisible"> 
          <el-select v-model="modalFormData.dict" filterable @change="handleDataDictChange">
            <!-- value绑定json字符串的原因是，需要用到parent_name，当handleDataDictChange触发，赋值到modalFormData -->
            <el-option v-for="item in dataDictList" :value="JSON.stringify({
              id: item.id, parent_name: item.parent_name})" :key="item.id" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="name属性：" 
          prop="name"  
          :rules="[{ validator: nameValidate, trigger: 'blur' }]"
          >
          <el-input v-model="modalFormData.name" @input="nameInput" placeholder=""></el-input>
        </el-form-item> 
        <!-- <el-form-item label="关联数据：" v-if="typeof modalFormData.relation != 'undefined'">
          //当绑定name并且当前relationList存在数据时候才可以关联字段
          <el-checkbox :disabled="!modalFormData.name || !relationList.length" v-model="modalFormData.relation">是否关联字段</el-checkbox>
        </el-form-item>
        <el-form-item label="关联配置：" v-if="typeof modalFormData.relation != 'undefined' && modalFormData.relation">
          <el-select v-model="modalFormData.relation_name" class="inline-block" style="width: 150px" @on-change="_=>modalFormData.relation_value = ''">
            <el-option :disabled="item.obj.name == modalFormData.name" v-for="(item,index) in relationList" :key="index" :value="item.obj.name">{{item.obj.label}}</el-option>
          </el-select>
          <p class="inline-block padder-sm">等于</p>
          <el-select v-model="modalFormData.relation_value" class="inline-block" style="width: 150px">
            <el-option v-for="(item,index) in relationValue" :key="index" :value="item.label_value">{{item.label_name}}</el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="placeholder：" v-if="typeof modalFormData.placeholder != 'undefined'">
          <el-input v-model="modalFormData.placeholder" placeholder="请输入placeholder"></el-input>
        </el-form-item>
        <el-form-item label="最大长度：" v-if="typeof modalFormData.maxLength != 'undefined'">
          <el-input-number v-model="modalFormData.maxLength" placeholder="请输入文本限制最大长度">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最大限制：" v-if="typeof modalFormData.maxSize != 'undefined'">
          <el-input-number :formatter="value => `${value}kb`" :parser="value => value.replace('kb', '')" v-model="modalFormData.maxSize" placeholder="请输入上传文件最大限制">
          </el-input-number>
        </el-form-item>
        <el-form-item label="上边距：" v-if="typeof modalFormData.marginTop != 'undefined'">
          <el-input-number :formatter="value => `${value}px`" :parser="value => value.replace('px', '')" v-model="modalFormData.marginTop" placeholder="请输入标签上边距">
          </el-input-number>
        </el-form-item>
        <el-form-item label="下边距：" v-if="typeof modalFormData.marginBottom != 'undefined'">
          <el-input-number :formatter="value => `${value}px`" :parser="value => value.replace('px', '')" v-model="modalFormData.marginBottom" placeholder="请输入标签下边距">
          </el-input-number>
        </el-form-item>
        <el-form-item label="详细地址：" v-if="typeof modalFormData.details_address != 'undefined'">
          <el-checkbox v-model="modalFormData.details_address">是否需要详细地址</el-checkbox>
        </el-form-item>
        <el-form-item label="是否必填：" v-if="typeof modalFormData.require != 'undefined'">
          <el-checkbox v-model="modalFormData.require">必填</el-checkbox>
        </el-form-item>
        <el-form-item label="校验错误：" v-if="typeof modalFormData.ruleError != 'undefined'">
          <el-input v-model="modalFormData.ruleError" placeholder="请输入校验错误提示"></el-input>
        </el-form-item>
        <el-form-item label="是否多选：" v-if="typeof modalFormData.multiple != 'undefined' && modalFormData.type != 'address'">
          <el-checkbox v-model="modalFormData.multiple">多选</el-checkbox>
        </el-form-item>
        <el-form-item label="时间格式：" v-if="typeof modalFormData.format != 'undefined'">
          <el-radio-group v-model="modalFormData.format">
            <el-radio label="yyyy年MM月dd日"></el-radio>
            <el-radio label="yyyy-MM-dd HH:mm"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行内元素：" v-if="typeof modalFormData.inlineBlock != 'undefined'">
          <el-checkbox v-model="modalFormData.inlineBlock">是</el-checkbox>
        </el-form-item>
        <el-form-item label="显示行数：" v-if="typeof modalFormData.maxRows != 'undefined'">
          <el-progress v-model="modalFormData.maxRows" :min="2" :max="10"></el-progress>
        </el-form-item>
        <el-form-item label="标题大小：" v-if="typeof modalFormData.level != 'undefined'">
          <el-input-number :max="6" :min="1" v-model="modalFormData.level"></el-input-number>
        </el-form-item>
        <el-form-item label="字体颜色：" v-if="typeof modalFormData.color != 'undefined'">
          <el-color-picker v-model="modalFormData.color" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="text" @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="modalFormData.loading" @click="handleOk('modalFormData')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import draggable from "vuedraggable";
  // import form_list from "../../components/custom_form/FormList";
  import renders from "../../components/custom_form/Render";
  export default {
    name: "ActivitiForm",
    components: {
      draggable,
      renders
    },
    props: {
      dataDict: {   //数据字典
        type: Array, 
        default: [],
        required: true
      },
      sortable_item: { //拖动后的表单列表
        type: Array,
        default: [],
      },
      form_list: { //拖动前的表单列表（组件库，由后台查询得到）
        type: Array,
        default: [],
      }
    },
    data () { 
      return { 
        loading:  false, 
        activeNav:'',// 被激活的菜单项 string类型
        activeParentNav:null,// 被激活的菜单项所属菜单，即被激活的菜单项的父级id number类型
        menuData: [],
        // form_list, //默认表单组件列表
        // sortable_item: [], //拖动后的表单列表
        formData: {},
        dialogVisible: false,
        // 深拷贝对象，防止默认空对象被更改
        // 颜色选择器bug，对象下color不更新    
        modalFormData: {
          color: '',
          loading: false
        },    
      };
    },
    computed: {
      // 数据字典已选择项
      dataDictSelected() {  
        return this.sortable_item.map(v => {
          const obj = JSON.parse(v.obj.dict || '{}');
          return obj.id || -1; //暂时隐藏掉这一条。目前先不要限制只能选择一次。
        })
      },
      // 对应控件的数据字典
      dataDictList() {  
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        return this.dataDict.filter(v => { 
          let bool = false;
          v.type.split(",").forEach((val) => {
            val == this.modalFormData.type ? bool = true : '';
          }) 
          return bool
          
        })
      },
      // 拖拽表单1
      dragelOptions1() { 
        return {
          animation: 0,
          ghostClass: "ghost",
          // 分组
          group: {
            name: "shared",
            pull: "clone",
            revertClone: false
          },
          // 禁止拖动排序
          sort: false
        };
      },
      // 拖拽表单2
      dragelOptions2() { 
        return {
          animation: 0,
          ghostClass: "ghost",
          group: {
            // 只允许放置shared的控件,禁止pull
            put: ["shared"]
          }
        };
      },
      // 被关联字段列表
      relationList() { 
        // 只有type内三项可作为被关联字段
        let type = ['select', 'radio', 'checkbox'];
        const arr = this.sortable_item.filter(k => {
          return type.indexOf(k.ele) >= 0 && !!k.obj.name;
        }) 
        return arr;
      },
      // 被关联字段数据
      relationValue() {
        const name = this.modalFormData.relation_name;
        let items = [];
        if (!name) return items;
        for (let i in this.sortable_item) {
          if (this.sortable_item[i].obj.name == name) {
            items = this.sortable_item[i].obj.items;
          }
        }
        return items;
      }
    },
    created() {  
    },
    mounted() {  
      // this.getFormDictJson();
    },
    methods: { 
      /**
       * name属性名字
       * @param  {[type]}   rule     [description]
       * @param  {[type]}   value    [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */ 
      nameValidate(rule, value, callback) {
        if(!this.nameInput(value)){
          callback(new Error('填写规范必须为驼峰命名'));
        }else{
          callback();
        } 
      },  
      /**
       * 提交表单
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit() {
        if(this.sortable_item.length && this._noNameInvalid().length){
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
        return this.sortable_item.filter( item => {
          return item.obj.name ? true : false;
        }) 
      },
      // https://github.com/SortableJS/Vue.Draggable#clone
      // 克隆,深拷贝对象
      cloneData(original) { 
        // 深拷贝对象，防止默认空对象被更改
        return JSON.parse(JSON.stringify(original));
      },
      // 控件回填数据
      handleChangeVal(val, element) {
        this.$set(this.formData, element.obj.name, val);
      },
      /**
       * modal点击取消执行事件，清空当前modal内容
       * @return {[type]}
       */
      handleCancel() {
        this.dialogVisible = false;
        setTimeout( () => {
          this.modalFormData = {
            color: '',
            loading: false
          };
        }, 500)
      },
      /**
       * modal点击确定执行事件
       * @param  {String} formName [编辑表单refName]
       * @return {[type]}          [description]
       */
      handleOk(formName) { 
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const index = this.modalFormData.listIndex;
            this.sortable_item[index].obj = Object.assign({},
              this.sortable_item[index].obj,
              this.modalFormData
            );
            this.handleCancel();
          } else { 
            return false;
          }
        });
        
      },
      // 显示modal,配置被克隆控件
      confEle(index) {   
        const list_temp = Object.assign({}, this.sortable_item[index]);
        for (let i in list_temp.obj) {
          this.modalFormData[i] = list_temp.obj[i];
        }
        // 配置项中未找到color，删除modalFormData中自带color属性
        if (!list_temp.obj['color']) delete this.modalFormData.color;
        // 设置被配置控件的index，便于完成配置找到相应对象赋值
        this.modalFormData.listIndex = index;
        // 添加一个modal标题
        this.modalFormData.modalTitle = list_temp.obj.label || "";
        // Vue 不能检测到对象属性的添加或删除
        this.modalFormData = Object.assign({}, this.modalFormData);
        this.dialogVisible = true;
      },
      // 删除克隆控件
      removeEle(index) {
        let name = this.sortable_item[index].obj.name;
        this.sortable_item.splice(index, 1);
        if (!name) return;
        for (let i in this.sortable_item) {
          // 当relation为true并且关联字段被确认
          if (this.sortable_item[i].obj.relation && this.sortable_item[i].obj.relation_name === name) {
            this.$set(this.sortable_item[i].obj, "relation", false);
            this.$set(this.sortable_item[i].obj, "relation_name", "");
            this.$set(this.sortable_item[i].obj, "relation_value", "");
            break;
          }
        }
      },
      // 更改当前渲染字段是否显示
      changeVisibility(index, visibility) {
        this.$set(this.sortable_item[index].obj, 'visibility', visibility);
      },
      // modal内数据字典选项发生改变触发事件
      handleDataDictChange(val) {  
        // 选中后，val默认赋值到modalFormData.dict
        const obj = JSON.parse(val);
        // 数据加载中，禁止modal_submit提交按钮
        this.$set(this.modalFormData, 'loading', true);
        this.modalFormData = Object.assign({}, this.modalFormData, {
          typeId: obj.id,
          loading: false, 
          parent_name: obj.parent_name
        }); 
        this.sortable_item[this.modalFormData.listIndex].obj = this.modalFormData;
      },
      /**
       * name属性验证，必须为驼峰命名
       * @return {[type]} [description]
       */
      nameInput(val){   
        let regu = "^[A-Za-z]+[0-9]*$" 
        var re = new RegExp(regu); 
        if (re.test(val)) {
          return true;
        }else{
          return false;
        }  
      }
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

  .items,
  .items * {
    cursor: move;
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