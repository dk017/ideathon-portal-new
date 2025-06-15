
import { Hackathon, Idea, User } from '@/types';
import { mockHackathons, mockIdeas, mockUsers } from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  async getHackathons(): Promise<Hackathon[]> {
    await delay(800); // Simulate network delay
    return mockHackathons;
  },

  async getIdeas(): Promise<Idea[]> {
    await delay(600);
    return mockIdeas;
  },

  async getUsers(): Promise<User[]> {
    await delay(400);
    return mockUsers;
  },

  async getHackathonById(id: string): Promise<Hackathon | null> {
    await delay(300);
    return mockHackathons.find(h => h.id === id) || null;
  },

  async getIdeasByHackathon(hackathonId: string): Promise<Idea[]> {
    await delay(500);
    return mockIdeas.filter(idea => idea.hackathonId === hackathonId);
  },

  async getUserIdeas(userId: string): Promise<Idea[]> {
    await delay(400);
    return mockIdeas.filter(idea => idea.owner.id === userId);
  }
};
