import api from "@/lib/api";

export interface CreateBlogData {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    tags?: string[];
    featuredImage?: string;
    status?: 'draft' | 'published';
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    categoryId?: string;
    categories?: string[];
    author?: string;
}

export interface UpdateBlogData {
    title?: string;
    content?: string;
    excerpt?: string;
    slug?: string;
    tags?: string[];
    featuredImage?: string;
    status?: 'draft' | 'published';
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    categories?: string[];
}

const blogApi = {
    // Create a new blog
    createBlog: async (data: CreateBlogData) => {
        const response = await api.post("/blog", data);
        return response;
    },

    // get active blogs 
    getPublishedBlogs: async () => {
        const response = await api.get("/blog/published");
        return response.data;
    },


    // Get all blogs (optionally filtered by status)
    getAllBlogs: async (status?: string) => {
        const url = status ? `/blog?status=${status}` : '/blog';
        const response = await api.get(url);
        return response.data;
    },

    // Get blog by ID
    getBlogById: async (id: string) => {
        const response = await api.get(`/blog/${id}`);
        return response.data;
    },

    // Get blog by slug
    getBlogBySlug: async (slug: string) => {
        const response = await api.get(`/blog/slug/${slug}`);
        return response.data;
    },

    // Update blog
    updateBlog: async (id: string, data: UpdateBlogData) => {
        const response = await api.put(`/blog/${id}`, data);
        return response.data;
    },

    // Delete blog
    deleteBlog: async (id: string) => {
        const response = await api.delete(`/blog/${id}`);
        return response;
    },

    // Increment views
    incrementViews: async (id: string) => {
        const response = await api.post(`/blog/${id}/views`);
        return response;
    }
}

export default blogApi;

