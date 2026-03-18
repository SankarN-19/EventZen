import { eventApi as eventAxios } from './axiosInstances';

export const createEvent = (data) => eventAxios.post('/events', data);
export const getAllEvents = (params) => eventAxios.get('/events', { params });
export const getEventById = (id) => eventAxios.get(`/events/${id}`);
export const updateEvent = (id, data) => eventAxios.put(`/events/${id}`, data);
export const deleteEvent = (id) => eventAxios.delete(`/events/${id}`);

// Event Requests
export const createEventRequest = (data) => eventAxios.post('/event-requests', data);
export const getMyEventRequests = (userId) => eventAxios.get(`/event-requests/my?userId=${userId}`);
export const getAllEventRequests = (status) => eventAxios.get('/event-requests', { params: status ? { status } : {} });
export const approveEventRequest = (id, adminNote) => eventAxios.put(`/event-requests/${id}/approve`, { adminNote });
export const rejectEventRequest = (id, adminNote) => eventAxios.put(`/event-requests/${id}/reject`, { adminNote });
export const deleteEventRequest = (id) => eventAxios.delete(`/event-requests/${id}`);