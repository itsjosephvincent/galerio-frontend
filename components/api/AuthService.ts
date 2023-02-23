import BaseAPIService from './BaseAPIService'

class AuthService extends BaseAPIService {
    async login(params: object): Promise<any> {
        return await this.request(`/admin/auth/login`, 'POST', params)
    }

    async logout(): Promise<any> {
        return await this.request(`/admin/logout`, 'POST')
    }

    async forgotPassword(params: object): Promise<any> {
        return await this.request(`/admin/forgot-password`, 'POST', params)
    }

    async verifyResetPassword(params: object): Promise<any> {
        return await this.request(`/admin/verify-reset-password`, 'POST', params)
    }

    async resetPassword(params: object): Promise<any> {
        return await this.request(`/admin/reset-password`, 'POST', params)
    }
}

export const authService = new AuthService()
