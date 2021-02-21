import http from "@/utils/request";

export function selectFolderList(data) {
  return http.get("/folders", data);
}

export function selectLabelList(data) {
  return http.get("/labels", data);
}

export function insertBlog(data) {
  return http.post("/blogs", data);
}

export function updateBlog(data) {
  return http.post(`/blogs/${data.id}`, data);
}
export function uploadFile(data) {
  return http.post(`/upload`, data);
}

export function selectBlogOne(data) {
  return http.get(`/blogs/${data.id}`, data);
}
