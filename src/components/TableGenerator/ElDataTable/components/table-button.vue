<template>
  <component
    :is="isText ? 'text-button' : 'el-button'"
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
     * 样式类型，如果没有这个props，则通过attrs传`type`时，会导致el-button的`native-type`也被改变
     */
    type: {
      type: String,
      default: ''
    },
    /**
     * 动作类型，
     */
    actionType: {
      type: String,
      default: ''
    },
    /**
     * 点击按钮绑定的函数
     */
    click: {
      type: Function,
      default: null
    },
    /**
     * click函数的参数
     */
    params: {
      type: Object,
      default() {
        return {}
      }
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
      loading: false
    }
  },
  methods: {
    // 监控按钮的Promise进程
    handleClick() {
      if (this.click) {
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

      }
    }

  }
}
</script>
