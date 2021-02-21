import http from "@/utils/request";

export function selectLabelList(data) {
  return http.get("/folders", data);
}
export function insertLabel(data) {
  return http.post("/folders", data);
}

export function updateLabel(data) {
  return http.post(`/folders/${data.id}`, data);
}

export function dropLabel(data) {
  return http.delete(`/folders/${data.id}`);
}
