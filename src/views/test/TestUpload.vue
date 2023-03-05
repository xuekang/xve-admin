<template>
  <!-- <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="活动名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-upload
        class="avatar-uploader"
        action="//127.0.0.1:9019/sys_data/Tool/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form> -->
  <div v-if="show" class="test-form">
    <parser ref="formRender" :form-conf="formConf" @submit="sumbitForm1" />
    <el-button type="primary" @click="testBtn">确定</el-button>

    <el-image
      ref="previwImage"
      style="display: none;"
      :src="previewUrl"
      :preview-src-list="previewList"
    >
    </el-image>
  </div>
</template>

<script>
import Parser from '@/components/FormGenerator/parser'
const units = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}
export default {
  name: 'TestUpload',
  components: {
    Parser
  },
  props: {},
  data() {
    return {
      show: false,
      previewUrl: '',
      previewList: [],
      formConf: {
        fields: [
          {
            __config__: {
              label: '上传',
              tag: 'el-upload',
              tagIcon: 'upload',
              layout: 'colFormItem',
              defaultValue: null,
              showLabel: true,
              labelWidth: null,
              required: true,
              span: 24,
              showTip: false,
              buttonText: '点击上传',
              regList: [],
              changeTag: true,
              fileSize: 2,
              sizeUnit: 'MB',
              document: 'https://element.eleme.cn/#/zh-CN/component/upload',
              formId: 101,
              renderKey: 1644834179356
            },
            __slot__: {
              'list-type': true
            },
            action: '//127.0.0.1:9019/sys_data/Tool/upload',
            disabled: false,
            accept: '',
            name: 'file',
            'auto-upload': true,
            'list-type': 'picture-card',
            multiple: true,
            __vModel__: 'test_img'
          },
          {
            __config__: {
              label: '上传',
              tag: 'el-upload',
              tagIcon: 'upload',
              layout: 'colFormItem',
              defaultValue: null,
              showLabel: true,
              labelWidth: null,
              required: true,
              span: 24,
              showTip: false,
              buttonText: '点击上传',
              regList: [],
              changeTag: true,
              fileSize: 10,
              sizeUnit: 'MB',
              document: 'https://element.eleme.cn/#/zh-CN/component/upload',
              formId: 101,
              renderKey: 1644834179356
            },
            __slot__: {
              'list-type': true
            },
            action: '//127.0.0.1:9019/sys_data/Tool/upload',
            disabled: false,
            accept: '',
            name: 'file',
            'auto-upload': true,
            'list-type': 'text',
            multiple: true,
            __vModel__: 'test_file'
          }
        ],
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
      }
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    // console.log(this.$route)
    // this.fillFormData1();
  },
  mounted() {
    this.fillFormData1(
      this.formConf.fields,
      this.formConf,
      {
        test_img: [
          {
            id: '420007115755618304',
            url:
              'http://127.0.0.1:9019/uploads/file/20230304/f9/e4877ebe93c99e68289a0a0417b96a.webp',
            thumb:
              'http://127.0.0.1:9019/uploads/file/20230304/f9/e4877ebe93c99e68289a0a0417b96a.webp',
            file_origin_name: '1000.webp',
            file_type: 'img'
          },
          {
            id: '420189072892362752',
            url:
              'http://127.0.0.1:9019/uploads/file/20230305/72/04d8f9bf0b2c0590f379f4bd3abb7f.jpg',
            thumb:
              'http://127.0.0.1:9019/uploads/file/20230305/72/04d8f9bf0b2c0590f379f4bd3abb7f.jpg',
            file_origin_name:
              'Konachan.com - 68339 akiyama_mio headphones itou_noiji k-on!.jpg',
            file_type: 'img'
          }
        ],
        test_file: [
          {
            id: '420189072892362752',
            url:
              'http://127.0.0.1:9019/uploads/file/20230305/b2/e8897e3ba655b9f9f1ed973f07a999.txt',
            thumb: 'http://127.0.0.1:9019/static/img/default-file.jpg',
            file_origin_name:
              'Konachan.com - 68339 akiyama_mio headphones itou_noiji k-on!.jpg',
            file_type: 'file'
          }
        ]
      },
      this
    )
    this.show = true
  },
  methods: {
    testBtn() {
      // 回填数据
      this.fillFormData1(this.formConf.fields, this.formConf, {})
      console.log(this.formConf.fields)
    },
    fillFormData1(fields, formConf, formData, that) {
      const { formModel, formRef } = formConf
      fields.forEach((item, i) => {
        const vModel = item.__vModel__
        const val = formData[vModel]

        // 设置各表单项的默认值（回填表单）
        //el-upload
        this.handleUploadItem(item, vModel, val, formModel, that)

        //常规表单
        if (val) {
          item.__config__.defaultValue = val
        }

        if (Array.isArray(item.__config__.children)) {
          this.fillFormData(item.__config__.children, formConf, formData, that)
        }
      })
    },
    handleUploadItem(item, vModel, val, formModel, that) {
      // 特殊处理el-upload，包括 回显图片，on-success等各种回调函数
      if (item.__config__.tag === 'el-upload') {
        // 回显图片
        item['file-list'] = (val || []).map((fileItem, index) => ({
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
          console.log(
            'on-success',
            resp,
            this,
            that.$refs.formRender,
            formModel
          )
          const formRender = that.$refs.formRender
          if (resp.code === 0) {
            const prev = formRender[formModel][vModel] || []
            this.$set(formRender[formModel], vModel, [...prev, ...resp.data])
            this.elForm.validateField(vModel)
          }
        }
        item['on-remove'] = function(file, fileList) {
          console.log('on-remove', fileList)
          const formRender = that.$refs.formRender
          this.$set(
            formRender[formModel],
            vModel,
            fileList.map(f => (f.response ? f.response.data : f.url))
          )
          this.elForm.validateField(vModel)
        }
        item['on-preview'] = function(file) {
          const formRender = that.$refs.formRender
          let file_data = {}
          if (file.response) {
            file_data = file.response.data[0]
          } else {
            file_data = file
          }
          const val = formRender[formModel][vModel] || []
          console.log(file, val, file_data)

          if (file_data.file_type === 'img') {
            that.previewUrl = file_data.url
            that.previewList = []
            for (let imageIndex in val) {
              console.log(val[imageIndex].url)

              that.previewList.push(val[imageIndex].url)
            }
            that.$refs.previwImage.showViewer = true
          } else {
            window.open(file_data.url, '_blank')
          }
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

    sumbitForm1(data) {
      console.log('sumbitForm1提交数据：', data)
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)

      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload() {},
    onSubmit() {
      console.log(this.form)
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
