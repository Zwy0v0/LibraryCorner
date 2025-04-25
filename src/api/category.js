// import axios from "axios";
import qs from "qs"
import request from "../utils/request";

export async function getCategoryList(params) {
  const res = await request.get(`/api/categories?${qs.stringify(params)}`);
  return res.data
}

export async function CategoryAdd(params) {
  return request.post('/api/categories', params)
}

export async function categoryDelete(id) {
  return request.delete(`/api/categories/${id}`)
}

export async function getCategoryById(id) {
  const res = await request.get(`/api/categories/${id}`);
  return res.data;
}

export async function categoryUpdate(id, params) {
  const res = await request.put(`/api/categories/${id}`, params);
  return res.data;
}