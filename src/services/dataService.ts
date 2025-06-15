
import { Hackathon, Idea, User } from '@/types';
import { mockHackathons, mockIdeas, mockUsers } from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// localStorage keys
const STORAGE_KEYS = {
  ideas: 'hackathon_ideas',
  hackathons: 'hackathon_events',
  users: 'hackathon_users'
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ideas)) {
    localStorage.setItem(STORAGE_KEYS.ideas, JSON.stringify(mockIdeas));
  }
  if (!localStorage.getItem(STORAGE_KEYS.hackathons)) {
    localStorage.setItem(STORAGE_KEYS.hackathons, JSON.stringify(mockHackathons));
  }
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(mockUsers));
  }
};

// Helper functions
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
  async getHackathons(): Promise<Hackathon[]> {
    initializeStorage();
    await delay(800);
    return getFromStorage<Hackathon>(STORAGE_KEYS.hackathons);
  },

  async getIdeas(): Promise<Idea[]> {
    initializeStorage();
    await delay(600);
    return getFromStorage<Idea>(STORAGE_KEYS.ideas);
  },

  async getUsers(): Promise<User[]> {
    initializeStorage();
    await delay(400);
    return getFromStorage<User>(STORAGE_KEYS.users);
  },

  async getHackathonById(id: string): Promise<Hackathon | null> {
    initializeStorage();
    await delay(300);
    const hackathons = getFromStorage<Hackathon>(STORAGE_KEYS.hackathons);
    return hackathons.find(h => h.id === id) || null;
  },

  async getIdeasByHackathon(hackathonId: string): Promise<Idea[]> {
    initializeStorage();
    await delay(500);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    return ideas.filter(idea => idea.hackathonId === hackathonId);
  },

  async getUserIdeas(userId: string): Promise<Idea[]> {
    initializeStorage();
    await delay(400);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    return ideas.filter(idea => idea.owner.id === userId);
  },

  async createIdea(ideaData: Omit<Idea, 'id' | 'referenceNumber' | 'createdAt'>): Promise<Idea> {
    initializeStorage();
    await delay(500);
    
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const newIdea: Idea = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      referenceNumber: `REF-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedIdeas = [...ideas, newIdea];
    saveToStorage(STORAGE_KEYS.ideas, updatedIdeas);
    
    return newIdea;
  },

  async joinIdea(ideaId: string, userId: string): Promise<boolean> {
    initializeStorage();
    await delay(300);
    
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const users = getFromStorage<User>(STORAGE_KEYS.users);
    const user = users.find(u => u.id === userId);
    
    if (!user) return false;
    
    const ideaIndex = ideas.findIndex(i => i.id === ideaId);
    if (ideaIndex === -1) return false;
    
    // Check if user is already a participant
    if (ideas[ideaIndex].participants.some(p => p.id === userId)) {
      return false;
    }
    
    ideas[ideaIndex].participants.push(user);
    saveToStorage(STORAGE_KEYS.ideas, ideas);
    
    return true;
  },

  async joinHackathon(hackathonId: string, userId: string): Promise<boolean> {
    initializeStorage();
    await delay(300);
    
    const hackathons = getFromStorage<Hackathon>(STORAGE_KEYS.hackathons);
    const hackathonIndex = hackathons.findIndex(h => h.id === hackathonId);
    
    if (hackathonIndex === -1) return false;
    
    hackathons[hackathonIndex].currentParticipants += 1;
    saveToStorage(STORAGE_KEYS.hackathons, hackathons);
    
    return true;
  }
};
