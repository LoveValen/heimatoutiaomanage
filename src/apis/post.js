import axios from '@/utils/request.js';

export const getPostList = function (params) {
  return axios({
    url: '/post',
    params
  });
};

// 添加文章
export const addPostList = function (data) {
  return axios({
    method: 'post',
    url: '/post',
    data
  });
}
