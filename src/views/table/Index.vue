<template>
  <div v-loading="loading" class="box-container">
    <table-generator v-bind="tableConf" />
  </div>
</template>

<script>
import TableGenerator from '@/components/TableGenerator/ElDataTable'
import { getTableConf } from '@/api/table-form-generator'

export default {
  name: 'TableIndex',
  components: {
    TableGenerator
  },
  props: {},
  data() {
    return {
      loading: false,
      auth_id: '',
      tableConf: {}
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    // console.log(this.$route)
    this.auth_id = this._.get(this.$route, 'meta.auth_id', '')
    this.getTableConf()
  },
  mounted() {},
  methods: {
    // 获取表格配置
    async getTableConf() {
      this.loading = true
      await getTableConf(this.auth_id)
        .then(res => {
          console.log('表格配置', res.data)
          this.tableConf = { ...this.tableConf, ...res.data }
          this.tableConf.pageAuthId = this.auth_id
        })
        .finally(() => {
          this.loading = false
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
