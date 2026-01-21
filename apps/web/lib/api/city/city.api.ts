import api from '../../api'

export interface CreateCityData {
  name: string;
  state?: string;
  country?: string;
}

export interface UpdateCityData {
  name?: string;
  state?: string;
  country?: string;
}

export const cityApi = {
  create: async (data: CreateCityData) => {
    const response = await api.post('/cities', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/cities');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },
  
  update: async (id: string, data: UpdateCityData) => {
    const response = await api.put(`/cities/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
  },
};

export default cityApi;