<template>
  <el-dialog
    ref="dialog"
    :title="dialogTitle"
    :visible.sync="visible"
    :append-to-body="true"
    :custom-class="customClass"
    v-bind="dialogAttrs"
    @close="resetFields"
  >

    <div v-if="formConf.fields && formConf.fields.length > 0" class="form-container">
      <form-render :key="formKey" :form-conf="formConf" @submit="confirm" @reset="resetFields" />
    </div>

    <!-- <div v-show="hasFooter" slot="footer">
      <el-button :size="buttonSize" @click="visible = false">取 消</el-button>
      <el-button :size="buttonSize" @click="resetFields">重 置</el-button>
      <el-button
        type="primary"
        :loading="buttonLoading"
        :size="buttonSize"
        @click="confirm"
      >确 定</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import FormRender from '@/components/FormGenerator/parser'
import { removeEmptyKeys } from '@/utils'

export default {
  components: {
    FormRender
  },
  props: {
    // 渲染key
    renderKey: {
      type: String,
      default: ''
    },
    // 按钮尺寸
    buttonSize: {
      type: String,
      default: 'small'
    },
    // 按钮尺寸
    dialogForm: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 对话框属性设置, 详情配置参考element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/dialog#attributes
     */
    dialogAttrs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      buttonData: {},
      dialogTitle: '',
      visible: false,
      dialogLoading: null,
      buttonLoading: false,
      slotData: null,
      formKey: +new Date(),
      formConf1: {
        'fields': [{
          '__config__': {
            'label': '单行文本1',
            'labelWidth': null,
            'showLabel': true,
            'changeTag': true,
            'tag': 'el-input',
            'tagIcon': 'input',
            'required': true,
            'layout': 'colFormItem',
            'span': 24,
            'document': 'https://element.eleme.cn/#/zh-CN/component/input',
            'regList': [],
            'formId': 112,
            'renderKey': 1675306901087
          },
          '__slot__': {
            'prepend': '',
            'append': ''
          },
          'placeholder': '请输入单行文本1',
          'style': {
            'width': '100%'
          },
          'clearable': true,
          '__vModel__': 'field112'
        }],
        'formRef': 'elForm',
        'formModel': 'formData',
        'size': 'small',
        'labelPosition': 'right',
        'labelWidth': 100,
        'formRules': 'rules',
        'span': 6,
        'gutter': 15,
        'disabled': false,
        'formBtns': true
      },
      formConf: {},
      formConfCopy: {
        'fields': [],
        'formRef': 'elForm',
        'formModel': 'formData',
        'size': 'small',
        'labelPosition': 'right',
        'labelWidth': 100,
        'formRules': 'rules',
        'span': 6,
        'gutter': 15,
        'disabled': false,
        'loading': false,
        'formBtns': true
      }
    }
  },
  computed: {
    customClass() {
      return `xve-table-form-dialog-${this.renderKey}`
    },
    hasFooter() {
      return this.formConf.fields.length > 1
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
    /**
     * 显示dialog
     * @public
     */
    show(buttonData, dialogTitle) {
      this.buttonData = buttonData
      this.dialogTitle = dialogTitle
      this.visible = true
    },
    // 开启加载动画
    showDialogLoading() {
      this.$refs.dialog.$once('opened', async() => {
        this.loading = this.$loading({
          target: `body > .el-dialog__wrapper .${this.customClass} .el-dialog__body`
        })
      })
    },
    // 关闭加载动画
    closeDialogLoading() {
      // 以服务的方式调用的 Loading 需要异步关闭
      this.$nextTick(() => {
        this.loading.close()
      })
    },
    // 显示表单
    showForm(dialogFormData) {
      const formConfCopy = this._.cloneDeep(this.formConfCopy)
      const dialogForm = this._.cloneDeep(this.dialogForm)
      this.formKey = +new Date()
      formConfCopy.fields.unshift(...dialogForm)
      this.fillFormData(formConfCopy.fields, dialogFormData)

      // const formConf1 = this.formConf1
      // console.log('showForm', this._.cloneDeep(formConfCopy), this._.cloneDeep(this.formConf1))
      this.formConf = this._.cloneDeep(formConfCopy)
    },
    // 填充表单数据
    fillFormData(form, data) {
      if (data && !this._.isEmpty(data)) {
        form.forEach(item => {
          const val = data[item.__vModel__]
          if (val || val === 0 || val === '0') {
            item.__config__.defaultValue = val
          }
        })
      }
      return form
    },
    // 确认
    confirm(formData) {
      formData = removeEmptyKeys(formData)
      // console.log('confirm', formData)
      this.formConf.loading = true
      this.buttonLoading = true
      const done = (close = true) => {
        this.formConf.loading = false
        this.buttonLoading = false
        if (close) this.visible = false
      }
      this.$emit('onConfirm', this.buttonData, formData, done)
    },
    // 重置
    resetFields() {
      // this.$refs.form.resetFields()
      // this.slotData = null
      // console.log('resetFields')
    }
  }
}
</script>

<style></style>
