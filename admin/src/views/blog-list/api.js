import http from "@/utils/request";

export function selectBlogsList(data) {
  return http.get("/blogs", { params: data });
}

export function updateBlog(data) {
  return http.post(`/blogs/${data.id}`, data);
}

export function dropBlog(data) {
  return http.delete(`/blogs/${data.id}`);
}

export function selectLabelList(data) {
  return http.get("/labels", data);
}

export function selectFolderList(data) {
  return http.get("/folders", data);
}
