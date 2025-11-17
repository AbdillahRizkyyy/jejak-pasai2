import api from './api';

export const destinasiService = {
  getAllDestinasi() {
    return api.get('/api/destinasi');
  },
  getDestinasiById(id) {
    return api.get(`/api/destinasi/${id}`);
  },
  createDestinasi(data) {
    return api.post('/api/destinasi', data);
  },
  updateDestinasi(id, data) {
    return api.put(`/api/destinasi/${id}`, data);
  },
  deleteDestinasi(id) {
    return api.delete(`/api/destinasi/${id}`);
  }
};
