import Vue from "vue"; 
import CustomForm from "../views/processSet/CustomForm.vue";
import WriteForm from "../views/processSet/WriteForm.vue";

const Components = { 
  CustomForm,
  WriteForm
};

Object.keys(Components).forEach(name => { 
  Vue.component(name, Components[name]);
});

export default Components;
