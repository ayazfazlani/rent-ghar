import api from "@/lib/api";

export interface CementRateData {
  _id?: string;
  brand: string;
  slug?: string;
  title?: string;
  price: number;
  change?: number;
  city: string;
  weightKg?: number;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCementRateData {
  brand: string;
  price: number;
  change?: number;
  city: string;
  weightKg?: number;
  category?: string;
  title?: string;
  isActive?: boolean;
}

const cementRateApi = {
  // Get all rates (admin — includes inactive)
  getAllRates: async () => {
    const response = await api.get("/cement-rate/admin/all");
    return response.data as CementRateData[];
  },

  // Get a single rate by ID
  getRateById: async (id: string) => {
    const response = await api.get(`/cement-rate/${id}`);
    return response.data as CementRateData;
  },

  // Create a new rate
  createRate: async (data: CreateCementRateData) => {
    const response = await api.post("/cement-rate", data);
    return response.data as CementRateData;
  },

  // Update a rate
  updateRate: async (id: string, data: Partial<CreateCementRateData>) => {
    const response = await api.put(`/cement-rate/${id}`, data);
    return response.data as CementRateData;
  },

  // Delete a rate
  deleteRate: async (id: string) => {
    const response = await api.delete(`/cement-rate/${id}`);
    return response;
  },
};

export default cementRateApi;
