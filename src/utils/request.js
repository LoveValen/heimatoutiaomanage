import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:3000';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (localStorage.getItem('managetoken')) {
    config.headers.Authorization = localStorage.getItem('managetoken');
  }
  // console.log(config);
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export default axios;