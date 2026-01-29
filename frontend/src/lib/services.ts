import api from './api';

// Types
export interface Project {
    id: string;
    slug: string;
    status: string;
    goalAmount: number;
    collectedAmount: number;
    donorCount: number;
    featuredImage?: string;
    isUrgent: boolean;
    isFeatured: boolean;
    translations: ProjectTranslation[];
}

export interface ProjectTranslation {
    language: string;
    title: string;
    description: string;
    shortDesc?: string;
}

export interface Campaign {
    id: string;
    slug: string;
    status: string;
    goalAmount: number;
    collectedAmount: number;
    startDate: string;
    endDate: string;
    isUrgent: boolean;
    translations: CampaignTranslation[];
}

export interface CampaignTranslation {
    language: string;
    title: string;
    description: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Projects API
export const projectsApi = {
    getAll: async (params?: { lang?: string; page?: number; limit?: number; isUrgent?: boolean }) => {
        const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params });
        return data;
    },

    getBySlug: async (slug: string, lang?: string) => {
        const { data } = await api.get<Project>(`/projects/slug/${slug}`, { params: { lang } });
        return data;
    },

    getById: async (id: string, lang?: string) => {
        const { data } = await api.get<Project>(`/projects/${id}`, { params: { lang } });
        return data;
    },

    getStats: async () => {
        const { data } = await api.get('/projects/stats');
        return data;
    },
};

// Campaigns API
export const campaignsApi = {
    getAll: async (params?: { lang?: string; page?: number; limit?: number }) => {
        const { data } = await api.get<PaginatedResponse<Campaign>>('/campaigns', { params });
        return data;
    },

    getActive: async () => {
        const { data } = await api.get<Campaign[]>('/campaigns/active');
        return data;
    },

    getBySlug: async (slug: string, lang?: string) => {
        const { data } = await api.get<Campaign>(`/campaigns/slug/${slug}`, { params: { lang } });
        return data;
    },
};

// Donations API
export const donationsApi = {
    create: async (donation: {
        amount: number;
        paymentMethod: string;
        projectId?: string;
        campaignId?: string;
        donorName?: string;
        donorEmail?: string;
        donorPhone?: string;
        isAnonymous?: boolean;
        message?: string;
    }) => {
        const { data } = await api.post('/donations', donation);
        return data;
    },

    confirm: async (donationId: string, reference: string, provider: string) => {
        const { data } = await api.post(`/donations/${donationId}/confirm`, { reference, provider });
        return data;
    },

    getStats: async () => {
        const { data } = await api.get('/donations/stats');
        return data;
    },

    getRecent: async (params?: { page?: number; limit?: number }) => {
        const { data } = await api.get('/donations', { params });
        return data;
    },

    getMyDonations: async () => {
        const { data } = await api.get('/donations/my-donations');
        return data;
    },
};

// Auth API
// Users API
export const usersApi = {
    getAll: async (params?: { search?: string; role?: string; page?: number; limit?: number }) => {
        const { data } = await api.get('/users', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/users/${id}`);
        return data;
    },

    create: async (userData: {
        email?: string;
        phone?: string;
        password: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }) => {
        const { data } = await api.post('/users', userData);
        return data;
    },

    update: async (id: string, userData: {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        isActive?: boolean;
    }) => {
        const { data } = await api.put(`/users/${id}`, userData);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    },

    getStats: async () => {
        const { data } = await api.get('/users/stats');
        return data;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const { data } = await api.post('/users/me/change-password', { currentPassword, newPassword });
        return data;
    },

    updateProfile: async (profileData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }) => {
        const { data } = await api.put('/users/me', profileData);
        return data;
    },

    forgotPassword: async (identifier: string) => {
        const { data } = await api.post('/users/forgot-password', { identifier });
        return data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const { data } = await api.post('/users/reset-password', { token, newPassword });
        return data;
    },
};

// Contacts API
export const contactsApi = {
    submit: async (contactData: {
        name: string;
        email: string;
        phone?: string;
        subject?: string;
        message: string;
    }) => {
        const { data } = await api.post('/contacts', contactData);
        return data;
    },

    getAll: async (params?: { isRead?: boolean; page?: number; limit?: number }) => {
        const { data } = await api.get('/contacts', { params });
        return data;
    },

    markAsRead: async (id: string) => {
        const { data } = await api.put(`/contacts/${id}/read`);
        return data;
    },

    reply: async (id: string, message: string) => {
        const { data } = await api.post(`/contacts/${id}/reply`, { message });
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/contacts/${id}`);
        return data;
    },

    getStats: async () => {
        const { data } = await api.get('/contacts/stats');
        return data;
    },

    subscribeNewsletter: async (email: string) => {
        const { data } = await api.post('/contacts/newsletter/subscribe', { email });
        return data;
    },

    unsubscribeNewsletter: async (email: string) => {
        const { data } = await api.post('/contacts/newsletter/unsubscribe', { email });
        return data;
    },
};

// Contents API (Articles, Events, Pages)
export const contentsApi = {
    getAll: async (params?: { type?: string; lang?: string; isPublished?: boolean; page?: number; limit?: number }) => {
        const { data } = await api.get('/contents', { params });
        return data;
    },

    getBySlug: async (slug: string, lang?: string) => {
        const { data } = await api.get(`/contents/slug/${slug}`, { params: { lang } });
        return data;
    },

    getArticles: async (lang?: string, limit?: number) => {
        const { data } = await api.get('/contents/articles', { params: { lang, limit } });
        return data;
    },

    getEvents: async (lang?: string) => {
        const { data } = await api.get('/contents/events', { params: { lang } });
        return data;
    },

    create: async (contentData: {
        slug: string;
        type: string;
        featuredImage?: string;
        isPublished?: boolean;
        translations: Array<{
            language: string;
            title: string;
            body: string;
            excerpt?: string;
        }>;
    }) => {
        const { data } = await api.post('/contents', contentData);
        return data;
    },

    update: async (id: string, contentData: {
        slug?: string;
        featuredImage?: string;
        isPublished?: boolean;
        translations?: Array<{
            language: string;
            title: string;
            body: string;
            excerpt?: string;
        }>;
    }) => {
        const { data } = await api.put(`/contents/${id}`, contentData);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/contents/${id}`);
        return data;
    },
};

// Products API
export const productsApi = {
    getAll: async (params?: { search?: string; categoryId?: string; lang?: string; isActive?: boolean; page?: number; limit?: number }) => {
        const { data } = await api.get('/products', { params });
        return data;
    },

    getBySlug: async (slug: string, lang?: string) => {
        const { data } = await api.get(`/products/slug/${slug}`, { params: { lang } });
        return data;
    },

    getCategories: async (lang?: string) => {
        const { data } = await api.get('/products/categories', { params: { lang } });
        return data;
    },
};

export const authApi = {
    login: async (identifier: string, password: string) => {
        const { data } = await api.post('/auth/login', { identifier, password });
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data;
    },

    register: async (userData: {
        email?: string;
        phone?: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }) => {
        const { data } = await api.post('/auth/register', userData);
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getProfile: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },
};
