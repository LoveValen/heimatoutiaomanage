import axios from '@/utils/request.js';

// 获取文章列表
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

// 编辑文章
export const editPost = function (id,data) {
  return axios({
    method: 'post',
    url: '/post_update/'+id,
    data
  });
}

// 获取文章详情
export const getPost = function (id) {
  return axios({
    url: '/post/'+id,
  });
}
