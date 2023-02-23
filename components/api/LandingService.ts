import BaseApiService from "./BaseAPIService"

class LandingService extends BaseApiService {
    async getLanding(params: object): Promise<any> {
        return await this.request(`/admin/landing`, 'GET', params)
    }

    async updateLanding(landingId: number, params: object): Promise<any> {
        return await this.request(`/admin/landing/${landingId}`, 'PUT', params)
    }

    async getWebsiteLanding(): Promise<any> {
        return await this.request(`/landing`, 'GET')
    }
}

export const landingService = new LandingService()