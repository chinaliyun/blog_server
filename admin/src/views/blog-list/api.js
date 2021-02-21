import http from '@/utils/request';

export function selectBlogsList(data) {
  return http.get('http://127.0.0.1:7001/blogs', { params: data });
}

export function updateBlog(data) {
  return http.post(`http://127.0.0.1:7001/blogs/${data.id}`, data);
}

export function dropBlog(data) {
  return http.delete(`http://127.0.0.1:7001/blogs/${data.id}`);
}

export function selectLabelList(data) {
  return http.get('http://127.0.0.1:7001/labels', data);
}

export function selectFolderList(data) {
  return http.get('http://127.0.0.1:7001/folders', data);
}
