import BaseApiService from "./BaseAPIService"

class TrainingService extends BaseApiService {
    async getTrainings(params: object): Promise<any> {
        return await this.request(`/admin/trainings`, 'GET', params)
    }

    async getTrainingById(trainingId: number): Promise<any> {
        return await this.request(`/admin/trainings/${trainingId}`, 'GET')
    }

    async saveTraining(params: object): Promise<any> {
        return await this.request(`/admin/trainings`, 'POST', params)
    }

    async updateTraining(trainingId: number, params: object): Promise<any> {
        return await this.request(`/admin/trainings/${trainingId}`, 'PUT', params)
    }

    async updateTrainingThumbnailImage(trainingId: number, params: object): Promise<any> {
        return await this.request(`/admin/trainings/${trainingId}/update-training-image`, 'POST', params)
    }

    async deleteTraining(trainingId: number): Promise<any> {
        return await this.request(`/admin/trainings/${trainingId}`, 'DELETE')
    }

    async getWebsiteTrainings(params: object): Promise<any> {
        return await this.request(`/trainings`, 'GET', params)
    }

    async getWebsiteTrainingBySlug(slug: string): Promise<any> {
        return await this.request(`/trainings/${slug}`, 'GET')
    }

    async getWebsiteTrainingTrainees(slug: string, params: object): Promise<any> {
        return await this.request(`/trainings/${slug}/trainees`, 'GET', params)
    }
}

export const trainingService = new TrainingService()