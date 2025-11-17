import api from './api';

export const galeriService = {
  getAllGaleri() {
    return api.get('/api/galeri');
  },
  getGaleriById(id) {
    return api.get(`/api/galeri/${id}`);
  },
  createGaleri(data) {
    return api.post('/api/galeri', data);
  },
  updateGaleri(id, data) {
    return api.put(`/api/galeri/${id}`, data);
  },
  deleteGaleri(id) {
    return api.delete(`/api/galeri/${id}`);
  }
};
