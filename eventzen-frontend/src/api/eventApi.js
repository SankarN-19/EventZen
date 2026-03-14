import { eventApi as eventAxios } from './axiosInstances';

export const createEvent = (data) => eventAxios.post('/events', data);
export const getAllEvents = (params) => eventAxios.get('/events', { params });
export const getEventById = (id) => eventAxios.get(`/events/${id}`);
export const updateEvent = (id, data) => eventAxios.put(`/events/${id}`, data);
export const deleteEvent = (id) => eventAxios.delete(`/events/${id}`);