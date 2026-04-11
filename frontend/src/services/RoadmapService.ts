import axios from '../config/axiosConfig';
import { Roadmap, RoadmapRating, UserProfile } from '../types/Roadmap';

export class RoadmapService {
  private static readonly BASE_URL = '/api/roadmaps';
  
  static async getPublicRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/public`);
    return response.data;
  }
  
  static async getTemplateRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/templates`);
    return response.data;
  }
  
  static async getUserRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/user`);
    return response.data;
  }
  
  static async getRoadmapsByCategory(category: string): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/category/${category}`);
    return response.data;
  }
  
  static async getRoadmapsByDifficulty(level: string): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/difficulty/${level}`);
    return response.data;
  }
  
  static async searchRoadmaps(query: string): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/search`, {
      params: { query },
    });
    return response.data;
  }
  
  static async getRoadmapsByTags(tags: string[]): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/tags`, {
      params: { tags },
    });
    return response.data;
  }
  
  static async getRoadmap(id: string): Promise<Roadmap> {
    const response = await axios.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }
  
  static async createRoadmap(roadmap: Roadmap): Promise<Roadmap> {
    const response = await axios.post(this.BASE_URL, roadmap);
    return response.data;
  }
  
  static async updateRoadmap(id: string, roadmap: Roadmap): Promise<Roadmap> {
    const response = await axios.put(`${this.BASE_URL}/${id}`, roadmap);
    return response.data;
  }
  
  static async deleteRoadmap(id: string): Promise<void> {
    await axios.delete(`${this.BASE_URL}/${id}`);
  }
  
  static async cloneTemplate(templateId: string): Promise<Roadmap> {
    const response = await axios.post(`${this.BASE_URL}/templates/${templateId}/clone`);
    return response.data;
  }
  
  static async countUserRoadmaps(): Promise<number> {
    const response = await axios.get(`${this.BASE_URL}/user/count`);
    return response.data;
  }

  // ─── Rating & Reviews ───

  static async rateRoadmap(id: string, rating: number, review?: string): Promise<RoadmapRating> {
    const response = await axios.post(`${this.BASE_URL}/${id}/rate`, { rating, review });
    return response.data;
  }

  static async getRoadmapRatings(id: string): Promise<RoadmapRating[]> {
    const response = await axios.get(`${this.BASE_URL}/${id}/ratings`);
    return response.data;
  }

  static async getRatingSummary(id: string): Promise<{ averageRating: number; ratingCount: number }> {
    const response = await axios.get(`${this.BASE_URL}/${id}/ratings/summary`);
    return response.data;
  }

  static async getMyRating(id: string): Promise<RoadmapRating | null> {
    const response = await axios.get(`${this.BASE_URL}/${id}/ratings/mine`);
    return response.status === 204 ? null : response.data;
  }

  static async deleteMyRating(id: string): Promise<void> {
    await axios.delete(`${this.BASE_URL}/${id}/ratings/mine`);
  }

  // ─── Discovery ───

  static async getPopularRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/discover/popular`);
    return response.data;
  }

  static async getRecentRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/discover/recent`);
    return response.data;
  }

  static async getMostClonedRoadmaps(): Promise<Roadmap[]> {
    const response = await axios.get(`${this.BASE_URL}/discover/most-cloned`);
    return response.data;
  }

  // ─── Clone ───

  static async cloneRoadmap(id: string): Promise<Roadmap> {
    const response = await axios.post(`${this.BASE_URL}/${id}/clone`);
    return response.data;
  }

  // ─── Profile ───

  static async getMyProfile(): Promise<UserProfile> {
    const response = await axios.get('/api/profile/me');
    return response.data;
  }

  static async updateMyProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.put('/api/profile/me', data);
    return response.data;
  }

  static async getUserProfile(username: string): Promise<UserProfile> {
    const response = await axios.get(`/api/profile/user/${username}`);
    return response.data;
  }

  static async getUserPublicRoadmaps(username: string): Promise<Roadmap[]> {
    const response = await axios.get(`/api/profile/user/${username}/roadmaps`);
    return response.data;
  }
} 