<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
div {
  box-sizing: border-box;
}
.el-table--small th,
.el-table--small td {
  padding: 4px 0;
}
.page_root {
  padding: 10px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}
</style>
