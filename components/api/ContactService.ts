import BaseApiService from "./BaseAPIService"

class ContactService extends BaseApiService {
    async getContact(params: object): Promise<any> {
        return await this.request(`/admin/contact-us`, 'GET', params)
    }

    async updateContact(projectId: number, params: object): Promise<any> {
        return await this.request(`/admin/contact-us/${projectId}`, 'PUT', params)
    }

    async getWebsiteContact(): Promise<any> {
        return await this.request(`/contact-us`, 'GET')
    }

    async sendContactUs(params: object): Promise<any> {
        return await this.request(`/contact-us/send-email`, 'POST', params)
    }

    async sendSolarInquiry(params: object): Promise<any> {
        return await this.request(`/contact-us/send-solar-inquiry`, 'POST', params)
    }
}

export const contactService = new ContactService()