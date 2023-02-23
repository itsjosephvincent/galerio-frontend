import BaseApiService from "./BaseAPIService"

class ImageResourceService extends BaseApiService {
    async getImageResources(params: object): Promise<any> {
        return await this.request(`/admin/image-resources`, 'GET', params)
    }

    async getImageResourceById(ImageResourceId: number): Promise<any> {
        return await this.request(`/admin/image-resources/${ImageResourceId}`, 'GET')
    }

    async saveImageResource(params: object): Promise<any> {
        return await this.request(`/admin/image-resources`, 'POST', params)
    }

    async updateImageResource(ImageResourceId: number, params: object): Promise<any> {
        return await this.request(`/admin/image-resources/${ImageResourceId}/update-image-resource`, 'POST', params)
    }

    async deleteImageResource(ImageResourceId: number): Promise<any> {
        return await this.request(`/admin/image-resources/${ImageResourceId}`, 'DELETE')
    }
}

export const imageResourceService = new ImageResourceService()