import http from '@/utils/request';

export function selectLabelList(data) {
  return http.get('http://127.0.0.1:7001/labels', data);
}
export function insertLabel(data) {
  return http.post('http://127.0.0.1:7001/labels', data);
}

export function updateLabel(data) {
  return http.post(`http://127.0.0.1:7001/labels/${data.id}`, data);
}

export function dropLabel(data) {
  return http.delete(`http://127.0.0.1:7001/labels/${data.id}`);
}
