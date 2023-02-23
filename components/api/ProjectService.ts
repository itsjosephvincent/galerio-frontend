import BaseApiService from "./BaseAPIService"

class ProjectService extends BaseApiService {
    async getProjects(params: object): Promise<any> {
        return await this.request(`/admin/projects`, 'GET', params)
    }

    async getProjectById(projectId: number): Promise<any> {
        return await this.request(`/admin/projects/${projectId}`, 'GET')
    }

    async saveProject(params: object): Promise<any> {
        return await this.request(`/admin/projects`, 'POST', params)
    }

    async updateProject(projectId: number, params: object): Promise<any> {
        return await this.request(`/admin/projects/${projectId}`, 'PUT', params)
    }

    async updateProjectThumbnailImage(projectId: number, params: object): Promise<any> {
        return await this.request(`/admin/projects/${projectId}/update-project-thumbnail`, 'POST', params)
    }

    async deleteProject(projectId: number): Promise<any> {
        return await this.request(`/admin/projects/${projectId}`, 'DELETE')
    }

    async getWebsiteOngoingProjects(params: object): Promise<any> {
        return await this.request(`/projects/on-going`, 'GET', params)
    }

    async getWebsiteCompletedProjects(params: object): Promise<any> {
        return await this.request(`/projects/completed`, 'GET', params)
    }

    async getWebsiteProjectBySlug(slug: string): Promise<any> {
        return await this.request(`/projects/${slug}`, 'GET')
    }
}

export const projectService = new ProjectService()