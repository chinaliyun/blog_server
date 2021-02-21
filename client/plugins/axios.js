export default function ({ store, redirect, req, res, router, app }) {
  app.$axios.defaults.baseURL = 'http://127.0.0.1:7001'
  // let arr = []
  // for (let item in app) {
  //   arr.push(item)
  // }
  // res.end(JSON.stringify(arr))
}
