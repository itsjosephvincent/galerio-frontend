import BaseApiService from "./BaseAPIService"

class TraineeService extends BaseApiService {
    async getTrainees(params: object): Promise<any> {
        return await this.request(`/admin/trainees`, 'GET', params)
    }

    async getTraineeById(traineeId: number): Promise<any> {
        return await this.request(`/admin/trainees/${traineeId}`, 'GET')
    }

    async saveTrainee(params: object): Promise<any> {
        return await this.request(`/admin/trainees`, 'POST', params)
    }

    async updateTrainee(traineeId: number, params: object): Promise<any> {
        return await this.request(`/admin/trainees/${traineeId}`, 'PUT', params)
    }

    async deleteTrainee(traineeId: number): Promise<any> {
        return await this.request(`/admin/trainees/${traineeId}`, 'DELETE')
    }
}

export const traineeService = new TraineeService()