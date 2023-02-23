import BaseApiService from "./BaseAPIService"

class AboutUsService extends BaseApiService {
    async getAboutUs(params: object): Promise<any> {
        return await this.request(`/admin/about`, 'GET', params)
    }

    async updateAboutUs(aboutUsId: number, params: object): Promise<any> {
        return await this.request(`/admin/about/${aboutUsId}`, 'PUT', params)
    }

    async getWebsiteAboutUs(): Promise<any> {
        return await this.request(`/about`, 'GET')
    }
}

export const aboutUsService = new AboutUsService()