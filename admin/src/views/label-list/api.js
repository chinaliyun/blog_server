import http from "@/utils/request";

export function selectLabelList(data) {
  return http.get("/labels", data);
}
export function insertLabel(data) {
  return http.post("/labels", data);
}

export function updateLabel(data) {
  return http.post(`/labels/${data.id}`, data);
}

export function dropLabel(data) {
  return http.delete(`/labels/${data.id}`);
}
