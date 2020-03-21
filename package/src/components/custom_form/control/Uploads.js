import uploadCustom from "../components/Uploads/upload.vue"
export default (_self, h) => {
  return [
    h(uploadCustom, {
      props: {
        multiple: _self.obj.multiple || false,
        type: 'drag', //支持拖拽
        action: _self.obj.action || "/imageupload",
        'max-size': _self.obj.maxSize || 2048,
        defaultList: _self.obj.value,
        name: _self.obj.filename,
        filetype:_self.obj.filetype,
        AccessKey:_self.obj.AccessKey,
        AccessToken:_self.obj.AccessToken,
      },
      on: {
        handleUploadsValue(arr) {
          if (!_self.obj.name) {
            return false;
          }
          _self.obj.value = arr;
          _self.$emit('handleChangeVal', arr)
        }
      }
    })
  ]
}


export const uploadsConf = {
  // 对应数据库内类型
  type: 'uploads',
  // 是否可配置
  config: true,
  // 上传地址
  action: '/file',
  // 是否必填
  require: true,
  // 控件左侧label内容
  label: '上传控件',
  // 上传文件最大限制
  maxSize: 2048,
  // 绑定的值
  value: [],
  // 表单name
  name: '',
  // 上传附件文件名称
  filename: 'files',
  // 上传附件的额外参数---文件类型名称
  filetype: 'processFiles',
  // Access-Key
  AccessKey: 'Access-Key',
  // Access-Token
  AccessToken: 'Access-Token',
  // 验证错误提示信息
  ruleError: '请上传文件',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true
}
