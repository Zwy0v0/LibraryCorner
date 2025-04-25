import axios from 'axios';
import { message } from 'antd';


const request = axios.create({
  baseURL: 'https://n11851287.ifn666.com/assessment02',
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 Authorization Token
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 统一错误处理
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Error caught in interceptor:', error);
    // 判断请求是否有响应返回
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message.error(data.message || 'Request Error');
          break;
        case 401:
          function showNativeAlert(message) {
            console.log(message);
            const tip = document.createElement('div');
            tip.textContent = message;
            tip.style.position = 'fixed';
            tip.style.top = '10px';
            tip.style.left = '50%';
            tip.style.transform = 'translateX(-50%)';
            tip.style.background = '#f0f0f0';
            tip.style.padding = '8px 16px';
            tip.style.borderRadius = '4px';
            document.body.appendChild(tip);

            setTimeout(() => tip.remove(), 3000);
          }
          localStorage.removeItem('token');
          window.location.href = `${import.meta.env.BASE_URL}/login`;
          showNativeAlert('You are not authorized. Please log in.')
          break;
        case 403:
          message.error('No permission to access');
          break;
        case 404:
          message.error('Requested resource not found');
          break;
        case 500:
          message.error('Server Errors');
          break;
        default:
          message.error(data.message || 'Request Failed');
      }
    } else {
      function showNativeAlert(message) {
        console.log(message);
        const tip = document.createElement('div');
        tip.textContent = message;
        tip.style.position = 'fixed';
        tip.style.top = '10px';
        tip.style.left = '50%';
        tip.style.transform = 'translateX(-50%)';
        tip.style.background = '#f0f0f0';
        tip.style.padding = '8px 16px';
        tip.style.borderRadius = '4px';
        document.body.appendChild(tip);

        setTimeout(() => tip.remove(), 3000);
      }
      localStorage.removeItem('token');
      window.location.href = `${import.meta.env.BASE_URL}/login`;
      showNativeAlert('You are not authorized. Please log in.')
    }

    return Promise.reject(error);
  }
);


export default request;
