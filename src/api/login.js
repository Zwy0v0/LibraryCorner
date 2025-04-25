import request from "../utils/request";

export async function Login(params) {
  const res = await request.post('/api/login', params);
  if (res?.data?.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem("userInfo", JSON.stringify(res.data.data));
  }
  return res;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  window.location.href = `${import.meta.env.BASE_URL}/login`;
}