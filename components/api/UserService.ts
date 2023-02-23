import BaseApiService from "./BaseAPIService"

class UserService extends BaseApiService {
    async getUsers(params: object): Promise<any> {
        return await this.request(`/admin/control`, 'GET', params)
    }

    async getUserById(userId: number): Promise<any> {
        return await this.request(`/admin/control/${userId}`, 'GET')
    }

    async saveUser(params: object): Promise<any> {
        return await this.request(`/admin/control`, 'POST', params)
    }

    async updateUser(userId: number, params: object): Promise<any> {
        return await this.request(`/admin/control/${userId}`, 'PUT', params)
    }

    async updateUserImage(userId: number, params: object): Promise<any> {
        return await this.request(`/admin/control/${userId}/update-admin-image`, 'POST', params)
    }
}

export const userService = new UserService()