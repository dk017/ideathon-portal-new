import { Event, Idea, JoinRequest, User } from '@/types';
import { mockEvents as mockEvents, mockIdeas, mockUsers } from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// localStorage keys
const STORAGE_KEYS = {
  ideas: 'event_ideas',
  events: 'event_events',
  users: 'event_users'
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ideas)) {
    localStorage.setItem(STORAGE_KEYS.ideas, JSON.stringify(mockIdeas));
  }
  if (!localStorage.getItem(STORAGE_KEYS.events)) {
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(mockEvents));
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
  async getEvents(): Promise<Event[]> {
    initializeStorage();
    await delay(800);
    return getFromStorage<Event>(STORAGE_KEYS.events);
  },

  async getEventById(id: string): Promise<Event | null> {
    initializeStorage();
    await delay(300);
    const events = getFromStorage<Event>(STORAGE_KEYS.events);
    return events.find(e => e.id === id) || null;
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

  async getIdeasByEvent(eventId: string): Promise<Idea[]> {
    initializeStorage();
    await delay(500);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    return ideas.filter(idea => idea.eventId === eventId);
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

  async joinEvent(eventId: string, userId: string): Promise<boolean> {
    initializeStorage();
    await delay(300);

    const events = getFromStorage<Event>(STORAGE_KEYS.events);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) return false;

    events[eventIndex].currentParticipants += 1;
    saveToStorage(STORAGE_KEYS.events, events);

    return true;
  },

  async requestJoinIdea(ideaId: string, userId: string): Promise<'requested' | 'already-requested' | 'already-participant' | 'not-found'> {
    initializeStorage();
    await delay(300);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const users = getFromStorage<User>(STORAGE_KEYS.users);
    const user = users.find(u => u.id === userId);
    if (!user) return 'not-found';
    const ideaIndex = ideas.findIndex(i => i.id === ideaId);
    if (ideaIndex === -1) return 'not-found';
    if (!ideas[ideaIndex].joinRequests) ideas[ideaIndex].joinRequests = [];
    if (ideas[ideaIndex].participants.some(p => p.id === userId)) return 'already-participant';
    if (ideas[ideaIndex].joinRequests.some((r: User) => r.id === userId)) return 'already-requested';
    ideas[ideaIndex].joinRequests.push(user);
    saveToStorage(STORAGE_KEYS.ideas, ideas);
    return 'requested';
  },

  async acceptJoinRequest(ideaId: string, userId: string): Promise<boolean> {
    initializeStorage();
    await delay(300);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const users = getFromStorage<User>(STORAGE_KEYS.users);
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    const ideaIndex = ideas.findIndex(i => i.id === ideaId);
    if (ideaIndex === -1) return false;
    if (!ideas[ideaIndex].joinRequests) ideas[ideaIndex].joinRequests = [];
    // Remove from joinRequests
    ideas[ideaIndex].joinRequests = ideas[ideaIndex].joinRequests.filter((r: User) => r.id !== userId);
    // Add to participants if not already
    if (!ideas[ideaIndex].participants.some(p => p.id === userId)) {
      ideas[ideaIndex].participants.push(user);
    }
    saveToStorage(STORAGE_KEYS.ideas, ideas);
    return true;
  },

  async rejectJoinRequest(ideaId: string, userId: string): Promise<boolean> {
    initializeStorage();
    await delay(300);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const ideaIndex = ideas.findIndex(i => i.id === ideaId);
    if (ideaIndex === -1) return false;
    if (!ideas[ideaIndex].joinRequests) ideas[ideaIndex].joinRequests = [];
    // Remove from joinRequests
    ideas[ideaIndex].joinRequests = ideas[ideaIndex].joinRequests.filter((r: User) => r.id !== userId);
    saveToStorage(STORAGE_KEYS.ideas, ideas);
    return true;
  },

  async createEvent(eventData: Omit<Event, 'id' | 'ideas' | 'currentParticipants'>): Promise<Event> {
    initializeStorage();
    await delay(500);
    const events = getFromStorage<Event>(STORAGE_KEYS.events);
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      ideas: [],
      currentParticipants: 0,
    };
    const updatedEvents = [...events, newEvent];
    saveToStorage(STORAGE_KEYS.events, updatedEvents);
    return newEvent;
  },

  async updateIdea(updatedIdea: Idea): Promise<Idea> {
    initializeStorage();
    await delay(400);
    const ideas = getFromStorage<Idea>(STORAGE_KEYS.ideas);
    const idx = ideas.findIndex(i => i.id === updatedIdea.id);
    if (idx === -1) throw new Error('Idea not found');
    ideas[idx] = { ...ideas[idx], ...updatedIdea };
    saveToStorage(STORAGE_KEYS.ideas, ideas);
    return ideas[idx];
  }
};
