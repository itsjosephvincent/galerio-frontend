import BaseApiService from "./BaseAPIService"

class CareerService extends BaseApiService {
    async getCareers(params: object): Promise<any> {
        return await this.request(`/admin/careers`, 'GET', params)
    }

    async getCareerById(careerId: number): Promise<any> {
        return await this.request(`/admin/careers/${careerId}`, 'GET')
    }

    async saveCareer(params: object): Promise<any> {
        return await this.request(`/admin/careers`, 'POST', params)
    }

    async updateCareer(careerId: number, params: object): Promise<any> {
        return await this.request(`/admin/careers/${careerId}`, 'PUT', params)
    }

    async deleteCareer(careerId: number): Promise<any> {
        return await this.request(`/admin/careers/${careerId}`, 'DELETE')
    }

    async getWebsiteCareers(params: object): Promise<any> {
        return await this.request(`/careers`, 'GET', params)
    }
}

export const careerService = new CareerService()