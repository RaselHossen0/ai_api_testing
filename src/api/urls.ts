
const  baseUrl = 'https://api-tau-teal.vercel.app';
export const urls = {
    getUsers: `${baseUrl}/users`,
    baseUrl: baseUrl,
    getCurrentUser: `${baseUrl}/users/me`,
    getUserById: (id) => `${baseUrl}/users/${id}`,
    createUser: `${baseUrl}/users/create`,
    loginUser: `${baseUrl}/auth/token`,
    updateUser: (id) => `${baseUrl}/users/${id}`,
    deleteUser: (id) => `${baseUrl}/users/${id}`
};