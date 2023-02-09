<template>
  <el-dialog
    ref="dialog"
    :title="dialogTitle"
    :visible.sync="visible"
    :modal-append-to-body="false"
    custom-class="xve-table-form-dialog"
    v-bind="dialogAttrs"
    @close="resetFields"
  >

    <div v-if="formConf.fields.length > 0" class="form-container">
      <form-render :form-conf="formConf" @submit="confirm" @reset="resetFields" />
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
    // title: {
    //   type: String,
    //   default: ''
    // },
    // /**
    //  * 表单弹框数据
    //  */
    // dialogForm: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    // dialogAttrs: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    buttonSize: {
      type: String,
      default: 'small'
    },
    /**
     * 点击事件的回调函数
     */
    callback: {
      type: Function,
      default: () => {}
    }

  },
  data() {
    return {
      buttonData: {},
      dialogTitle: '',
      dialogAttrs: {},
      visible: false,
      dialogLoading: null,
      buttonLoading: false,
      slotData: null,
      formConf: {
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
    hasFooter() {
      return this.formConf.fields.length > 1
    }
  },
  watch: {

  },
  methods: {
    /**
     * 显示dialog
     * @public
     */
    show(buttonData, dialogTitle, dialogAttrs) {
      this.buttonData = buttonData
      this.dialogTitle = dialogTitle
      this.dialogAttrs = dialogAttrs
      this.formConf.fields = []
      // $nextTick 有时也拿不到 form ，这样是稳妥的做法
      // this.$refs.dialog.$once('opened', () => {
      //   this.formConf.fields.unshift(...dialogForm)
      //   // this.$refs.form.updateForm(formValue)
      //   // this.slotData = formValue
      // })
      this.visible = true
    },
    showDialogLoading() {
      this.$refs.dialog.$once('opened', () => {
        this.loading = this.$loading({
          target: '.xve-table-form-dialog .el-dialog__body'
        })
      })
    },
    closeDialogLoading() {
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        this.loading.close()
      })
    },
    showForm(dialogForm, dialogFormData) {
      dialogForm = this.fillFormData(dialogForm, dialogFormData)
      console.log('showForm', dialogForm, dialogFormData)
      this.formConf.fields.unshift(...dialogForm)
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
