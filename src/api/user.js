// import axios from "axios";
import qs from "qs"
import request from "../utils/request";

export async function getUserList(params) {
  const res = await request.get(`/api/users?${qs.stringify(params)}`);
  return res.data
}

export async function userAdd(params) {
  return request.post('/api/users', params)
}

export async function userDelete(id) {
  const res = await request.delete(`/api/users/${id}`);
  return res;
}

export async function getUserById(id) {
  const res = await request.get(`/api/users/${id}`);
  return res.data;
}

export async function updateUser(id, data) {
  return request.put(`/api/users/${id}`, data);
};