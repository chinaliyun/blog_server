<template>
  <div class="page_root">
    <el-card>
      <el-button type="primary" @click="addRow">新增</el-button>
      <el-table :data="mainList">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="标题">
          <template #default="scope">
            <router-link
              :to="{ path: '/bloglist', query: { folder: scope.row.id } }"
            >
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="数量">
          <template #default="scope">
            <router-link
              :to="{ path: '/bloglist', query: { folder: scope.row.id } }"
            >
              {{ scope.row.nums }}篇文章
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="修改时间" width="200" />
        <el-table-column prop="createdAt" label="创建时间" width="200" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" size="small" @click="editRow(scope.row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="deleteRow(scope.row)"
            >
              <template #reference="">
                <el-button type="text" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <FixedDialog
      :title="'id' in row ? '修改目录' : '新增目录'"
      :visiable="'name' in row"
      @cancel="row = {}"
      @confirm="dialogSubmit"
    >
      <template #default="">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="目录名:">
            <el-input v-model="row.name" />
          </el-form-item>
        </el-form>
      </template>
    </FixedDialog>
  </div>
</template>
<script>
// import LyTable from '@/components/LyTable';
import FixedDialog from '@/components/FixedDialog';
import * as http from './api';
export default {
  components: {
    // LyTable,
    FixedDialog,
  },
  data() {
    return {
      mainList: [],
      total: 0,
      row: {},
    };
  },
  mounted() {
    this.getMainList();
  },
  methods: {
    test() {
      console.log(1);
    },
    async getMainList() {
      try {
        const res = await http.selectLabelList();
        if (res.code != 200) {
          // throw new Error('')
        }
        this.mainList = res.data.list.map((item) => {
          return {
            ...item,
            createdAt: this.$formatDate(item.createdAt),
            updatedAt: this.$formatDate(item.updatedAt),
          };
        });
        this.total = res.data.total;
      } catch (e) {
        console.log(e);
        this.$message.error(e);
      }
    },
    addRow() {
      this.row = {
        name: '',
      };
    },
    previewRow(row) {
      this.newLabel = true;
    },
    editRow(row) {
      this.row = { ...row };
    },
    async deleteRow(row) {
      console.log(row);
      try {
        const res = await http.dropLabel(row);
        if (res.code !== 200) {
          this.$message.error(res.msg);
          return;
        }
        this.getMainList();
      } catch (e) {
        console.log(e);
        this.$message.error('删除失败，请稍后重试');
      }
    },
    async dialogSubmit() {
      const value = this.row.name.trim();
      if (!value) {
        this.$message.error('分组名不能为空');
        return false;
      }
      let res;
      try {
        if (this.row.id) {
          res = await http.updateLabel(this.row);
        } else {
          res = await http.insertLabel({
            name: value,
          });
        }
      } catch (e) {
        console.log(e);
        this.$message.error(e.msg);
        return false;
      }
      this.row = {};
      this.getMainList();
    },
  },
};
</script>
<style lang="scss" scoped>
.page_root {
  padding: 10px;
}
</style>
