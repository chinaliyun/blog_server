<template>
  <div class="component_root">
    <div class="beian">
      <a href="https://beian.miit.gov.cn/" target="_blank">{{ beian }}</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      beian: '',
    }
  },
  mounted() {
    if (/chinaliyun/.test(location.host)) {
      this.beian = '豫ICP备15028363号-1'
    } else {
      this.beian = '豫ICP备15028363号-2'
    }
  },
}
</script>

<style lang="scss" scoped>
.beian {
  padding: 20px 0;
  text-align: center;
}
</style>
