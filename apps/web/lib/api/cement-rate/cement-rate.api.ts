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
  image?: string;
  description?: string;
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
  image?: string;
  description?: string;
  isActive?: boolean;
}

const cementRateApi = {
  // Get all rates (admin — includes inactive)
  getAllRates: async () => {
    const response = await api.get("/cement-rate/admin/all");
    return response.data as CementRateData[];
  },

  // Get public active rates
  getPublicRates: async (city?: string, category?: string) => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    const url = params.toString() ? `/cement-rate?${params.toString()}` : '/cement-rate';
    const response = await api.get(url);
    return response.data as CementRateData[];
  },

  // Get a single rate by ID
  getRateById: async (id: string) => {
    const response = await api.get(`/cement-rate/${id}`);
    return response.data as CementRateData;
  },

  // Get a single rate by slug (public detail page)
  getRateBySlug: async (slug: string) => {
    const response = await api.get(`/cement-rate/slug/${slug}`);
    return response.data as CementRateData;
  },

  // Create a new rate — sends FormData so image can be included
  createRate: async (formData: FormData) => {
    const response = await api.post("/cement-rate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as CementRateData;
  },

  // Update a rate — sends FormData so image can be included
  updateRate: async (id: string, formData: FormData) => {
    const response = await api.put(`/cement-rate/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as CementRateData;
  },

  // Delete a rate
  deleteRate: async (id: string) => {
    const response = await api.delete(`/cement-rate/${id}`);
    return response;
  },
};

export default cementRateApi;
