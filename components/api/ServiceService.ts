import BaseApiService from "./BaseAPIService"

class ServiceService extends BaseApiService {
    async getServices(params: object): Promise<any> {
        return await this.request(`/admin/services`, 'GET', params)
    }

    async getServiceById(serviceId: number): Promise<any> {
        return await this.request(`/admin/services/${serviceId}`, 'GET')
    }

    async saveService(params: object): Promise<any> {
        return await this.request(`/admin/services`, 'POST', params)
    }

    async updateService(serviceId: number, params: object): Promise<any> {
        return await this.request(`/admin/services/${serviceId}`, 'PUT', params)
    }

    async updateServiceThumbnailImage(serviceId: number, params: object): Promise<any> {
        return await this.request(`/admin/services/${serviceId}/update-service-icon`, 'POST', params)
    }

    async deleteService(serviceId: number): Promise<any> {
        return await this.request(`/admin/services/${serviceId}`, 'DELETE')
    }

    async getWebsiteServices(): Promise<any> {
        return await this.request(`/services`, 'GET')
    }

    async getWebsiteServiceBySlug(slug: string): Promise<any> {
        return await this.request(`/services/${slug}`, 'GET')
    }
}

export const serviceService = new ServiceService()