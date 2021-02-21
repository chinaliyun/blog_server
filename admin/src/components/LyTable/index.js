export default {
  name: 'ly-table',
  props: {
    // 列表项
    tableColumn: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    },
    // 表格数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 页码
    pageNo: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 0
    },
    // 数据总数
    total: {
      type: Number,
      default: 0
    },
    changePageNo: {
      type: Function,
      default: function(page) {
        console.log('changePageNo page: ', page);
      }
    },
    changePageSize: {
      type: Function,
      default: function(size) {
        console.log('changePageSize size: ', size);
      }
    },
    clickRow: {
      type: Function,
      default: function(row, click, event) {
        console.log('clickRow row: ', row, click, event);
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSizeChange(size) {
      /**
       * 切换了pageSize事件，记得重置pageNo
       */
      this.$emit('changePageSize', size);
    },
    handleCurrentChange(page) {
      /**
       * 点击了页码事件,改变pageNo
       */
      this.$emit('changePageNo', page);
    },
    handleRowClick(row, click, event) {
      /**
       * 点击了某一行事件
       */
      this.$emit('clickRow', row, click, event);
    }
  }
};
