<template>
  <el-dialog
    ref="dialog"
    :title="title"
    :visible.sync="visible"
    v-bind="dialogAttrs"
    @close="resetFields"
  >

    <div v-if="formConf.fields.length > 0" class="form-container">
      <form-render :form-conf="formConf" @submit="sumbitForm" />
    </div>

    <div v-show="!isView" slot="footer">
      <el-button :size="buttonSize" @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        :loading="confirmLoading"
        :size="buttonSize"
        @click="confirm"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FormRender from '@/components/FormGenerator/parser'

export const dialogModes = {
  new: 'new',
  edit: 'edit',
  view: 'view'
}

export default {
  components: {
    FormRender
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Array,
      required: true
    },
    formAttrs: {
      type: Object,
      required: true
    },
    dialogAttrs: {
      type: Object,
      required: true
    },
    buttonSize: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      mode: dialogModes.new,
      visible: false,
      confirmLoading: false,
      slotData: null
    }
  },
  computed: {
    isView() {
      return this.mode === dialogModes.view
    }
  },
  methods: {
    /**
     * 显示dialog
     * @public
     */
    show(mode, formValue) {
      this.mode = mode
      this.visible = true
      if (formValue) {
        // $nextTick 有时也拿不到 form ，这样是稳妥的做法
        this.$refs.dialog.$once('opened', () => {
          this.$refs.form.updateForm(formValue)
          this.slotData = formValue
        })
      }
    },
    async confirm() {
      const valid = await new Promise(this.$refs.form.validate)
      if (!valid) return

      const formValue = this.$refs.form.getFormValue()
      const isNew = this.mode === dialogModes.new
      this.confirmLoading = true
      const done = (close = true) => {
        this.confirmLoading = false
        if (close) this.visible = false
      }
      this.$emit('confirm', isNew, formValue, done)
    },
    resetFields() {
      this.$refs.form.resetFields()
      this.slotData = null
    }
  }
}
</script>

<style></style>
