<template>
  <div class="el-data-table">
    <template v-if="showNoData">
      <!--@slot 获取数据为空时的内容-->
      <slot name="no-data" />
    </template>
    <template v-else>
      <!-- 搜索字段 -->
      <table-search-form
        :search-form="searchForm"
        @search="search"
        @resetSearch="resetSearch"
      />

      <el-row v-if="hasHeader" class="table-header-button-container">
        <!-- 自定义按钮 -->
        <template v-for="btn in headerButtons">
          <div
            v-if="'show' in btn ? btn.show(selected) : true"
            :key="btn.renderKey"
            class="table-header-button-item"
          >
            <table-button
              v-permission="btn.auth_route_name"
              :is-text="btn.isText === undefined ? false : btn.isText"
              :button-size="buttonSize"
              :disabled="'disabled' in btn ? btn.disabled(selected) : false"
              :click="btn.atClick"
              v-bind="btn"
            >
              {{
                typeof btn.text === 'function' ? btn.text(selected) : btn.text
              }}
            </table-button>
          </div>
        </template>

        <!--@slot 额外的header内容, 当headerButtons不满足需求时可以使用，传入selected -->
        <slot name="header" :selected="selected" />

        <!--@collapse 自定义折叠按钮, 默认的样式文案不满足时可以使用。传入当前折叠状态 isSearchCollapse: Boolean -->
        <!-- <slot name="collapse" :isSearchCollapse="isSearchCollapse">
          <div class="table-header-button-item">
            <el-button
              v-if="canSearchCollapse"
              type="default"
              :size="buttonSize"
              :icon="`el-icon-arrow-${isSearchCollapse ? 'down' : 'up'}`"
              @click="isSearchCollapse = !isSearchCollapse"
            >{{ isSearchCollapse ? '展开' : '折叠' }}搜索</el-button>
          </div>
        </slot> -->
      </el-row>

      <el-table
        ref="table"
        v-loading="loading"
        v-bind="tableAttrs"
        :data="data"
        border
        :row-class-name="rowClassName"
        v-on="tableEventHandlersInner"
        @selection-change="selectStrategy.onSelectionChange"
        @select="selectStrategy.onSelect"
        @select-all="selectStrategy.onSelectAll($event, selectable)"
      >
        <!--TODO 不用jsx写, 感觉template逻辑有点不清晰了-->
        <template v-if="isTree">
          <!--有多选-->
          <template v-if="hasSelect">
            <el-data-table-column
              key="selection-key"
              v-bind="{ align: columnsAlign, ...columns[0] }"
            />

            <el-data-table-column
              key="tree-ctrl"
              v-bind="{ align: columnsAlign, ...columns[1] }"
            >
              <template slot-scope="scope">
                <span
                  v-for="space in scope.row._level"
                  :key="space"
                  class="ms-tree-space"
                />
                <span
                  v-if="iconShow(scope.$index, scope.row)"
                  class="tree-ctrl"
                  @click="toggleExpanded(scope.$index)"
                >
                  <i
                    :class="`el-icon-${scope.row._expanded ? 'minus' : 'plus'}`"
                  />
                </span>
                {{ scope.row[columns[1].prop] }}
              </template>
            </el-data-table-column>

            <el-data-table-column
              v-for="col in columns.filter((c, i) => i !== 0 && i !== 1)"
              :key="col.prop"
              v-bind="{ align: columnsAlign, ...col }"
            />
          </template>

          <!--无选择-->
          <template v-else>
            <!--展开这列, 丢失 el-data-table-column属性-->
            <el-data-table-column
              key="tree-ctrl"
              v-bind="{ align: columnsAlign, ...columns[0] }"
            >
              <template slot-scope="scope">
                <span
                  v-for="space in scope.row._level"
                  :key="space"
                  class="ms-tree-space"
                />

                <span
                  v-if="iconShow(scope.$index, scope.row)"
                  class="tree-ctrl"
                  @click="toggleExpanded(scope.$index)"
                >
                  <i
                    :class="`el-icon-${scope.row._expanded ? 'minus' : 'plus'}`"
                  />
                </span>
                {{ scope.row[columns[0].prop] }}
              </template>
            </el-data-table-column>

            <el-data-table-column
              v-for="col in columns.filter((c, i) => i !== 0)"
              :key="col.prop"
              v-bind="{ align: columnsAlign, ...col }"
            />
          </template>
        </template>

        <!--非树-->
        <template v-else>
          <template v-for="(col, index) in columns">
            <el-data-table-column
              v-if="col.type === 'img'"
              :key="index + '_img'"
              v-bind="{ align: columnsAlign, ...col }"
            >
              <template slot-scope="scope">
                <el-link
                  v-if="scope.row[col.prop] && scope.row[col.prop].length > 0"
                  @click="previweImage($event, scope.row[col.prop])"
                >
                  查看({{ scope.row[col.prop].length }}张<i
                    class="el-icon-picture-outline"
                  ></i
                  >)
                </el-link>
                <span v-else style="color:#C0C4CC;">暂无数据</span>
              </template>
            </el-data-table-column>

            <el-data-table-column
              v-else-if="col.type === 'video' || col.type === 'file'"
              :key="index + '_file'"
              v-bind="{ align: columnsAlign, ...col }"
            >
              <template slot-scope="scope">
                <el-link
                  v-if="scope.row[col.prop] && scope.row[col.prop].length > 0"
                  @click="previewFile($event, scope.row[col.prop])"
                >
                  查看({{ scope.row[col.prop].length }}个<i
                    :class="
                      col.type === 'video'
                        ? 'el-icon-video-camera'
                        : 'el-icon-document'
                    "
                  ></i
                  >)
                </el-link>
                <span v-else style="color:#C0C4CC;">暂无数据</span>
              </template>
            </el-data-table-column>

            <el-data-table-column
              v-else-if="col.type === 'rich_text'"
              :key="index + '_rich_text'"
              v-bind="{ align: columnsAlign, ...col }"
            >
              <template slot-scope="scope">
                <el-link
                  v-if="scope.row[col.prop]"
                  @click="previewRichText($event, scope.row[col.prop])"
                >
                  查看<i class="el-icon-tickets"></i>
                </el-link>
                <span v-else style="color:#C0C4CC;">暂无数据</span>
              </template>
            </el-data-table-column>

            <el-data-table-column
              v-else
              :key="index"
              v-bind="{ align: columnsAlign, ...col }"
            />
          </template>
        </template>

        <!--默认操作列-->
        <el-data-table-column
          v-if="hasOperation"
          label="操作"
          v-bind="{ align: columnsAlign, ...operationAttrs }"
        >
          <template slot-scope="scope">
            <template v-for="btn in columnButtons">
              <table-button
                v-if="'show' in btn ? btn.show(scope.row) : true"
                :key="_.uniqueId(btn.renderKey)"
                v-permission="btn.auth_route_name"
                :is-text="btn.isText === undefined ? true : btn.isText"
                v-bind="btn"
                :click="btn.atClick"
                :row-data="scope.row"
                :disabled="'disabled' in btn ? btn.disabled(scope.row) : false"
              >
                {{
                  typeof btn.text === 'function'
                    ? btn.text(scope.row)
                    : btn.text
                }}
              </table-button>
            </template>

            <!--@slot 自定义操作列, 当columnButtons不满足需求时可以使用。传入 row -->
            <slot name="operation" :row="scope.row" />
          </template>
        </el-data-table-column>

        <!--@slot 默认slot，同 el-table -->
        <slot />
      </el-table>

      <el-pagination
        v-if="hasPagination"
        :current-page="page"
        :page-sizes="paginationSizes"
        :page-size="size"
        :total="total"
        style="text-align: right; padding: 10px 0;"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-image
        ref="previwImage"
        style="display: none;"
        :src="previewUrl"
        :preview-src-list="previewList"
      >
      </el-image>

      <el-dialog
        ref="previwFile"
        title="查看"
        :visible.sync="dialogPreviewFileVisible"
        :modal-append-to-body="false"
        :append-to-body="true"
        :lock-scroll="false"
        width="30%"
      >
        <div
          v-for="(previwFileItem, index) in previewFileList"
          :key="previwFileItem.id + '_' + index"
          style="line-height: 1.8;"
        >
          <i class="el-icon-view" style="margin-right: 10px;"></i>
          <el-link
            :underline="false"
            @click="toPreviewFile($event, previewFileItem)"
          >
            {{ previwFileItem.file_origin_name }}
          </el-link>
        </div>
      </el-dialog>

      <el-dialog
        ref="previwRichText"
        title="查看"
        :visible.sync="dialogPreviewRichTextVisible"
        :modal-append-to-body="false"
        :append-to-body="true"
        :lock-scroll="false"
      >
        <!-- eslint-disable-next-line -->
        <div v-html="previewRichTextContent" />
      </el-dialog>
    </template>
  </div>
</template>

<script>
import TableSearchForm from './components/table-search-form.vue'
import TableButton from './components/table-button.vue'
import ElDataTableColumn from './components/el-data-table-column'
import * as queryUtil from './utils/query'
import getSelectStrategy from './utils/select-strategy'
import getLocatedSlotKeys from './utils/extract-keys'
import transformSearchImmediatelyItem from './utils/search-immediately-item'
import { isFalse, removeEmptyKeys, deepClone } from '@/utils'
import request from '@/utils/request'
import Promise from 'lie'

const defaultFirstPage = 1
const noPaginationDataPath = 'payload'

export default {
  name: 'ElDataTable',
  components: {
    TableSearchForm,
    TableButton,
    ElDataTableColumn
  },
  props: {
    /**
     * 页面权限id
     */
    pageAuthId: {
      type: String,
      default: ''
    },
    /**
     * 表格数据请求url, 如果为空, 则不会发送请求; 改变url, 则table会重新发送请求
     */
    url: {
      type: String,
      default: ''
    },
    /**
     * 主键字段名，默认值 id，
     * 修改/删除时会用到,请求会根据定义的属性值获取主键,即row[this.id]
     */
    id: {
      type: String,
      default: 'id'
    },
    /**
     * 栏目数据参数字段名
     */
    columnParams: {
      type: String,
      default: 'column_params'
    },
    /**
     * 分页请求的第一页的值(有的接口0是第一页)
     */
    firstPage: {
      type: Number,
      default: defaultFirstPage
    },
    /**
     * 渲染组件的分页数据在接口返回的数据中的路径, 嵌套对象使用.表示即可
     */
    dataPath: {
      type: String,
      default: 'data.list'
    },
    /**
     * 分页数据的总数在接口返回的数据中的路径, 嵌套对象使用.表示即可
     */
    totalPath: {
      type: String,
      default: 'data.total'
    },
    /**
     * 请求的时候如果接口需要的页码的查询 key 不同的时候可以指定
     */
    pageKey: {
      type: String,
      default: 'current_page'
    },
    /**
     * 请求的时候如果接口需要的分页数量的查询 key 不同的时候可以指定
     */
    pageSizeKey: {
      type: String,
      default: 'page_size'
    },
    /**
     * 查询表头字段名
     */
    columnKey: {
      type: String,
      default: 'field'
    },
    /**
     * 增删改查的表名
     */
    crudTableName: {
      type: String,
      default: ''
    },
    /**
     * 自定义处理请求返回的数据
     * @param raw axios 返回的原始数据
     * @return 函数应返回 {total, data}
     */
    onResponse: {
      type: Function,
      default: undefined
    },
    /**
     * 列属性设置, 详情见element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes
     */
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 查询字段渲染, 配置参考el-form-renderer
     * @link https://femessage.github.io/el-form-renderer/
     */
    searchForm: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 查询字段名
     */
    searchKey: {
      type: String,
      default: 'condition'
    },
    /**
     * 是否开启搜索栏折叠功能
     */
    canSearchCollapse: {
      type: Boolean,
      default: false
    },
    /**
     * 点击查询按钮, 查询前执行的函数，参数form表单数据，需要返回Promise
     */
    beforeSearch: {
      type: Function,
      default() {}
    },
    /**
     * 单选, 适用场景: 不可以批量删除
     */
    single: {
      type: Boolean,
      default: false
    },
    /**
     * 切换页面时，已勾选项不会丢失
     */
    persistSelection: {
      type: Boolean,
      default: false
    },
    /**
     * 是否有操作列
     */
    hasOperation: {
      type: Boolean,
      default: true
    },
    /**
     * 操作列的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
     * {type: '', text: '', atClick: row => Promise.resolve(), show: row => return true时显示, disabled: row => return true时禁用 }
     * 点击事件 row参数 表示当前行数据, 需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
     */
    columnButtons: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 头部的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
     * {type: '', text: '', atClick: selected => Promise.resolve(), show: selected => return true时显示, disabled: selected => return true时禁用}
     * 点击事件 selected参数 表示选中行所组成的数组, 函数需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
     */
    headerButtons: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 是否有新增按钮
     */
    hasNew: {
      type: Boolean,
      default: false
    },
    /**
     * 是否有编辑按钮
     */
    hasEdit: {
      type: Boolean,
      default: false
    },
    /**
     * 是否有查看按钮
     */
    hasView: {
      type: Boolean,
      default: false
    },
    /**
     * table头部是否有删除按钮(该按钮要多选时才会出现)
     */
    hasDelete: {
      type: Boolean,
      default: false
    },
    /**
     * crud 操作成功后会调用的函数，默认是 this.$message.success('操作成功')
     * 接受两个参数：
     * msg
     * data，操作的数据对象
     */
    onSuccess: {
      type: Function,
      default(msg) {
        return this.$message.success(msg || '操作成功')
      }
    },
    /**
     * 是否分页。如果不分页，则请求传参page=-1
     */
    hasPagination: {
      type: Boolean,
      default: true
    },
    /**
     * 分页组件的子组件布局，子组件名用逗号分隔，对应element-ui pagination的layout属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    /**
     * 分页组件的每页显示个数选择器的选项设置，对应element-ui pagination的page-sizes属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    },
    /**
     * 分页组件的每页显示个数选择器默认选项，对应element-ui pagination的page-size属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationSize: {
      type: Number,
      default: 10
    },
    /**
     * @deprecated
     * 不分页时的size的大小(建议接口约定，不分页时传参page=-1，故一般不会用到此属性)
     */
    noPaginationSize: {
      type: Number,
      default: -1
    },
    /**
     * 要渲染的数据是否是树形结构
     */
    isTree: {
      type: Boolean,
      default: false
    },
    /**
     * 树形结构相关: 子节点的字段名
     */
    treeChildKey: {
      type: String,
      default: 'children'
    },
    /**
     * 树形结构相关: 父节点的字段名
     */
    treeParentKey: {
      type: String,
      default: 'pid'
    },
    /**
     * 树形结构相关: 父节点字段值的来源字段。
     * 新增/修改时会用到, 例如, 在id为2的节点新增子节点, 则子节点的parentId为2, 也即parentId的值来源于字段id, 故treeParentValue为id
     */
    treeParentValue: {
      type: String,
      default: 'id'
    },
    /**
     * 树形结构相关: 是否展开所有节点
     */
    expandAll: {
      type: Boolean,
      default: false
    },
    /**
     * el-table 的 prop 配置，详情配置参考element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-attributes
     */
    tableAttrs: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * el-table 的 eventHandler 配置，详情配置参考element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-attributes
     */
    tableEventHandlers: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 操作列属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes
     */
    operationAttrs: {
      type: Object,
      default() {
        return { width: '', fixed: 'right' }
      }
    },
    /**
     * 同extraBody
     * @deprecated
     */
    tableParams: {
      type: Object,
      default() {
        return undefined
      }
    },
    /**
     * 新增/修改提交时，请求体带上额外的参数。
     */
    extraBody: {
      type: Object,
      default() {
        return undefined
      }
    },
    /**
     * 在新增/修改弹窗 点击确认时调用，返回Promise, 如果reject, 则不会发送新增/修改请求
     * 参数: (data, isNew) data为表单数据, isNew true 表示是新增弹窗, false 为 编辑弹窗
     */
    beforeConfirm: {
      type: Function,
      default() {
        return Promise.resolve()
      }
    },
    /**
     * 同extraQuery
     * @deprecated
     */
    customQuery: {
      type: Object,
      default() {
        return undefined
      }
    },
    /**
     * 向请求url添加的额外参数。
     * 可用.sync修饰，此时点击重置按钮后该参数也会被重置
     */
    extraQuery: {
      type: Object,
      default() {
        return undefined
      }
    },
    /**
     * 是否开启使用url保存query参数的功能
     */
    saveQuery: {
      type: Boolean,
      default: false
    },
    /**
     * 操作栏按钮类型
     * `text` 为文本按钮, `button` 为普通按钮
     */
    operationButtonType: {
      type: String,
      default: 'text'
    },
    /**
     * 设置 `按钮` 大小
     * @see https://element.eleme.cn/#/zh-CN/component/button#bu-tong-chi-cun
     */
    buttonSize: {
      type: String,
      default: 'small'
    },
    /**
     * 设置axios的config参数
     */
    axiosConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  provide() {
    return {
      onConfirm: this.onConfirm,
      getRequestParams: this.getRequestParams
    }
  },
  data() {
    return {
      data: [],
      previewUrl: '',
      previewList: [],
      dialogPreviewFileVisible: false,
      previewFileList: [],
      previewRichTextContent: '',
      dialogPreviewRichTextVisible: false,
      searchFormData: {}, // 查询表单数据
      size: this.paginationSize || this.paginationSizes[0],
      page: defaultFirstPage,
      // https://github.com/ElemeFE/element/issues/1153
      total: null,
      loading: false,
      // 多选项的数组
      selected: [],

      // 要修改的那一行
      row: {},

      // 初始的extraQuery值, 重置查询时, 会用到
      // JSON.stringify是为了后面深拷贝作准备
      initExtraQuery: JSON.stringify(this.extraQuery || this.customQuery || {}),
      isSearchCollapse: false,
      showNoData: false
    }
  },
  computed: {
    tableEventHandlersInner() {
      const handlers = {}
      for (const key in this.tableEventHandlers) {
        const kebab = this._.kebabCase(key)
        handlers[kebab] = this.tableEventHandlers[key]
      }
      return handlers
    },
    hasSelect() {
      return this.columns.length && this.columns[0].type === 'selection'
    },

    selectable() {
      if (this.hasSelect && this.columns[0].selectable) {
        return this.columns[0].selectable
      }
      return () => true
    },

    columnsAlign() {
      if (this.columns.some(col => col.columns && col.columns.length)) {
        // 多级表头默认居中
        return 'center'
      } else {
        return ''
      }
    },
    routerMode() {
      return this.$router ? this.$router.mode : 'hash'
    },
    hasSearchForm() {
      return this.searchForm.length || this.$slots.search
    },
    hasHeader() {
      return (
        this.hasNew ||
        (this.hasSelect && this.hasDelete) ||
        this.headerButtons.length ||
        this.canSearchCollapse ||
        this.$scopedSlots.header
      )
    },
    _extraBody() {
      return this.extraBody || this.tableParams || {}
    },
    _extraQuery() {
      return this.extraQuery || this.customQuery || {}
    },
    selectStrategy() {
      return getSelectStrategy(this)
    },
    searchLocatedSlotKeys() {
      return getLocatedSlotKeys(this.$slots, 'search:')
    },
    collapseForm() {
      return this.searchForm.map(item => {
        if ('collapsible' in item && !item.collapsible) {
          return item
        }

        const itemHidden = item.hidden || (() => false)
        return {
          ...item,
          hidden: data => {
            return this.isSearchCollapse || itemHidden(data)
          }
        }
      })
    },
    _searchForm() {
      return transformSearchImmediatelyItem(this.collapseForm, this)
    }
  },
  watch: {
    url: {
      handler(val) {
        if (!val) return
        this.page = defaultFirstPage
        // mounted处有updateForm的行为，所以至少在初始执行时要等到nextTick
        this.$nextTick(this.getList)
      },
      immediate: true
    },
    selected(val) {
      /**
       * 多选项发生变化
       * @property {array} rows - 已选中的行数据的数组
       */
      this.$emit('selection-change', val)
    }
  },
  mounted() {
    if (this.saveQuery) {
      const query = queryUtil.get(location.href)
      if (query) {
        this.page = parseInt(query[this.pageKey])
        this.size = parseInt(query[this.pageSizeKey])
        // 恢复查询条件，但对slot=search无效
        if (this.$refs.searchForm) {
          delete query[this.pageKey]
          delete query[this.pageSizeKey]
          this.$refs.searchForm.updateForm(query)
        }
      }
    }
  },
  methods: {
    /**
     * 手动刷新列表数据，选项的默认值为: { loading: true }
     * @public
     * @param {object} options 方法选项
     */
    getList({ loading = true } = {}) {
      const { url } = this

      if (!url) {
        console.warn('DataTable: url 为空, 不发送请求')
        return
      }

      // 请求动画开始
      this.loading = loading

      const params = this.getListParams()
      const formValue = params[this.searchKey]

      request({
        method: 'post',
        url,
        data: params
      })
        .then(raw => {
          if (this.parseResponse(raw, arguments) === false) return

          this.showNoData =
            this.$slots['no-data'] &&
            this.total === 0 &&
            (this._.isEmpty(formValue) ||
              this._.values(formValue).every(isFalse))

          this.loading = false

          /**
           * 请求返回, 数据更新后触发
           * @property {object} data - table的数据
           * @property {object} payload - 包含 data 的外层数据
           */
          this.$emit('update', this.data, raw)

          // 开启persistSelection时，需要同步selected状态到el-table中
          this.$nextTick(() => {
            this.selectStrategy.updateElTableSelection()
          })
        })
        .catch(err => {
          /**
           * 请求数据失败，返回err对象
           * @event error
           */
          this.$emit('error', err)
          this.total = 0
          this.loading = false
        })
    },
    // 获取请求参数
    getListParams() {
      // 构造query对象
      let query = {}
      query.crudTableName = this.crudTableName
      Object.assign(query, this._extraQuery)

      query.pageAuthId = this.pageAuthId

      // 查询条件
      query[this.searchKey] = this.searchFormData

      //查询字段
      query[this.columnKey] = this.getShowColumn()

      // 分页参数
      query[this.pageSizeKey] = this.hasPagination
        ? this.size
        : this.noPaginationSize

      // 根据偏移值计算接口正确的页数
      const pageOffset = this.firstPage - defaultFirstPage
      query[this.pageKey] = this.hasPagination ? this.page + pageOffset : -1

      // 无效值过滤，注意0是有效值
      query = removeEmptyKeys(query)

      // 存储query记录, 便于后面恢复
      if (this.saveQuery) {
        // 存储的page是table的页码，无需偏移
        query[this.pageKey] = this.page
        const newUrl = queryUtil.set(location.href, query, this.routerMode)
        history.replaceState(history.state, 'el-data-table search', newUrl)
      }

      const params = {
        ...removeEmptyKeys(query),
        ...this._.get(this.axiosConfig, 'params', {})
      }

      return params
    },
    //获取显示表头
    getShowColumn() {
      const data = []
      this.columns.forEach(item => {
        data.push(item.prop)
      })
      return data
    },
    // 解析响应数据
    parseResponse(raw, getListArgs) {
      const payload = raw
      let data = []
      let total = 0

      if (this.onResponse) {
        const processData = this.onResponse(raw)
        data = processData.data
        total = processData.total
      } else {
        // payload = raw.data
        // 不分页
        if (!this.hasPagination) {
          data =
            this._.get(payload, this.dataPath) ||
            this._.get(payload, noPaginationDataPath) ||
            []
          total = data.length
        } else {
          data = this._.get(payload, this.dataPath) || []
          // 获取不到值得时候返回 undefined, el-pagination 接收一个 null 或者 undefined 会导致没数据但是下一页可点击
          total = this._.get(payload, this.totalPath) || 0
          const lastPage = Math.ceil(total / this.size)
          if (lastPage > 0 && lastPage < this.page) {
            this.page = lastPage
            this.getList(...getListArgs)
            return false
          }
        }
      }

      // 树形结构逻辑
      if (this.isTree) {
        this.data = this.tree2Array(data, this.expandAll)
        this.total = total // 树翻页总数
      } else {
        this.data = data
        this.total = total
      }

      // console.log('getList', raw, this.data)
      return true
    },
    // 查询
    async search(formData, done) {
      this.page = defaultFirstPage
      this.searchFormData = deepClone(formData)
      await this.getList()
      done()
    },
    // 重置查询
    resetSearch() {
      this.page = defaultFirstPage
      this.searchFormData = {}

      // 重置
      if (this.saveQuery) {
        const newUrl = queryUtil.clear(location.href)
        history.replaceState(history.state, '', newUrl)
      }

      this.$emit('reset')
      this.$emit('update:customQuery', JSON.parse(this.initExtraQuery))
      this.$emit('update:extraQuery', JSON.parse(this.initExtraQuery))

      this.$nextTick(() => {
        this.getList()
      })
    },
    handleSizeChange(val) {
      if (this.size === val) return

      this.page = defaultFirstPage
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      if (this.page === val) return

      this.page = val
      this.getList()
    },
    /**
     * 切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否
     *
     * @public
     * @param {object} row - 要更新的数据行
     * @param {boolean} isSelected - 是否被勾选
     */
    toggleRowSelection(row, isSelected) {
      return this.selectStrategy.toggleRowSelection(row, isSelected)
    },
    /**
     * 清空多选项
     *
     * @public
     */
    clearSelection() {
      return this.selectStrategy.clearSelection()
    },
    // 获取功能按钮请求参数
    getRequestParams() {
      return (buttonData, formData) => {
        // console.log('getRequestParams', this)
        const submitData = {}
        submitData.crudTableName = this.crudTableName
        submitData.tableParams = this.getListParams()
        Object.assign(submitData, buttonData.params)

        this.row = buttonData.rowData
        if (this.selected.length > 0) {
          formData[this.id] = this.selected
        }
        if (this._.has(this.row, this.id)) {
          formData[this.id] = this.row[this.id]
        }
        submitData.formData = formData

        if (this._.has(this.row, this.columnParams)) {
          Object.assign(submitData, this.row[this.columnParams])
        }

        return submitData
      }
    },
    // 处理确认请求
    onConfirm() {
      return async (buttonData, formData, done) => {
        this.row = buttonData.rowData
        const { submitUrl } = buttonData
        const submitData = this.getRequestParams()(buttonData, formData)

        // console.log('onConfirm', submitData, buttonData)

        try {
          await this.beforeConfirm(buttonData)

          await request({
            method: 'post',
            url: submitUrl,
            data: submitData
          }).then(raw => {
            this.onSuccess(raw.message, raw.data)
          })
          this.getList()
          done(true)
        } catch (e) {
          // 出错则不关闭dialog
          done(false)
        }
      }
    },

    /**
     * 判断是否返回上一页
     * @public
     */
    correctPage() {
      let deleteCount = 1
      if (this.hasSelect) {
        deleteCount = this.selected.length
        this.clearSelection()
      }
      const remain = this.data.length - deleteCount
      const lastPage = Math.ceil(this.total / this.size)
      if (
        remain === 0 &&
        this.page === lastPage &&
        this.page > defaultFirstPage
      ) {
        this.page--
      }
    },

    // 树形table相关
    // https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable
    tree2Array(data, expandAll, parent = null, level = null) {
      let tmp = []
      data.forEach(record => {
        if (record._expanded === undefined) {
          this.$set(record, '_expanded', expandAll)
        }
        let _level = 0
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        this.$set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          Object.defineProperty(record, 'parent', {
            value: parent,
            enumerable: false
          })
        }
        tmp.push(record)

        if (record[this.treeChildKey] && record[this.treeChildKey].length > 0) {
          const children = this.tree2Array(
            record[this.treeChildKey],
            expandAll,
            record,
            _level
          )
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    rowClassName(...args) {
      let rcn =
        this.tableAttrs.rowClassName || this.tableAttrs['row-class-name'] || ''
      if (typeof rcn === 'function') rcn = rcn(...args)
      if (this.isTree) rcn += ' ' + this.showRow(...args)
      return rcn
    },
    showRow({ row }) {
      const show = !row.parent || (row.parent._expanded && row.parent._show)
      row._show = show
      return show ? 'row-show' : 'row-hide'
    },
    // 切换下级是否展开
    toggleExpanded(trIndex) {
      const record = this.data[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      //      return index ===0 && record.children && record.children.length > 0;
      return record[this.treeChildKey] && record[this.treeChildKey].length > 0
    },
    previweImage(event, list) {
      if (!(list && list.length > 0)) {
        this.$showInfo('暂无数据')
        return true
      }
      this.previewList = []
      list.forEach((item, index) => {
        if (index === 0) {
          this.previewUrl = item['url']
        }
        this.previewList.push(item['url'])
      })
      this.$refs.previwImage.showViewer = true
    },
    previewFile(event, list) {
      this.previewFileList = list
      this.dialogPreviewFileVisible = true
    },
    toPreviewFile(event, listItem) {
      window.open(listItem.url, '_blank')
    },
    previewRichText(event, content) {
      console.log(content)

      this.previewRichTextContent = content
      this.dialogPreviewRichTextVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-data-table {
  $color-blue: #2196f3;
  $space-width: 18px;
  .table-header-button-container {
    .table-header-button-item {
      display: inline-block;
      margin-bottom: 10px;
    }
    .table-header-button-item + .table-header-button-item {
      margin-left: 10px;
    }
  }
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;

    &::before {
      content: '';
    }
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: $color-blue;
  }

  @keyframes treeTableShow {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .row-show {
    animation: treeTableShow 1s;
  }

  .row-hide {
    display: none;
  }
}
</style>
