// In a real-world app, this would be in a .env file
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = (): string | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
};

const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An API error occurred');
        }
        return response.json();
    },

    post: async <T>(endpoint: string, body: object): Promise<T> => {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An API error occurred');
        }
        return response.json();
    },
    
    put: async <T>(endpoint: string, body: object): Promise<T> => {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An API error occurred');
        }
        return response.json();
    },
};

export default api;
