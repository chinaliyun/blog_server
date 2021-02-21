<template>
  <div class="ly_table">
    <div class="table_section">
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="{ background: '#f3f3f3' }"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :fixed="item.fixed"
          :width="item.width"
          :sortable="item.sortable"
          :type="item.type"
        >
          <template v-if="item.slot" #default="scope">
            <slot
              :name="item.prop"
              :data="item.data"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total > 0" class="pagination_section">
      <el-pagination
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script src="./index.js"></script>
<style lang="scss" src="./index.scss" scoped></style>
