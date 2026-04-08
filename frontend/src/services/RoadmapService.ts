import axios from '../config/axiosConfig';
import { Roadmap } from '../types/Roadmap';

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
} 