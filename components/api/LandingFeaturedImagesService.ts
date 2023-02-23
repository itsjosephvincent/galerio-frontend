import BaseApiService from "./BaseAPIService"

class LandingFeaturedImagesService extends BaseApiService {
    async getLandingFeaturedImages(params: object): Promise<any> {
        return await this.request(`/admin/featured-images`, 'GET', params)
    }

    async getLandingFeaturedImageById(featuredImageId: number): Promise<any> {
        return await this.request(`/admin/featured-images/${featuredImageId}`, 'GET')
    }

    async saveLandingFeaturedImage(params: object): Promise<any> {
        return await this.request(`/admin/featured-images`, 'POST', params)
    }

    async updateLandingFeaturedImage(featuredImageId: number, params: object): Promise<any> {
        return await this.request(`/admin/featured-images/${featuredImageId}`, 'POST', params)
    }

    async deleteLandingFeaturedImage(featuredImageId: number): Promise<any> {
        return await this.request(`/admin/featured-images/${featuredImageId}`, 'DELETE')
    }

    async getWebsiteLandingFeaturedImages(): Promise<any> {
        return await this.request(`/landing-featured-images`, 'GET')
    }
}

export const landingFeaturedImagesService = new LandingFeaturedImagesService()