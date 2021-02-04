import axios from '@/utils/request.js';

export const getCategories = function () {
  return axios({
    url: '/category',
  });
}