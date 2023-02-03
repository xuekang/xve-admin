<template>
  <div class="box-container">
    <table-generator v-bind="tableConf" />
    <!-- <el-button type="primary" @click="testPage">主要按钮</el-button> -->
  </div>
</template>

<script>
import TableGenerator from '@/components/TableGenerator/ElDataTable'
import { getTableConf } from '@/api/table-form-generator'

export default {
  components: {
    TableGenerator
  },
  props: {},
  data() {
    return {
      tableConf: {
        // url: '/auth/User/list',
        // columns: [
        //   {
        //     prop: 'user_name',
        //     label: '用户名'
        //   },
        //   {
        //     prop: 'user_phone',
        //     label: '用户手机号'
        //   }
        // ],
        // searchForm: [
        //   {
        //     type: 'input',
        //     id: 'user_name',
        //     label: '用户名',
        //     el: {
        //       placeholder: '请输入'
        //     }
        //   }
        // ],
        // form: [
        //   {
        //     type: 'input',
        //     id: 'user_name',
        //     label: '用户名',
        //     el: {
        //       placeholder: '请输入'
        //     },
        //     rules: [
        //       {
        //         required: true,
        //         message: '请输入用户名',
        //         trigger: 'blur'
        //       }
        //     ]
        //   }
        // ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getTableConf()
  },
  mounted() {

  },
  methods: {
    // 获取表格配置
    getTableConf() {
      const auth_id = this._.get(this.$route, 'meta.auth_id', '')
      getTableConf(auth_id).then(res => {
        console.log('表格配置', res.data)
        this.tableConf = { ...this.tableConf, ...res.data }
      })
    },
    testPage() {
      this.$router.replace({
        path: '/test/index',
        query: {
          'auth_code': 'test'
        }
      })
      console.log(11)

      this.$router.push({
        path: '/test/index',
        query: {
          'auth_code': 'test'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-container {
  padding: 20px;
}
</style>
