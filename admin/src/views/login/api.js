import http from '@/utils/request';
export function login(data) {
  return http.post('http://127.0.0.1:7001/login', data);
}
