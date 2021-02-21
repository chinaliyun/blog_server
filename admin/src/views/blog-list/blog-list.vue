<template>
  <div class="page_root">
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filter.keywords"
            clearable
            @input="keywordsChange"
            placeholder="关键字搜索"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.label_id"
            placeholder="标签"
            clearable
            @change="pageSizeChange()"
          >
            <el-option
              v-for="item in labelDict"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.folder_id"
            placeholder="分类"
            clearable
            @change="pageSizeChange()"
          >
            <el-option
              v-for="item in folderDict"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.status"
            placeholder="状态"
            clearable
            @change="pageSizeChange()"
          >
            <el-option
              v-for="item in statusDict"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRow">
            <router-link :to="{ path: '/editblog' }">新建文章</router-link>
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="mainList">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="标题">
          <template #default="scope">
            <router-link :to="{ path: `/editblog/${scope.row.hash}` }">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="200" />
        <el-table-column prop="updatedAt" label="修改时间" width="200" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" size="small" @click="editRow(scope.row)">
              <router-link :to="{ path: `/editblog/${scope.row.hash}` }">
                编辑
              </router-link>
            </el-button>

            <el-popconfirm
              v-if="scope.row.status == 1"
              title="确定隐藏该文章吗？"
              @onConfirm="hideRow(scope.row)"
            >
              <template #reference="">
                <el-button type="text" size="small">
                  隐藏
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.status == 2"
              title="确定显示该文章吗？"
              @onConfirm="showRow(scope.row)"
            >
              <template #reference="">
                <el-button type="text" size="small">
                  显示
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="filter.pageSize"
          :page-no="filter.pageNo"
          :total="total"
          @size-change="pageSizeChange"
          @current-change="pageNoChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
// import LyTable from '@/components/LyTable';
import * as http from './api';
import { debounce } from 'lodash';
export default {
  components: {
    // LyTable,
  },
  data() {
    return {
      mainList: [],
      labelDict: [],
      folderDict: [],
      statusDict: [
        {
          id: '0',
          name: '未发布',
        },
        {
          id: '1',
          name: '正常',
        },
        {
          id: '2',
          name: '不显示',
        },
      ],
      total: 0,
      row: {},
      filter: {
        keywords: '',
        status: '1',
        label_id: '',
        folder_id: '',
        pageSize: 10,
        pageNo: 1,
      },
    };
  },
  mounted() {
    if (this.$route.query.label) {
      this.filter.label_id = this.$route.query.label;
    }
    if (this.$route.query.folder) {
      this.filter.folder_id = this.$route.query.folder;
    }
    this.getMainList();
    this.getLabelDict();
    this.getFolderDict();
  },
  methods: {
    keywordsChange: debounce(function() {
      this.filter.pageNo = 1;
      this.getMainList();
    }, 1000),
    pageSizeChange(v = 10) {
      this.total = 0;
      this.filter.pageSize = v;
      this.filter.pageNo = 1;
      this.getMainList();
    },
    pageNoChange(v) {
      this.filter.pageNo = v;
      this.getMainList();
    },
    resetFilter() {
      this.filter = {
        keywords: '',
        status: '1',
        label_id: '',
        folder_id: '',
        pageSize: 10,
        pageNo: 1,
      };
    },
    async getMainList() {
      try {
        const res = await http.selectBlogsList(this.filter);
        this.mainList = res.data.list.map((item) => {
          return {
            ...item,
            createdAt: this.$formatDate(item.created_at),
            updatedAt: this.$formatDate(item.updated_at),
          };
        });
        this.total = res.data.total;
      } catch (e) {
        console.log(e);
        this.$message.error(e.msg);
      }
    },
    async getLabelDict() {
      try {
        const res = await http.selectLabelList();
        this.labelDict = res.data.list;
      } catch (e) {
        console.log(e);
        this.$message.error(e.msg);
      }
    },
    async getFolderDict() {
      try {
        const res = await http.selectFolderList();
        this.folderDict = res.data.list;
      } catch (e) {
        console.log(e);
        this.$message.error(e.msg);
      }
    },
    handleClick(row) {
      console.log(row);
    },
    addRow() {
      this.$router.push({
        path: '/newblog',
      });
    },
    previewRow(row) {
      this.$router.push({
        path: `/newblog/${row.hash}`,
      });
    },
    editRow(row) {
      // this.row = { ...row };
      this.$router.push({
        path: `/editblog/${row.hash}`,
      });
    },
    async hideRow(row) {
      try {
        const res = await http.updateBlog({
          ...row,
          status: 2,
          title: row.name,
        });
        if (res.code !== 200) {
          this.$message.error(res.msg);
          return;
        }
        await this.getMainList();
      } catch (e) {
        console.log(e);
        this.$message.error('修改失败，请稍后重试');
      }
    },
    async showRow(row) {
      try {
        const res = await http.updateBlog({
          ...row,
          status: 1,
          title: row.name,
        });
        if (res.code !== 200) {
          this.$message.error(res.msg);
          return;
        }
        await this.getMainList();
      } catch (e) {
        console.log(e);
        this.$message.error('修改失败，请稍后重试');
      }
    },
    async deleteRow(row) {
      try {
        const res = await http.dropBlog(row);
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
  },
};
</script>
<style lang="scss" scoped>
.page_root {
  .pagination {
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
