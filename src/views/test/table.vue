<template>
  <div v-loading="loading" class="box-container">
    <table-generator v-bind="tableConf" />
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
      loading: false,
      tableConf: {}
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {

  },
  created() {
    // console.log(this._.uniqueId())
    this.getTableConf()
  },
  mounted() {

  },
  methods: {
    // 获取表格配置
    async getTableConf() {
      this.loading = true
      const auth_id = this._.get(this.$route, 'meta.auth_id', '')
      await getTableConf(auth_id).then(res => {
        console.log('表格配置', res.data)
        this.tableConf = { ...this.tableConf, ...res.data }
      })
      this.loading = false
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
