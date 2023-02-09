<template>
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
</template>

<script>
import TextButton from './text-button.vue'
import { deepClone } from '@/utils'

export default {
  components: { TextButton },
  props: {
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
    msgboxOptions: {
      type: Object,
      default() {
        return {}
      }
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
     * 当前行数据
     */
    rowData: {
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
     * 点击按钮绑定的函数
     */
    click: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      buttonActionMode: {
        'confirm': {
          'method': () => { return this.showConfirmDialog }
        },
        'formDialog': {
          'method': () => { return this.showFormDialog }
        }
      }

    }
  },
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
        Promise.resolve(this.click(this.params))
          .then(flag => {
            if (flag === false) return
            // 调用父组件中的数据刷新方法
            this.callback()
          })
          .catch(e => {})
          .finally(e => {
            this.loading = false
          })
      } else {
        // 处理按钮动作模式
        this.buttonActionMode[this.actionType].method()(this_props)
      }
    },
    /**
     * 确认弹框，流程如下：
     * 1. 弹出确认弹窗
     * 2. 有请求地址则执行请求，过程中确认按钮保持 loading；
     * 3. 失败则报错误信息、弹窗不关闭；
     * 4. 成功则报成功信息、弹窗关闭、并校正页码（详见 correctPage）、重新请求列表数据；
     */
    showConfirmDialog(data) {
      let options = {
        'closeOnClickModal': false
      }
      const { msgboxMessage, msgboxOptions } = data
      options = Object.assign(options, msgboxOptions)
      const title = this.title || options.title || '提示'
      options.type = options.type || ''
      // console.log(data, message, title, options)

      options.beforeClose = async(action, instance, done) => {
        if (action !== 'confirm') return done()

        instance.confirmButtonLoading = true

        try {
          this.$emit('onConfirm', data, done)
        } catch (error) {
          console.log(error)
          // 出错则不关闭dialog
          // done()
          throw error
        } finally {
          instance.confirmButtonLoading = false
        }
      }

      return this.$confirm(msgboxMessage, title, options).catch(() => {
        /* 取消*/
      })
    },
    /**
     * 表单弹框，流程如下：
     * 1. 弹出确认弹窗
     * 2. 有请求地址则执行请求，过程中确认按钮保持 loading；
     * 3. 失败则报错误信息、弹窗不关闭；
     * 4. 成功则报成功信息、弹窗关闭、并校正页码（详见 correctPage）、重新请求列表数据；
     */
    showFormDialog(data) {
      this.$emit('onShowFormDialog', data)
    }

  }
}
</script>
