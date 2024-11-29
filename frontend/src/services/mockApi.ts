// Mock API responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    async login(credentials: { email: string; password: string }) {
      await delay(500); // Simulate network delay
      return {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '123',
            email: credentials.email,
            name: 'Test User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    },
  },
  
  sessions: {
    async createSession(session: any) {
      await delay(500);
      return {
        data: {
          ...session,
          id: Math.random().toString(36).substr(2, 9),
        },
      };
    },
    
    async getSessions() {
      await delay(500);
      return {
        data: [],
      };
    },
  },
  
  progress: {
    async addProgress(progress: any) {
      await delay(500);
      return {
        data: {
          ...progress,
          id: Math.random().toString(36).substr(2, 9),
        },
      };
    },
    
    async getProgress() {
      await delay(500);
      return {
        data: [],
      };
    },
  },
};
