<!-- 列表 -->
<template>
  <!-- ActivitiForm -->
  <!-- <ActivitiForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :form_list="component_list" :sortable_item="sortable_item"></ActivitiForm> -->
  
  <!-- CustomForm：组件库数据为后台获取 -->
  <!-- <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :component_list="component_list" :type="'component'"></CustomForm> -->
  
  <!-- CustomForm：组件库数据为默认的，component_list需传空数组 -->
  <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :type="'form'" :component_list="[]"></CustomForm>

  <!-- <write-form @saveCustomForm="handleSubmit" :form_list="form_list"></write-form> -->
</template>
<script>
  import form_list from "../../components/custom_form/FormList";
  export default { 
    data () { 
      return {
        form_list,
        dataDict: [],
        component_list:[],
        sortable_item:[],
      }
    },
    computed: {
    },
    created() {  
    },
    mounted() { 
      this.queryMenu(false);
      this.getFormDictJson();
      this.getComponentsData(11);
    },
    methods: { 
      /**
       * 获组件库取配置
       */
      getComponentsData(menuId){ 
        this.formLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/find_by_option?id=${menuId}`).then((response) => {
          this.component_list = response.data.data ? JSON.parse(response.data.data.wf_config) : [];
          this.formLoading = false;
        }).catch((error) => {
          this.formLoading = false;
          this.$message.error(error);  
        });
      },
      getFormDictJson(){
        this.axios.post(`${this.common.basePath}/user/dictionary/type/json`,{}).then((response) => {
          this.dataDict = response.data.data.items;
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 选择菜单项
       * @author chuanlin.Xiao
       * @date   2019-10-23T15:54:19+0800
       * @param  {[type]}                 key     菜单项的id
       * @param  {[type]}                 keyPath [菜单的id，菜单项的id]
       * @return {[type]}                         [description]
       */
      handleSelect(key, keyPath) { 
        this.activeNav = key; 
      },
      /**
       * 查询菜单
       * @author chuanlin.Xiao
       * @date   2019-10-23T16:38:15+0800
       * @param  {Boolean}                isRefesh 是否用于刷新
       * @return {[type]}                          [description]
       */
      queryMenu(isRefesh){ 
        this.loading = true; 
        this.axios.post(`${this.common.baseProcessPath}/menu/find_menu`).then((response) => {
          if(response.data.data&&response.data.data.length>0){
            this.menuData = response.data.data;
            this.activeParentNav = response.data.data[0].id;
            this.openNav = [response.data.data[0].id+''];
            if(response.data.data[0].optionInfoVos.length>0){
              this.activeNav = response.data.data[0].optionInfoVos[0].id+''; 
            }else{
              this.activeNav = ''; 
           } 
          }
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 提交表单
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(formData) {
        let params = {
          "cur_status": 0,
          "option_id": this.activeNav,
          "wf_config": JSON.stringify(formData)
        } 
        this.loading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/create_field`, params).then((response) => {
          this.loading = false;
          this.$message.success(response.data.meta.message)
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);  
        });
      }, 
    }
  }
</script>
