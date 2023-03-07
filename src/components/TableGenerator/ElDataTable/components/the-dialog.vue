<template>
  <el-dialog
    ref="dialog"
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    :modal-append-to-body="false"
    :append-to-body="true"
    :lock-scroll="false"
    :custom-class="customClass"
    v-on="$listeners"
    @open="onOpen"
    @close="onClose"
  >
    <div v-if="hasForm" class="form-container">
      <form-render
        :key="formKey"
        ref="formRender"
        :form-conf="formConf"
        @submit="onConfirmForm"
        @reset="onResetForm"
      />
    </div>

    <div v-show="hasForm" slot="footer">
      <el-button :size="buttonSize" @click="handleReset">重 置</el-button>
      <el-button
        type="primary"
        :loading="buttonLoading"
        :size="buttonSize"
        @click="handleConfirm"
        >确 定</el-button
      >
    </div>
    <el-image
      ref="previwImage"
      style="display: none;"
      :src="previewUrl"
      :preview-src-list="previewList"
    >
    </el-image>
  </el-dialog>
</template>

<script>
import FormRender from '@/components/FormGenerator/parser'
import { removeEmptyKeys, isFalse } from '@/utils'
const units = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}
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
    //弹框表单属性
    defaultFormConf: {
      type: Object,
      default() {
        return {}
      }
    },
    // 表单字段数据
    dialogFormFields: {
      type: Array,
      default() {
        return []
      }
    }
  },
  inject: ['onConfirm'],
  data() {
    return {
      buttonData: {},
      buttonLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogLoading: null,
      previewUrl: '',
      previewList: [],
      slotData: null,
      formKey: +new Date(),
      formConf: {}
    }
  },
  computed: {
    customClass() {
      return `xve-table-form-dialog-${this.renderKey}`
    },
    hasForm() {
      return (
        this.formConf && this.formConf.fields && this.formConf.fields.length > 0
      )
    }
  },
  watch: {},
  created() {},
  methods: {
    /**
     * 显示dialog
     * @public
     */
    show(buttonData, dialogTitle) {
      this.buttonData = buttonData
      this.dialogTitle = dialogTitle
      this.dialogVisible = true
    },
    // 开启加载动画
    showDialogLoading() {
      this.$refs.dialog.$once('opened', async () => {
        this.dialogLoading = this.$loading({
          target: `body > .el-dialog__wrapper .${this.customClass} .el-dialog__body`
        })
      })
    },
    // 关闭加载动画
    closeDialogLoading() {
      // 以服务的方式调用的 Loading 需要异步关闭
      this.$nextTick(() => {
        this.dialogLoading.close()
      })
    },
    // 显示表单
    showForm(dialogFormData) {
      const defaultFormConf = this._.cloneDeep(this.defaultFormConf)
      const dialogFormFields = this._.cloneDeep(this.dialogFormFields)
      this.formKey = +new Date()
      defaultFormConf.fields.unshift(...dialogFormFields)
      this.fillFormData(
        defaultFormConf.fields,
        defaultFormConf,
        dialogFormData,
        this
      )

      this.formConf = this._.cloneDeep(defaultFormConf)
    },
    //回填表单
    fillFormData(fields, formConf, formData, that) {
      const { formModel, formRef } = formConf
      fields.forEach((item, i) => {
        const vModel = item.__vModel__
        const val = formData[vModel]

        // 设置各表单项的默认值（回填表单）
        //el-upload
        this.handleUploadItem(item, vModel, val, formModel, that)
        //常规表单
        if (val || val === 0 || val === '0') {
          item.__config__.defaultValue = val
        }

        if (Array.isArray(item.__config__.children)) {
          this.fillFormData(item.__config__.children, formConf, formData, that)
        }
      })
    },
    //处理upload
    handleUploadItem(item, vModel, val, formModel, that) {
      // 特殊处理el-upload，包括 回显图片，on-success等各种回调函数
      if (item.__config__.tag === 'el-upload') {
        // 回显图片
        item['file-list'] = (val || []).map(fileItem => ({
          name: fileItem.file_origin_name,
          url: fileItem.thumb,
          origin: fileItem,
          id: fileItem.id
        }))
        if (!item.headers) item.headers = {}
        // 如果需要token，可以设置
        // item.headers.AccessToken = ''
        // 注意on-success不能绑定箭头函数！！！
        item['on-success'] = function(resp) {
          const formRender = that.$refs.formRender
          if (resp.code === 0) {
            const prev = formRender[formModel][vModel] || []
            this.$set(formRender[formModel], vModel, [...prev, ...resp.data])
            this.elForm.validateField(vModel)
          }
        }

        item['on-preview'] = function(file) {
          if (!file) return false
          const formRender = that.$refs.formRender
          let file_data = {}
          if (file.response) {
            file_data = file.response.data[0]
          } else {
            file_data = file.origin
          }
          const val = formRender[formModel][vModel] || []

          if (file_data.file_type === 'img') {
            that.previewUrl = file_data.url
            that.previewList = []
            for (let imageIndex in val) {
              that.previewList.push(val[imageIndex].url)
            }
            that.$refs.previwImage.showViewer = true
          } else {
            window.open(file_data.url, '_blank')
          }
        }

        item['on-remove'] = function(file, fileList) {
          const formRender = that.$refs.formRender
          this.$set(
            formRender[formModel],
            vModel,
            fileList.map(f => (f.response ? f.response.data : f.url))
          )
          this.elForm.validateField(vModel)
        }

        item['before-upload'] = function(file) {
          const config = item.__config__
          let isRightSize = true
          let isAccept = true
          if (item.accept) {
            isAccept = new RegExp(`${item.accept}`).test(file.type)
            if (!isAccept) {
              setTimeout(() => {
                this.$message({
                  message: `应该选择${item.accept}类型的文件`,
                  type: 'warning'
                })
              })
            }
          }
          if (config.fileSize) {
            isRightSize = file.size / units[config.sizeUnit] < config.fileSize
            if (!isRightSize) {
              setTimeout(() => {
                this.$message({
                  message: `文件大小超过 ${config.fileSize}${config.sizeUnit}`,
                  type: 'warning'
                })
              })
            }
          }
          return isRightSize && isAccept
        }
      }
    },
    onOpen() {},
    onClose() {
      this.dialogLoading = false
    },
    onConfirmForm(formData) {
      // formData = removeEmptyKeys(formData)
      const submitFormData = this._.cloneDeep(formData)
      console.log('onConfirmForm', submitFormData)
      for (let index in submitFormData) {
        if (isFalse(submitFormData[index])) {
          submitFormData[index] = ''
        }
      }
      this.formConf.loading = true
      this.buttonLoading = true
      const done = (close = true) => {
        this.formConf.loading = false
        this.buttonLoading = false
        this.dialogVisible = false
        if (close) this.visible = false
      }
      this.onConfirm()(this.buttonData, submitFormData, done)
      // this.$emit('onconfirm', this.buttonData, formData, done)
    },
    onResetForm() {
      console.log('onResetForm')
    },
    // 确认
    handleConfirm() {
      this.$refs.formRender.submitForm()
    },
    //重置
    handleReset() {
      console.log(this.$refs)
      this.$refs.formRender.resetForm()
    }
  }
}
</script>

<style></style>
