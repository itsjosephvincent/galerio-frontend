import BaseApiService from "./BaseAPIService"

class CertificateService extends BaseApiService {
    async getCertificates(params: object): Promise<any> {
        return await this.request(`/admin/training-certifications`, 'GET', params)
    }

    async getCertificateById(certificateId: number): Promise<any> {
        return await this.request(`/admin/training-certifications/${certificateId}`, 'GET')
    }

    async saveCertificate(params: object): Promise<any> {
        return await this.request(`/admin/training-certifications`, 'POST', params)
    }

    async updateCertificate(certificateId: number, params: object): Promise<any> {
        return await this.request(`/admin/training-certifications/${certificateId}`, 'PUT', params)
    }

    async deleteCertificate(certificateId: number): Promise<any> {
        return await this.request(`/admin/training-certifications/${certificateId}`, 'DELETE')
    }
}

export const certificateService = new CertificateService()