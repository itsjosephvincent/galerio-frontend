import BaseApiService from "./BaseAPIService"

class LogService extends BaseApiService {
    async getLogs(params: object): Promise<any> {
        return await this.request(`/admin/logs`, 'GET', params)
    }

    async getLogsByStoreId(storeId: number, params: object): Promise<any> {
        return await this.request(`/admin/stores/${storeId}/logs`, 'GET', params)
    }
}

export const logService = new LogService()