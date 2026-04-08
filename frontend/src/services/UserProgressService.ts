import axios from '../config/axiosConfig';
import { UserProgress } from '../types/UserProgress';

export class UserProgressService {
  private static readonly BASE_URL = '/api/progress';

  static async getRoadmapProgress(roadmapId: string): Promise<UserProgress> {
    const response = await axios.get(`${this.BASE_URL}/roadmap/${roadmapId}`);
    return response.data;
  }

  static async getUserProgress(): Promise<UserProgress[]> {
    const response = await axios.get(`${this.BASE_URL}/user`);
    return response.data;
  }

  static async createProgress(roadmapId: string): Promise<UserProgress> {
    const response = await axios.post(`${this.BASE_URL}/roadmap/${roadmapId}`);
    return response.data;
  }

  static async updateItemProgress(
    progressId: string,
    itemId: string,
    percentage: number
  ): Promise<UserProgress> {
    const response = await axios.put(
      `${this.BASE_URL}/${progressId}/item/${itemId}`,
      null,
      { params: { percentage } }
    );
    return response.data;
  }

  static async markItemCompleted(
    progressId: string,
    itemId: string
  ): Promise<UserProgress> {
    const response = await axios.put(
      `${this.BASE_URL}/${progressId}/item/${itemId}/complete`
    );
    return response.data;
  }

  static async updateTimeSpent(
    progressId: string,
    minutes: number
  ): Promise<UserProgress> {
    const response = await axios.put(
      `${this.BASE_URL}/${progressId}/time`,
      null,
      { params: { minutes } }
    );
    return response.data;
  }
}
