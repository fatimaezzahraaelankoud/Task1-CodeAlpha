import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (username, email, password, password_confirm) =>
        api.post('/register/register/', { username, email, password, password_confirm }),
    
    login: (username, password) =>
        api.post('/token/', { username, password }),
    
    getCurrentUser: () =>
        api.get('/user/me/'),
};

export const taskAPI = {
    getTasks: () => api.get('/tasks/'),
    getTask: (id) => api.get(`/tasks/${id}/`),
    createTask: (data) => api.post('/tasks/', data),
    updateTask: (id, data) => api.patch(`/tasks/${id}/`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
