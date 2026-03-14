import axios from 'axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApi = axios.create({ baseURL: 'http://localhost:8081' });
export const venueApi = axios.create({ baseURL: 'http://localhost:8082' });
export const eventApi = axios.create({ baseURL: 'http://localhost:8083' });

// Attach token to every request automatically
[venueApi, eventApi].forEach(instance => {
    instance.interceptors.request.use(config => {
        config.headers = { ...config.headers, ...getAuthHeader() };
        return config;
    });
});

userApi.interceptors.request.use(config => {
    config.headers = { ...config.headers, ...getAuthHeader() };
    return config;
});