
const  baseUrl = 'http://aiapi.raselhossen.tech';

export const urls = {
    getUsers: `${baseUrl}/users`,
    baseUrl: baseUrl,
    getCurrentUser: `${baseUrl}/users/me/`,
    testapi: `${baseUrl}/api_testing/test-api`,
    uploadIndividualAPI: `${baseUrl}/api_testing_save/test-api`,
    getUserById: (id: any) => `${baseUrl}/users/${id}`,
    createUser: `${baseUrl}/users/create`,
    loginUser: `${baseUrl}/auth/token`,
    updateUser: (id: any) => `${baseUrl}/users/${id}`,
    deleteUser: (id: any) => `${baseUrl}/users/${id}`
};