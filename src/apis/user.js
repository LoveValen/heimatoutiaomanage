import axios from '@/utils/request.js';

// 用户登录
export const userLogin = function (data) {
  return axios({
    method: 'post',
    url: '/login',
    data
  });
}