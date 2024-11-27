import axios from 'axios';

// Base URL pour l'API
const API_BASE_URL = 'http://localhost:8090';

// Configuration d'axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gestion des erreurs via les interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// Fetcher pour SWR
export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// Endpoints consolidés
export const endpoints = {
  authentication: {
    login: '/authenticate',
    register: '/register',
    me: '/me',
  },
  articles: {
    updateArticle: (id) => `/articles/${id}`,
    getAllArticles: '/articles',
    addArticle: '/articles',
    getArticleById: (id) => `/articles/${id}`,
    deleteArticle: (id) => `/articles/${id}`,
    postProduct: '/api/Product/add',
  },
  categories: {
    updateCategory: (id) => `/categories/${id}`,
    getAllCategory: '/categories',
    addCategory: '/categories',
    getCategory: (id) => `/categories/${id}`,
    deleteCategory: (id) => `/categories/${id}`,
  },
  age: {
    updateAge: (id) => `/age/${id}`,
    getAllAge: '/age',
    addAge: '/age',
    getAge: (id) => `/age/${id}`,
    deleteAge: (id) => `/age/${id}`,
  },
  commentaire: {
    updateComment: (id) => `/commentaire/${id}`,
    getAllComment: '/commentaire',
    addComment: '/commentaire',
    getCommentById: (id) => `/commentaire/${id}`,
    deleteComment: (id) => `/commentaire/${id}`,
  },
  chat: {
    send: '/api/chat/send',
    get: '/api/chat/get',
  },
  default: {
    textSuccess: '/textSuccess',
    textNotFound: '/textNotFound',
    textError: '/textError',
  },
  user: {
    updateUser: (id) => `/user/${id}`,
    getAllUser: '/user',
    addUser: '/user',
    getUserById: (id) => `/user/${id}`,
    deleteUser: (id) => `/user/${id}`,
  },
};
