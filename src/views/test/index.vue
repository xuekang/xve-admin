<template>
  <div v-if="formConf.fields && formConf.fields.length > 0" class="form-container">
    <form-render :form-conf="formConf" @submit="sumbitForm" />
  </div>
</template>

<script>
import FormRender from '@/components/FormGenerator/parser'
import { getFormConf, getFormData } from '@/api/table-form-generator'
import { removeEmptyKeys } from '@/utils'

export default {
  components: {
    FormRender
  },
  props: {},
  data() {
    return {
      formConf1: {
        fields: [

        ],
        __methods__: {},
        submitFormDataUrl: '',
        getFormDataUrl: '',
        formRef: 'elForm',
        formModel: 'formData',
        size: 'small',
        labelPosition: 'right',
        labelWidth: 100,
        formRules: 'rules',
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: true,
        unFocusedComponentBorder: false
      },
      formConf: {},
      formConf11: {
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
          'placeholder': '请输入单行文本',
          'style': {
            'width': '100%'
          },
          'clearable': true,
          'prefix-icon': '',
          'suffix-icon': '',
          'maxlength': null,
          'show-word-limit': false,
          'readonly': false,
          'disabled': false,
          '__vModel__': 'field112'
        }, {
          '__config__': {
            'label': '单行文本2',
            'labelWidth': null,
            'showLabel': true,
            'changeTag': true,
            'tag': 'el-input',
            'tagIcon': 'input',
            'required': false,
            'layout': 'colFormItem',
            'span': 24,
            'document': 'https://element.eleme.cn/#/zh-CN/component/input',
            'regList': [],
            'formId': 113,
            'renderKey': 1675306903124
          },
          '__slot__': {
            'prepend': '',
            'append': ''
          },
          'placeholder': '请输入单行文本',
          'style': {
            'width': '100%'
          },
          'clearable': true,
          'prefix-icon': '',
          'suffix-icon': '',
          'maxlength': null,
          'show-word-limit': false,
          'readonly': false,
          'disabled': false,
          '__vModel__': 'field113'
        }, {
          '__config__': {
            'label': '单行文本3',
            'labelWidth': null,
            'showLabel': true,
            'changeTag': true,
            'tag': 'el-input',
            'tagIcon': 'input',
            'required': false,
            'layout': 'colFormItem',
            'span': 24,
            'document': 'https://element.eleme.cn/#/zh-CN/component/input',
            'regList': [],
            'formId': 114,
            'renderKey': 1675306924429
          },
          '__slot__': {
            'prepend': '',
            'append': ''
          },
          'placeholder': '请输入单行文本',
          'style': {
            'width': '100%'
          },
          'clearable': true,
          'prefix-icon': '',
          'suffix-icon': '',
          'maxlength': null,
          'show-word-limit': false,
          'readonly': false,
          'disabled': false,
          '__vModel__': 'field114'
        }, {
          '__config__': {
            'layout': 'rowFormItem',
            'tagIcon': 'row',
            'layoutTree': true,
            'document': 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes',
            'formId': 116,
            'renderKey': 1675306949481,
            'componentName': 'row116',
            'children': [{
              '__config__': {
                'label': '',
                'showLabel': false,
                'changeTag': true,
                'labelWidth': null,
                'tag': 'el-button',
                'tagIcon': 'button',
                'span': 6,
                'layout': 'colFormItem',
                'document': 'https://element.eleme.cn/#/zh-CN/component/button',
                'formId': 117,
                'renderKey': 1675306995097
              },
              '__slot__': {
                'default': '查询'
              },
              'on': {
                'click': 'search'
              },
              'type': 'primary',
              'icon': '',
              'round': false,
              'size': 'small',
              'plain': false,
              'circle': false,
              'disabled': false,
              '__vModel__': 'search'
            }, {
              '__config__': {
                'label': '',
                'showLabel': false,
                'changeTag': true,
                'labelWidth': null,
                'tag': 'el-button',
                'tagIcon': 'button',
                'span': 6,
                'layout': 'colFormItem',
                'document': 'https://element.eleme.cn/#/zh-CN/component/button',
                'formId': 118,
                'renderKey': 1675307096816
              },
              '__slot__': {
                'default': '重置'
              },
              'on': {
                'click': 'resetSearch'
              },
              'type': '',
              'icon': '',
              'round': false,
              'size': 'small',
              'plain': true,
              'circle': false,
              'disabled': false,
              '__vModel__': 'resetSearch'
            }]
          },
          'span': 6,
          'gutter': 15,
          'type': 'flex',
          'justify': 'center',
          'align': 'top'
        }],
        __methods__: {
          search() {
            // console.log('search', this.formData, this.$refs.elForm)
            this.submitForm()
            // this.$refs[this.formConf.formRef].validate(valid => {
            //   if (!valid) return false
            //   // 触发sumit事件
            //   this.$emit('submit', this[this.formConf.formModel])
            //   return true
            // })
          },
          resetSearch() {
            // console.log('resetSearch', this.formData, this.$refs.elForm)
            this.resetForm()
          }
        },
        'formRef': 'elForm',
        'formModel': 'formData',
        'size': 'small',
        'labelPosition': 'right',
        'labelWidth': 100,
        'formRules': 'rules',
        'span': 6,
        'gutter': 15,
        'disabled': false,
        'formBtns': false
      },
      formConf22: {
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
          'placeholder': '请输入单行文本',
          'style': {
            'width': '100%'
          },
          'clearable': true,
          'prefix-icon': '',
          'suffix-icon': '',
          'maxlength': null,
          'show-word-limit': false,
          'readonly': false,
          'disabled': false,
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
      }

    }
  },
  computed: {},
  watch: {},
  created() {
    const myQuery = this.$route.query
    console.log('myQUery', myQuery, this)

    this.getFormConf()
    // console.log(JSON.stringify(this.formConf.fields[0].__config__.regList));
  },
  mounted() {

  },
  methods: {
    getFormConf() {
      getFormConf().then(res => {
        this.formConf = this._.cloneDeep(this.formConf22)
        console.log('表单配置', res.data)
        // this.formConf = { ...this.formConf, ...res.data }
      })
    },
    getFormData() {
      if (!this.formConf.getFormDataUrl) return true

      getFormData(this.formConf.getFormDataUrl, this.$route.query).then(res => {
        console.log('表单数据:', res.data)
        this.fillFormData(this.formConf, res.data)
      })
    },
    fillFormData(form, data) {
      form.fields.forEach(item => {
        const val = data[item.__vModel__]
        if (val || val === 0 || val === '0') {
          item.__config__.defaultValue = val
        }
      })
    },
    sumbitForm(data) {
      // 过滤空值
      data = removeEmptyKeys(data)
      console.log('提交数据：', data)

      // if (!this.formConf.submitFormDataUrl) {
      //   this.$showErr('表单配置错误：无数据提交地址')

      //   return
      // }

      // submitFormData(this.formConf.submitFormDataUrl).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 20px;
}
</style>
