<template>
  <div class="page_root">
    <div class="section">
      <div class="left">
        <div class="card search_card">
          <div class="input_wrapper">
            <input
              v-model.trim="filter.keywords"
              class="input"
              type="text"
              placeholder="输入关键字搜索"
              @input="keywordChange"
              @blur="searchResultList.msg = ''"
            />
            <div
              v-if="filter.keywords !== ''"
              class="clear"
              @click="clearKeywords"
            >
              <svg
                t="1612486885832"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4740"
                width="48"
                height="48"
              >
                <path
                  d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-960a448 448 0 1 0 0 896 448 448 0 0 0 0-896z m45.454 448.17L693.02 647.738a32.028 32.028 0 0 1-45.283 45.283L512.17 557.454 375.637 693.988a32.256 32.256 0 0 1-45.568-45.682l136.534-136.534L330.98 376.263a31.972 31.972 0 1 1 45.283-45.283L511.83 466.546l137.5-137.5a32.256 32.256 0 1 1 45.626 45.624l-137.5 137.5z"
                  p-id="4741"
                  fill="#cdcdcd"
                ></path>
              </svg>
            </div>
          </div>
          <div v-if="searchResultList.msg" class="msg">
            {{ searchResultList.msg }}
          </div>
          <div
            v-if="searchResultList.list.length !== 0"
            class="list search_list"
          >
            <div
              v-for="item in searchResultList.list"
              :key="item.id"
              class="item"
            >
              <div class="link">
                <NuxtLink :to="{ path: `/blog/${item.hash}` }">
                  {{ item.name }}
                </NuxtLink>
              </div>
              <div class="time">{{ formatDate(item.created_at) }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="tab_list">
            <div
              v-for="item in folderDict"
              :key="item.id"
              class="tab"
              :class="{ active: currentFolderType === item.id }"
              @click="changeFolderType(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="list">
            <div
              v-for="item in folderBlogList.list"
              :key="item.id"
              class="item"
            >
              <div class="link">
                <NuxtLink :to="{ path: `/blog/${item.hash}` }">
                  {{ item.name }}
                </NuxtLink>
              </div>
              <div class="time">{{ formatDate(item.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="card new_card">
          <div class="list">
            <div class="list_title">最新文章</div>
            <div v-for="item in allList" :key="item.hash" class="item">
              <NuxtLink :to="`/blog/${item.hash}`">
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import moment from 'moment'
export default {
  async asyncData({ $axios, store }) {
    const data = {}
    try {
      const res = await $axios.$get('/blogs')
      if (res.code === 200) {
        data.allList = res.data.list
        store.commit('changeCounter', res.data.total)
      }
    } catch (e) {}
    try {
      const res = await $axios.$get('/folders')
      if (res.code === 200) {
        data.folderDict = res.data.list.filter((item) => {
          return item.id !== 1
        })
      }
    } catch (e) {}

    try {
      const res = await $axios.$get('/blogs', {
        params: {
          folder_id: data.folderDict[0].id,
          pageSize: 20,
        },
      })
      data.folderBlogList = {}
      if (res.code === 200) {
        data.folderBlogList.list = res.data.list
        data.folderBlogList.total = res.data.total
      }
    } catch (e) {}

    return data
  },
  data() {
    return {
      allList: [],
      folderBlogList: {
        list: [],
        total: 0,
      },
      folderDict: [],
      filter: {
        keywords: '',
      },
      searchResultList: {
        list: [],
        total: 0,
        msg: '',
      },
      currentFolderType: 2,
    }
  },
  methods: {
    formatDate(v) {
      return moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
    keywordChange: debounce(function () {
      this.getFilterList()
    }, 1000),
    clearKeywords() {
      this.filter.keywords = ''
      this.searchResultList.list = []
      this.searchResultList.total = 0
    },
    async getFilterList() {
      this.searchResultList.msg = '...'
      try {
        const { data: res } = await this.$axios.get('/blogs', {
          params: {
            keywords: this.filter.keywords,
          },
        })
        if (res.code !== 200 || res.data.list.length === 0) {
          this.searchResultList.msg = '没有找到相关文章'
          return false
        }
        this.searchResultList.msg = ''
        this.searchResultList.list = res.data.list
        this.searchResultList.total = res.data.total
      } catch (e) {}
    },
    async changeFolderType(v) {
      this.currentFolderType = v
      try {
        const res = await this.$axios.$get('/blogs', {
          params: {
            folder_id: this.currentFolderType,
            pageSize: 20,
          },
        })
        if (res.code === 200) {
          this.folderBlogList.list = res.data.list
          this.folderBlogList.total = res.data.total
        }
      } catch (e) {}
    },
  },
}
</script>
<style lang="scss" scoped>
.page_root {
  .list {
    .item {
      padding: 6px 0;
      display: flex;
      align-items: center;
      transition: all 0.2s linear;
      .link {
        flex-grow: 1;
      }
      .time {
        font-size: 14px;
        color: lighten($color-text, 20%);
      }
    }
  }
  .section {
    display: flex;
    .left {
      flex-grow: 1;
      padding: 10px;
      .search_card {
        transition: all 1s linear;
        .input_wrapper {
          display: flex;
          position: relative;
          .input {
            flex-grow: 1;
            border-color: white;
            &:focus {
              border-color: $color-border;
            }
          }
          .clear {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            cursor: pointer;
            svg {
              display: block;
              height: 50%;
            }
          }
        }
        .msg {
          padding: 10px;
          color: lighten($color-border, 16%);
        }
        .list {
          padding: 10px;
        }
      }
    }
    .right {
      width: 400px;
      padding: 10px;
      @media (max-width: 1200px) {
        display: none;
      }
    }
  }

  .list_title {
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 4px solid $color-border;
    padding-bottom: 10px;
  }
  .tab_list {
    display: flex;
    border-bottom: 4px solid $color-border;
    margin-bottom: 10px;
    .tab {
      color: lighten($color-text, 20%);
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s linear;
      &:hover {
        color: $color-text;
      }
      &.active {
        color: $color-text;
        font-weight: bold;
      }
    }
  }
}
</style>
