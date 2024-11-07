
const  baseUrl = 'https://api-tau-teal.vercel.app';
export const urls = {
    getUsers: `${baseUrl}/users`,
    baseUrl: baseUrl,
    getCurrentUser: `${baseUrl}/users/me/`,
    testapi: `${baseUrl}/api_testing/test-api`,
    uploadIndividualAPI: `${baseUrl}/api_management/upload/individual`,
    getUserById: (id: any) => `${baseUrl}/users/${id}`,
    createUser: `${baseUrl}/users/create`,
    loginUser: `${baseUrl}/auth/token`,
    updateUser: (id: any) => `${baseUrl}/users/${id}`,
    deleteUser: (id: any) => `${baseUrl}/users/${id}`
};