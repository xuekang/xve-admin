<template>
  <div style="display:inline-block;">
    <component
      :is="isText ? 'text-button' : 'el-button'"
      :size="buttonSize"
      v-bind="$attrs"
      :loading="loading"
      :type="type"
      v-on="$listeners"
      @click.stop="handleClick"
    >
      <slot />
    </component>
    <div style="display:inline-block;">
      <the-dialog
        ref="dialog"
        :render-key="_.uniqueId(renderKey)"
        :button-size="buttonSize"
        :dialog-form="dialogForm"
        v-bind="dialogAttrs"
      />
    </div>
  </div>
</template>

<script>
import TextButton from './text-button.vue'
import TheDialog from './the-dialog.vue'
import request from '@/utils/request'
import Promise from 'lie'

export default {
  components: {
    TextButton,
    TheDialog
  },
  props: {
    /**
     * 渲染key
     */
    renderKey: {
      type: String,
      default: ''
    },
    /**
     * 是否是文字按钮。
     */
    isText: {
      type: Boolean,
      default: false
    },
    /**
     * 按钮名称
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * 样式类型，如果没有这个props，则通过attrs传`type`时，会导致el-button的`native-type`也被改变
     */
    type: {
      type: String,
      default: ''
    },
    /**
     * 按钮大小
     */
    buttonSize: {
      type: String,
      default: 'small'
    },
    /**
     * 动作类型，
     */
    actionType: {
      type: String,
      required: true
    },
    /**
     * 权限id，
     */
    authId: {
      type: String,
      default: ''
    },
    /**
     * 标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * 数据提交地址
     */
    submitUrl: {
      type: String,
      default: ''
    },
    /**
     * 数据获取地址
     */
    getUrl: {
      type: String,
      default: ''
    },
    /**
     * 按钮配置参数
     */
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 当前行数据
     */
    rowData: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * MessageBox 消息正文内容
     */
    msgboxMessage: {
      type: String,
      default: ''
    },
    /**
     * 弹框属性
     * 文档：https://element.eleme.cn/#/zh-CN/component/message-box
     */
    msgboxAttrs: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 表单弹框数据
     */
    dialogForm: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 表单弹框属性
     */
    dialogAttrs: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 新页面地址
     */
    newPagePath: {
      type: String,
      default: ''
    },
    /**
     * 点击按钮绑定的函数
     */
    click: {
      type: Function,
      default: null
    }
  },
  inject: ['onConfirm', 'getRequestParams'],
  data() {
    return {
      loading: false
    }
  },
  mounted() {},
  methods: {
    // 监控按钮的Promise进程
    handleClick() {
      const this_props = {}
      for (const key of Object.keys(this.$props)) {
        this_props[key] = this[key]
      }
      // console.log('测试按钮', this, this_props)
      if (this.click) {
        // 自定义按钮
        this.loading = true
        Promise.resolve(this.click(this_props))
          .then(flag => {
            if (flag === false) return
            // 调用父组件中的数据刷新方法
            this.callback()
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false
          })
      } else {
        // 处理按钮动作模式
        this[this.actionType](this_props)
      }
    },
    /**
     * 普通确认弹框，流程如下：
     * 1. 弹出确认弹窗
     * 2. 点击弹框确认后，有数据提交地址则执行请求，过程中确认按钮保持 loading；
     * 3. 失败则报错误信息、弹窗不关闭；
     * 4. 成功则报成功信息、弹窗关闭、并校正页码（详见 correctPage）、重新请求列表数据；
     */
    showConfirm(data) {
      let options = {
        // 'closeOnClickModal': false
      }
      const { msgboxMessage, msgboxAttrs } = data
      options = Object.assign(options, msgboxAttrs)
      const title = this.title || options.title || '提示'
      options.type = options.type || ''
      // console.log(data, message, title, options)

      options.beforeClose = async (action, instance, done) => {
        if (action !== 'confirm') return done()

        instance.confirmButtonLoading = true
        // console.log(2132132132321, instance)
        const confirmDone = (close = true) => {
          instance.confirmButtonLoading = false
          if (close) done()
        }
        // console.log(13131313, this.$parent, this.$listeners)
        this.onConfirm()(data, {}, confirmDone)
        // this.$emit('onconfirm', data, {}, confirmDone)
      }

      return this.$confirm(msgboxMessage, title, options).catch(() => {
        /* 取消*/
      })
    },
    /**
     * 表单弹框，流程如下：
     * 1. 弹出确认弹窗
     * 2. 有数据获取地址则执行请求，过程中弹框页面保持 loading；
     * 3. 点击弹框确认后，有数据提交地址则执行请求，过程中确认按钮保持 loading；
     * 4. 失败则报错误信息、弹窗不关闭；
     * 5. 成功则报成功信息、弹窗关闭、并校正页码（详见 correctPage）、重新请求列表数据；
     */
    async showFormDialog(buttonData) {
      const dialogTitle = this.title || this.text
      this.$refs.dialog.show(buttonData, dialogTitle)

      // console.log('showFormDialog', buttonData)
      let dialogFormData = {}
      if (this.getUrl) {
        this.$refs.dialog.showDialogLoading()
        dialogFormData = await this.getInfo(buttonData)
        this.$refs.dialog.closeDialogLoading()
      }

      // console.log(111111, this.$refs.dialog1)

      this.$refs.dialog.showForm(this._.cloneDeep(dialogFormData))

      // console.log('onShowFormDialog', buttonData, dialogTitle, deepClone(dialogForm), dialogFormData, dialogAttrs)
    },
    // 获取请求信息
    getInfo(buttonData) {
      const submitData = this.getRequestParams()(buttonData, {})
      return new Promise((resolve, reject) => {
        request({
          method: 'post',
          url: this.getUrl,
          data: submitData
        })
          .then(raw => {
            // console.log('getInfo', raw)
            // this.onSuccess(raw.message, raw.data)
            resolve(raw.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 跳转到新标签页面
    showNewPage(buttonData) {
      if (!this.newPagePath) {
        this.$showErr('按钮配置错误：无新页面地址')
      }
      // const newPageTitle = this.title || this.text
      const query = this.getRequestParams()(buttonData, {})
      this.$router.push({
        path: this.newPagePath,
        query: query
      })
    }
  }
}
</script>
