import { eventApi as eventAxios } from './axiosInstances';

export const createBooking = (data) => eventAxios.post('/bookings', data);
export const getMyBookings = (userId) => eventAxios.get(`/bookings?userId=${userId}`);
export const getBookingById = (id) => eventAxios.get(`/bookings/${id}`);
export const cancelBooking = (id) => eventAxios.put(`/bookings/${id}/cancel`);
export const getAllBookings = () => eventAxios.get('/bookings/admin/bookings');
export const approveBooking = (id) => eventAxios.put(`/bookings/admin/bookings/${id}/approve`);
export const rejectBooking = (id) => eventAxios.put(`/bookings/admin/bookings/${id}/reject`);