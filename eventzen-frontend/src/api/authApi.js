import { userApi } from './axiosInstances';

export const registerUser = (data) => userApi.post('/auth/register', data);
export const loginUser = (data) => userApi.post('/auth/login', data);
export const logoutUser = () => userApi.post('/auth/logout');
export const getUserById = (id) => userApi.get(`/users/${id}`);
export const updateUser = (id, data) => userApi.put(`/users/${id}`, data);
export const deleteUser = (id) => userApi.delete(`/users/${id}`);
export const getAllUsers = (page = 0, size = 10) =>
    userApi.get(`/users/all?page=${page}&size=${size}`);