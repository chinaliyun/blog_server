<template>
  <div class="component_root">
    <div class="section">
      <div class="logo_wrapper">
        <NuxtLink to="/">
          <Logo />
        </NuxtLink>
      </div>
      <div class="power">
        <span>Frontend Power By</span>
        <a href="https://nuxtjs.org/docs/2.x/get-started/installation">
          Nuxt@2.14.12
        </a>
      </div>
      <div class="counter">
        Counter:
        <a href="javascript:void(0)">
          {{ counter }}
          <span class="zh">篇文章</span>
        </a>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['counter']),
  },
}
</script>
<style lang="scss" scoped>
.component_root {
  //   color: $color-primary;
  .section {
    display: flex;
    align-items: flex-end;
    padding: 30px 10px 10px 10px;
  }
  .counter {
    margin-left: 10px;
    .zh {
      font-size: 14px;
    }
  }

  .line {
    height: 20px;
    background-color: rgba(0, 0, 0, 0.527);
  }
}
</style>
