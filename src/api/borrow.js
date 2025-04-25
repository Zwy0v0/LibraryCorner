// import axios from "axios";
import qs from "qs"
import request from "../utils/request";

export async function getBorrowList(params) {
  const res = await request.get(`/api/borrows?${qs.stringify(params)}`);
  return res.data
}

export async function borrowAdd(params) {
  return request.post('/api/borrows', params)
}

export async function borrowDelete(id) {
  const res = await request.delete(`/api/borrows/${id}`);
  return res;
}

export async function updateBorrow(id) {
  return request.put(`/api/borrows/back/${id}`);
};