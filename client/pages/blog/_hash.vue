<template>
  <div class="page_root">
    <div class="section">
      <div class="left">
        <div class="card">
          <!-- <div v-html="detail.content"></div> -->
          <h1 class="title">{{ detail.name }}</h1>
          <div class="info">
            <div class="time">
              创建时间：{{ formatDate(detail.created_at) }}
            </div>
            <div class="count">阅读：{{ detail.view_count }}</div>
          </div>
          <div class="md-body">
            <markdown-it-vue :content="html" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="card">
          <div class="around_blog">
            上一篇:
            <span v-if="!prev">没有了</span>
            <NuxtLink v-if="prev" :to="`/blog/${prev.hash}`">
              {{ prev.name }}
            </NuxtLink>
          </div>
          <div class="around_blog">
            下一篇:
            <span v-if="!next">没有了</span>
            <NuxtLink v-if="next" :to="`/blog/${next.hash}`">
              {{ next.name }}
            </NuxtLink>
          </div>
        </div>
        <div class="card">
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
// eslint-disable-next-line vue/no-v-html

import 'markdown-it-vue/dist/markdown-it-vue.css'
import 'highlight.js/scss/default.scss'
import moment from 'moment'
// import 'highlight.js/scss/arta.scss'
// import 'highlight.js/scss/nord.scss'
// import 'highlight.js/scss/ascetic.scss'
export default {
  components: {},
  async asyncData({ $axios, params, store }) {
    const data = {}
    try {
      const { data: res } = await $axios.get(`/blogs/${params.hash}`)
      if (res.code === 200) {
        data.detail = res.data.blog
        data.prev = res.data.prev
        data.next = res.data.next
        // 所有老文章中的案例，全部替换为空字符串，不再展示链接
        data.detail.content = res.data.blog.content
          .replace(
            /\.\/images\/((.*?)\.(png|jpg|gif|jpeg))/g,
            `http://127.0.0.1:7001/static/blogs/${res.data.blog.hash}/images/$1`
          )
          .replace(/(\[.*?\])\(\.\/demo(\/.*?\.html\))/g, ``)
      }
    } catch (e) {}

    try {
      const res = await $axios.$get('/blogs')
      if (res.code === 200) {
        data.allList = res.data.list
        store.commit('changeCounter', res.data.total)
      }
    } catch (e) {}
    return data
  },
  data() {
    return {
      detail: {
        name: '',
        conent: '',
      },
      html: '',
      allList: [],
    }
  },
  // head() {
  //   return {
  //     title: this.detail.title,
  //     meta: [
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: 'My custom description',
  //       },
  //     ],
  //   }
  // },
  mounted() {
    this.html = this.detail.content
  },
  methods: {
    formatDate(v) {
      return moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>
<style lang="scss" scoped>
.page_root {
  padding-bottom: 100px;
  .section {
    display: flex;
  }
  .left {
    flex-grow: 1;
    padding: 10px;
    width: 100px;
    .title {
      padding: 20px 0;
    }
    .info {
      border-bottom: 4px solid $color-border;
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: rgb(161, 161, 161);
      display: flex;
      .time {
        margin-right: 40px;
      }
    }
  }
  .right {
    width: 400px;
    flex-shrink: 0;
    padding: 10px;
    @media (max-width: 1200px) {
      display: none;
    }
    .around_blog {
      padding: 6px 0;
    }
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
    .list_title {
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 4px solid $color-border;
      padding-bottom: 10px;
    }
  }
}
</style>
