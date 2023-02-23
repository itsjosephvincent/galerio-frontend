import BaseApiService from "./BaseAPIService"

class BlogService extends BaseApiService {
    async getBlogs(params: object): Promise<any> {
        return await this.request(`/admin/blogs`, 'GET', params)
    }

    async getBlogById(blogId: number): Promise<any> {
        return await this.request(`/admin/blogs/${blogId}`, 'GET')
    }

    async saveBlog(params: object): Promise<any> {
        return await this.request(`/admin/blogs`, 'POST', params)
    }

    async updateBlog(blogId: number, params: object): Promise<any> {
        return await this.request(`/admin/blogs/${blogId}`, 'PUT', params)
    }

    async updateBlogThumbnailImage(blogId: number, params: object): Promise<any> {
        return await this.request(`/admin/blogs/${blogId}/update-blog-thumbnail`, 'POST', params)
    }

    async deleteBlog(blogId: number): Promise<any> {
        return await this.request(`/admin/blogs/${blogId}`, 'DELETE')
    }

    async getWebsiteBlogs(params: object): Promise<any> {
        return await this.request(`/blogs`, 'GET', params)
    }

    async getWebsiteBlogBySlug(slug: string): Promise<any> {
        return await this.request(`/blogs/${slug}`, 'GET')
    }
}

export const blogService = new BlogService()