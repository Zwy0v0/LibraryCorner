// import axios from "axios";
import qs from "qs"
import request from "../utils/request";

export async function getBookList(params) {
  const res = await request.get(`/api/books?${qs.stringify(params)}`);
  return res.data
}

export async function bookAdd(params) {
  return request.post('/api/books', params)
}

export async function bookDelete(id) {
  // return request.delete(`/api/books/${id}`)
  const res = await request.delete(`/api/books/${id}`);
  // console.log('delete 接口返回值：', res);
  return res;
}

export async function getBookById(id) {
  const res = await request.get(`/api/books/${id}`);
  return res.data;
}

export async function bookUpdate(id, params) {
  const res = await request.put(`/api/books/${id}`, params);
  return res.data;
}