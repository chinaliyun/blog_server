import http from '@/utils/request';

export function selectFolderList(data) {
  return http.get('http://127.0.0.1:7001/folders', data);
}

export function selectLabelList(data) {
  return http.get('http://127.0.0.1:7001/labels', data);
}

export function insertBlog(data) {
  return http.post('http://127.0.0.1:7001/blogs', data);
}

export function updateBlog(data) {
  return http.post(`http://127.0.0.1:7001/blogs/${data.id}`, data);
}
export function uploadFile(data) {
  return http.post(`http://127.0.0.1:7001/upload`, data);
}

export function selectBlogOne(data) {
  return http.get(`http://127.0.0.1:7001/blogs/${data.id}`, data);
}
