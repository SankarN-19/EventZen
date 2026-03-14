import { venueApi as venueAxios } from './axiosInstances';

export const createVenue = (data) => venueAxios.post('/venues', data);
export const getAllVenues = (page = 0, size = 10) =>
    venueAxios.get(`/venues/all?page=${page}&size=${size}`);
export const browseVenues = (params) => venueAxios.get('/venues', { params });
export const getVenueById = (id) => venueAxios.get(`/venues/${id}`);
export const updateVenue = (id, data) => venueAxios.put(`/venues/${id}`, data);
export const deleteVenue = (id) => venueAxios.delete(`/venues/${id}`);
export const checkAvailability = (id, from, to) =>
    venueAxios.get(`/venues/${id}/availability`, { params: { from, to } });

export const createVendor = (data) => venueAxios.post('/vendors', data);
export const getAllVendors = () => venueAxios.get('/vendors');
export const updateVendor = (id, data) => venueAxios.put(`/vendors/${id}`, data);
export const deleteVendor = (id) => venueAxios.delete(`/vendors/${id}`);
export const reactivateVenue = (id) => venueAxios.put(`/venues/${id}/reactivate`);