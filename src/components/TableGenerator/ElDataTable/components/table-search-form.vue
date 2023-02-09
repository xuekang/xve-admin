<template>
  <div v-if="formConf.fields.length > 0" class="form-container">
    <form-render :form-conf="formConf" @submit="submitSearchForm" @reset="resetSearchForm" />
  </div>
</template>
<script>

import FormRender from '@/components/FormGenerator/parser'
import { removeEmptyKeys } from '@/utils'

export default {
  components: {
    FormRender
  },
  props: {
    searchForm: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formConf: {
        'fields': [],
        __methods__: {
          search() {
            // console.log('search', this.formData, this.$refs.elForm)
            this.submitForm()
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
        'loading': false,
        'formBtns': false
      },
      formBtn: {
        '__config__': {
          'layout': 'rowFormItem',
          'tagIcon': 'row',
          'layoutTree': true,
          'document': 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes',
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
              'document': 'https://element.eleme.cn/#/zh-CN/component/button'
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
              'document': 'https://element.eleme.cn/#/zh-CN/component/button'
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
      }

    }
  },
  computed: {

  },
  watch: {
    searchForm() {
      this.formConf.fields = []
      this.formConf.fields.unshift(...this.searchForm, this.formBtn)
    }
  },
  created() {
    // this.formConf.fields = this.searchForm
  },
  mounted() {

  },
  methods: {
    submitSearchForm(formData) {
      // 过滤空值
      formData = removeEmptyKeys(formData)
      // console.log('表格查询数据：', formData)
      this.formConf.loading = true
      const done = () => {
        this.formConf.loading = false
      }
      this.$emit('search', formData, done)
    },
    resetSearchForm() {
      // console.log('表格查询数据重置')
      this.$emit('resetSearch')
    }
  }
}
</script>
