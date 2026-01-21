import api from '../../api'

export interface CreateAreaData {
  name: string;
  city: string; // City ID
}

export const areaApi = {
  create: async (data: CreateAreaData) => {
    const response = await api.post('/areas', data);
    return response.data;
  },
  
  getAll: async (cityId?: string) => {
    const url = cityId ? `/areas?cityId=${cityId}` : '/areas';
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },
  
  update: async (id: string, data: Partial<CreateAreaData>) => {
    const response = await api.put(`/areas/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },
};

export default areaApi;
